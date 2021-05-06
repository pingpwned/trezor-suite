import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DeviceImage, Icon, variables } from '@trezor/components';
import { PinInput, Translation, TrezorLink } from '@suite-components';
import { TrezorDevice } from '@suite-types';

import { URLS } from '@suite-constants';
import * as modalActions from '@suite-actions/modalActions';
import { useActions, useTheme } from '@suite-hooks';

const { FONT_SIZE, FONT_WEIGHT, SCREEN_SIZE } = variables;

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    flex: 1;

    @media only screen and (max-width: ${SCREEN_SIZE.MD}) {
        flex-direction: column;
    }
`;

const Col = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 5px;
    width: 100%;
    max-width: 340px;
`;

const GreyCol = styled(Col)`
    background: ${props => props.theme.BG_GREY};
    padding: 20px 24px;
    margin-right: 34px;
    max-width: 360px;

    @media only screen and (max-width: ${SCREEN_SIZE.MD}) {
        display: none;
    }
`;

const Item = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    flex: 1;
`;

// const Divider = styled.div`
//     width: 100%;
//     height: 1px;
//     background: ${props => props.theme.STROKE_GREY_ALT};
// `;

const ItemIconWrapper = styled.div`
    display: flex;
    width: 30px;
    margin-right: 20px;
    justify-content: center;
`;

const ItemText = styled.div`
    width: 100%;
    color: ${props => props.theme.TYPE_DARK_GREY};
    font-size: ${FONT_SIZE.SMALL};
    font-weight: ${FONT_WEIGHT.MEDIUM};
    padding: 26px 0px;
    text-align: left;
    /* border-bottom: 1px solid #ccc; */
`;

const ExplanationCol = ({ invalid }: Pick<Props, 'invalid'>) => {
    // TODO: Borders to match design
    const { theme } = useTheme();
    return (
        <GreyCol>
            {invalid ? (
                <Item>
                    <ItemIconWrapper>
                        <Icon icon="WARNING_ACTIVE" size={40} color={theme.TYPE_RED} />
                    </ItemIconWrapper>
                    <ItemText>
                        <Translation id="TR_WRONG_PIN_ENTERED" />
                        {/* <Divider /> */}
                    </ItemText>
                </Item>
            ) : (
                <Item>
                    <ItemIconWrapper>
                        <DeviceImage trezorModel={1} height={40} />
                    </ItemIconWrapper>
                    <ItemText>
                        <Translation id="TR_PIN_MATRIX_DISPLAYED_ON_TREZOR" />
                        {/* <Divider /> */}
                    </ItemText>
                </Item>
            )}

            <Item>
                <ItemIconWrapper>
                    <Icon icon="ASTERISK" size={20} />
                </ItemIconWrapper>
                <ItemText>
                    <Translation id="TR_MAXIMUM_LENGTH_IS_9_DIGITS" />
                    {/* <Divider /> */}
                </ItemText>
            </Item>

            <Item>
                <ItemIconWrapper>
                    <Icon icon="PIN" size={26} />
                </ItemIconWrapper>
                <ItemText>
                    <TrezorLink variant="underline" href={URLS.PIN_MANUAL_URL}>
                        <Translation id="TR_HOW_PIN_WORKS" />
                    </TrezorLink>
                </ItemText>
            </Item>
        </GreyCol>
    );
};

interface Props {
    device: TrezorDevice;
    hideExplanation?: boolean;
    invalid?: boolean;
}

const PinMatrix = ({ device, hideExplanation, invalid }: Props) => {
    const [submitted, setSubmitted] = useState(false);
    const { onPinSubmit } = useActions({ onPinSubmit: modalActions.onPinSubmit });
    const pinRequestType = device.buttonRequests[device.buttonRequests.length - 1];

    useEffect(() => {
        if (
            [
                'PinMatrixRequestType_NewFirst',
                'PinMatrixRequestType_NewSecond',
                'PinMatrixRequestType_Current',
            ].includes(pinRequestType)
        ) {
            setSubmitted(false);
        }
    }, [pinRequestType]);

    if (!device.features) return null;

    const submit = (pin: string) => {
        onPinSubmit(pin);
        setSubmitted(true);
    };

    return (
        <Wrapper>
            {!hideExplanation && <ExplanationCol invalid={invalid} />}
            <Col>
                <PinInput isSubmitting={submitted} onPinSubmit={submit} />
            </Col>
        </Wrapper>
    );
};

export default PinMatrix;
