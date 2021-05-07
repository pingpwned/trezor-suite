# Adding New Firmwares

In case we are about to release both Suite and firmwares we want to add the signed firmwares during the Freeze so QA has the whole thing to test.

1. Complete the firmware release process including firmware signing.
2. Add firmwares to [webwallet-data](github.com/trezor/webwallet-data/) and modify its `releases.json` file. See e.g. [a1831647](https://github.com/trezor/webwallet-data/commit/f8ed15a8999689e7692b8fc4c00b7aaef25d8011) for an example.
3. Deploy them to data.trezor.io. _This is currently done manually and should be automated._
4. Modify `releases.json` also in Suite in `packages/suite-data/files/connect/`. This way you can Freeze Suite without deploying Connect.
5. Publish Connect as beta. TODO: is that correct? How?
6. Bump Connect in Suite. _See [connect/bump.md](../packages/connect/bump.md) on how to do that._
7. Publush Connect as production.
