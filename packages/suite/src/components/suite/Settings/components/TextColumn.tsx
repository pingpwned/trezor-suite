import React from 'react';
import styled from 'styled-components';
import { variables } from '@trezor/components';
import { Translation } from '@suite-components';
import { Button } from '@trezor/components';

interface TextColumnProps {
    title?: React.ReactNode;
    description?: React.ReactNode;
    learnMore?: string;
}

const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: left;
    margin-right: 16px;
    max-width: 500px;
`;

const LearnMoreLink = styled.a``;

const LearnMoreButton = styled(Button)`
    max-width: fit-content;
`;

const Description = styled.div`
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    margin-bottom: 12px;
    margin-top: 12px;
    font-size: ${variables.FONT_SIZE.TINY};

    &:last-child {
        margin-bottom: 0px;
    }
`;

const Title = styled.div`
    font-weight: ${variables.FONT_WEIGHT.REGULAR};
`;

const TextColumn = ({ title, description, learnMore }: TextColumnProps) => (
    <Wrapper>
        {title && <Title>{title}</Title>}
        {description && <Description>{description}</Description>}
        {learnMore && (
            <LearnMoreLink
              target="_blank"
              href={learnMore} size="tiny"
            >
                <LearnMoreButton variant="tertiary">
                    <Translation id="TR_LEARN_MORE" />
                </LearnMoreButton>
            </LearnMoreLink>
        )}
    </Wrapper>
);

export default TextColumn;
