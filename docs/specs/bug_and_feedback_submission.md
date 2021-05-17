# Tech Spec: Bug and Feedback Submission
Let users submit bugs or feedback directly from the Suite app.

**Feature Spec:** [Notion](https://www.notion.so/satoshilabs/Feedback-Bug-report-d7cfccbacf084ce3b2bb97ce8c24e8e2#ddfe5670679f4e039a598c3a35d9c3b2), **Design:** [Zeplin](https://zpl.io/aBzxkDq), **Issue:** [GitHub](https://github.com/trezor/trezor-suite/issues/3714)

_note: Though we're dealing with two distinct streams here (bugs and feedback) the technical infrastructure will be mostly identical. Hence, in this spec, we'll call bugs and feedback collectively as messages._

## Scope
At on side we have the Suite application that can send HTTP requests. On the other side we use [Keboola](https://www.keboola.com/) as the central hub for all data collected around Trezor. This spec describes how we connect these two sides.

## Objectives
1. Messages contain mostly structured textual data and sometimes can contain an image.
2. Messages need to be consumed by Keboola.
3. The submitted messages must be kept private as they might contain sensitive user information. Only after going thru a manual triage they might end up in a publicly accessible place like, for example, GitHub issues.
4. The messages should be enriched with a timestamp and client's IP on the server side for client's clock might be off and determining public IP on client side requires an external service anyway.
5. The BE code should be minimal. Most control should be kept in the reach of Suite developers.

## Analytics already do this...
...but it's hacky. The current pipeline from Suite to Keboola goes like this:
- Some trackable event happens in Suite.
- Suite gathers information about the event and the environment and [serializes](https://github.com/trezor/trezor-suite/blob/9d8cea584b1f655f0964d80f863b02b1523e2cad/packages/suite/src/utils/suite/analytics.ts#L12-L33) it into query string format.
- `GET` request is fired to one of the analytics [urls](https://github.com/trezor/trezor-suite/blob/9d8cea584b1f655f0964d80f863b02b1523e2cad/packages/suite/src/actions/suite/analyticsActions.ts#L347-L375) with the assembled query string.
- On these URLs there's a CloudFront that [dumps its access log](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/AccessLogs.html) to S3 bucket. This log contains (among other things) the query string, HTTP headers, IP of the client and timestamp as tab separated values.
- Keboola consumes these log files with the [S3 extractor](https://help.keboola.com/components/extractors/storage/aws-s3/) and uses custom python scripts to parse the information of interest.

Pros:
- infinitely auto-scalable
- zero backend code (modulo the python scripts in Keboola)

Cons:
- No support for images
- Cumbersome marshalling from structured data to query string in Suite and then from query string to CSV in Keboola. Some layers of the setup [might also limit](https://stackoverflow.com/a/812962/5698865) length of the query string rendering it unsuitable to transmit larger sets of data.
- `GET` requests and query strings are not supported by the [Beacon API](https://developer.mozilla.org/en-US/docs/Web/API/Beacon_API) which will be needed for analytics improvements in the future.
- It's brittle. The CloudFronts and buckets are configured manually in AWS with limited access and no versioning.

## Solution
For the first iteration we'll use the same setup as with Analytics. We'll setup four new paths on the `data.trezor.io` domain:
- `/suite/feedback/devel`
- `/suite/feedback/prod`
- `/suite/bugs/devel`
- `/suite/bugs/prod`

with the same exact logging configuration. Tomas ferko will re-use the python scripts in Keboola. 

If user includes an image in a massage it will be uploaded separately and the message will contains just a textual reference to the image. We will provision a pair (for production and dev/staging) of S3 buckets to store the images along with an IAM user who can [only `putObject`](https://stackoverflow.com/questions/37739086/how-to-allow-only-putobject-permissions-on-specific-directory-in-amazon-s3-bucke/37754260#37754260) to these buckets. This prevents unauthorized listing and reading of the uploaded images.

When putting an object into a bucket [the client must give it a key](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingMetadata.html). We'll use an UUID implementation. This prevents both accidental and malicious overriding of uploaded images given the UUID is sufficiently random and has sufficiently large value space. The generated UUID will be used in the actual message as reference of the image.

This opens a possible attack vector for incurring large bills to SatoshiLabs by an attacker uploading large amounts of data to the buckets. This can't be 100% prevented as the API must remain open because Suite's users don't authenticate in any way. A rate limiting could prevent this but that would require some kind of application layer in between the clients and the S3. Instead, for start, we'll start by setting up a [CloudWatch alarm](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/AlarmThatSendsEmail.html) that will warn us if daily uploads exceed some threshold.

## Alternatives
More robust solutions were considered. For example an AWS Lambda accepting JSON in bodies of POST requests persisting them in NoSQL DB (eg. Dynamo DB) would definitely be more robust and future proof solution. However it would also require more effort and especially setting up more resources in AWS. This move awaits us sooner or later but we decided to do it 1) not the last month before official release 2) once we'll map other planned BE use cases that might change the requirements and hence the used technologies.

Reusing the Analytics setup will let us deliver the feature quickly with almost no added complexity on the BE. This is important as our AWS infrastructure is awaiting a consolidation and codification (think Terraform) soon and we want to keep it at absolute minimum until it can be maintained transparently by multiple people with solid tools.

Replacing it in future with something else should be cheap as not much code will be thrown away (there's almost none on BE) and FE won't change much.
