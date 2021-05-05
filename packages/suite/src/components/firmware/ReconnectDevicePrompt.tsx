import React from 'react';
import styled, { css } from 'styled-components';
import { H1, Button, variables } from '@trezor/components';
import { Translation, WebusbButton } from '@suite-components';
import { DeviceAnimation } from '@onboarding-components';
import { useDevice, useFirmware } from '@suite-hooks';
import { isDesktop, isMac } from '@suite-utils/env';
import { DESKTOP_WRAPPER_BORDER_WIDTH } from '@suite-constants/layout';

const Wrapper = styled.div`
    display: flex;
    flex: 1;
    padding: 24px;
    box-shadow: 0 2px 5px 0 ${props => props.theme.BOX_SHADOW_BLACK_20};
    background: ${props => props.theme.BG_WHITE};
    border-radius: 16px;
    max-width: 560px;
`;

const Overlay = styled.div<{ desktopBorder?: string }>`
    position: fixed;
    z-index: 10000;
    width: ${props => (props.desktopBorder ? `calc(100% - (${props.desktopBorder} * 2))` : '100%')};
    height: ${props => (props.desktopBorder ? `calc(100% - ${props.desktopBorder})` : '100%')};
    top: 0px;
    left: ${props => props.desktopBorder || 0};
    background: rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(5px);
    display: flex;
    align-items: center;
    overflow: auto;
    justify-content: center;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    padding: 10px 14px;
    margin-left: 24px;
`;

const Bottom = styled.div`
    display: flex;
    flex: 1;
    align-items: flex-end;
    justify-content: center;
`;

const BulletPointWrapper = styled.div`
    display: flex;
    align-items: center;

    & + & {
        margin-top: 24px;
    }
`;

const BulletPointNumber = styled.div<{ active?: boolean }>`
    display: flex;
    flex: 0 0 auto;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    margin-right: 14px;
    font-size: ${variables.FONT_SIZE.SMALL};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    background: ${props => props.theme.BG_GREY};
    font-variant-numeric: tabular-nums;

    ${props =>
        props.active &&
        css`
            color: ${props => props.theme.TYPE_GREEN};
            background: ${props => props.theme.BG_LIGHT_GREEN};
        `}
`;
const BulletPointText = styled.span<{ active?: boolean }>`
    font-size: ${variables.FONT_SIZE.NORMAL};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    ${props =>
        props.active &&
        css`
            color: ${props => props.theme.TYPE_GREEN};
        `}
`;

const StyledDeviceAnimation = styled(DeviceAnimation)`
    flex: 0 0 200px;
    width: 200px;
    height: 200px;
`;

const Heading = styled(H1)`
    margin-bottom: 16px;
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};
`;

const getTextForMode = (requestedMode: 'bootloader' | 'normal', deviceVersion: number) => {
    const text = {
        bootloader: {
            headingStart: <Translation id="TR_RECONNECT_IN_BOOTLOADER" />,
            headingSuccess: <Translation id="TR_RECONNECT_IN_BOOTLOADER_SUCCESS" />,
            steps: [
                {
                    label: <Translation id="TR_DISCONNECT_YOUR_DEVICE" />,
                },
                {
                    label:
                        deviceVersion === 1 ? (
                            <Translation id="TR_HOLD_LEFT_BUTTON" />
                        ) : (
                            <Translation id="TR_SWIPE_YOUR_FINGERS" />
                        ),
                },
            ],
        },
        normal: {
            headingStart: <Translation id="TR_RECONNECT_IN_NORMAL" />,
            headingSuccess: <Translation id="TR_RECONNECT_IN_NORMAL_SUCCESS" />,
            steps: [
                {
                    label: <Translation id="TR_DISCONNECT_YOUR_DEVICE" />,
                },
                {
                    label:
                        deviceVersion === 1 ? (
                            <Translation id="FIRMWARE_CONNECT_IN_NORMAL_MODEL_1" />
                        ) : (
                            <Translation id="FIRMWARE_CONNECT_IN_NORMAL_MODEL_2" />
                        ),
                },
            ],
        },
    };
    return text[requestedMode];
};
interface Props {
    deviceVersion: number;
    requestedMode: 'bootloader' | 'normal';
}

const ReconnectDevicePrompt = ({ deviceVersion, requestedMode }: Props) => {
    const { device } = useDevice();
    const { firmwareUpdate, isWebUSB } = useFirmware();

    const activeStep = device?.connected ? 0 : 1; // 0: disconnect device, 1: instructions to reconnect in bootloader
    const showWebUSB = !device?.connected && isWebUSB;
    const isStepActive = (num: number) => activeStep === num;
    const text = getTextForMode(requestedMode, deviceVersion);

    // Either the device is connect and in bl mode OR
    // TODO: special case where device isn't reporting bootloader mode, but it is already in it. VERIFY
    const reconnectedInBootloader =
        device?.connected &&
        (device?.mode === 'bootloader' || device?.features?.firmware_present !== null);

    const reconnectedInNormal = device?.connected && device?.mode === 'normal';
    const reconnectedInRequestedMode =
        requestedMode === 'bootloader' ? reconnectedInBootloader : reconnectedInNormal;

    const successAction =
        requestedMode === 'bootloader' ? (
            <Button onClick={firmwareUpdate} data-test="@firmware/install-button">
                <Translation id="TR_INSTALL" />
            </Button>
        ) : undefined;

    return (
        <Overlay desktopBorder={isDesktop() && !isMac() ? DESKTOP_WRAPPER_BORDER_WIDTH : undefined}>
            <Wrapper data-test={`@firmware/reconnect-device/${requestedMode}`}>
                <StyledDeviceAnimation
                    type="BOOTLOADER"
                    size={200}
                    shape="ROUNDED"
                    version={device?.features?.major_version === 1 ? '1' : 'T'}
                    loop
                />
                <Content>
                    <Heading>
                        {!reconnectedInRequestedMode ? text.headingStart : text.headingSuccess}
                    </Heading>
                    {!reconnectedInRequestedMode ? (
                        text.steps.map((step, i) => (
                            // static array, using index as a key is fine
                            // eslint-disable-next-line react/no-array-index-key
                            <React.Fragment key={i}>
                                {/* First step asks for disconnecting a device */}
                                {/* Second step reconnect in normal mode or bootloader */}
                                <BulletPointWrapper>
                                    <BulletPointNumber active={isStepActive(i)}>
                                        {i + 1}
                                    </BulletPointNumber>
                                    <BulletPointText active={isStepActive(i)}>
                                        {step.label}
                                    </BulletPointText>
                                </BulletPointWrapper>
                                {isStepActive(2) && showWebUSB && (
                                    <WebusbButton ready>
                                        <Button icon="PLUS" variant="primary">
                                            <Translation id="TR_CHECK_FOR_DEVICES" />
                                        </Button>
                                    </WebusbButton>
                                )}
                            </React.Fragment>
                        ))
                    ) : (
                        <Bottom>{successAction}</Bottom>
                    )}
                </Content>
            </Wrapper>
        </Overlay>
    );
};

export { ReconnectDevicePrompt };
