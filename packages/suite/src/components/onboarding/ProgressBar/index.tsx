import React from 'react';
import styled, { css } from 'styled-components';
import { Icon, variables } from '@trezor/components';
import { useTheme } from '@suite-hooks';

const ProgressBarWrapper = styled.div`
    display: flex;
    padding: 20px 0;
    width: 100%;
    /* prevents jumping in completed state with check mark icon shown */
    height: 64px;
    justify-content: space-between;
    align-items: center;
`;

const StepWrapper = styled.div<{ active: boolean }>`
    display: flex;
    flex-direction: column;
    padding: 0 20px;
    align-items: center;
    align-self: center;
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    font-size: ${variables.NEUE_FONT_SIZE.NORMAL};
    font-weight: ${variables.FONT_WEIGHT.DEMI_BOLD};

    @media all and (max-width: ${variables.SCREEN_SIZE.LG}) {
        padding: 0;
    }

    ${props =>
        props.active &&
        css`
            color: ${props.theme.TYPE_GREEN};
        `}
`;

const IconWrapper = styled.div<{ stepCompleted?: boolean; active?: boolean }>`
    display: flex;
    width: 32px;
    height: 32px;
    background: ${props => props.theme.BG_GREY};
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-variant-numeric: tabular-nums;

    ${props =>
        props.stepCompleted &&
        css`
            background: ${props => props.theme.BG_LIGHT_GREY};
        `}

    ${props =>
        props.active &&
        css`
            background: ${props.theme.BG_WHITE};
            box-shadow: 0 2px 5px 0 ${props.theme.BOX_SHADOW_BLACK_20};
            color: ${props.theme.TYPE_GREEN};
        `}
`;

const Label = styled.div`
    text-align: center;
    margin: 10px 0 0 0;
    display: block;
    color: ${props => props.theme.TYPE_LIGHT_GREY};
    font-size: ${variables.NEUE_FONT_SIZE.TINY};
    font-weight: ${variables.FONT_WEIGHT.MEDIUM};

    @media all and (max-width: ${variables.SCREEN_SIZE.MD}) {
        display: none;
    }
`;

const Divider = styled.div`
    flex-grow: 1;
    border-bottom: 1px solid ${props => props.theme.STROKE_GREY};
    margin: 20px;

    @media all and (max-width: ${variables.SCREEN_SIZE.MD}) {
        display: none;
    }
`;

interface Props {
    steps: {
        key: string;
        label?: React.ReactNode;
    }[];
    activeStep?: number;
    className?: string;
}

const ProgressBar = ({ steps, activeStep, className }: Props) => {
    const { theme } = useTheme();
    return (
        <ProgressBarWrapper className={className}>
            {steps.map((step, index) => {
                const stepCompleted = (activeStep ?? 0) > index;
                const stepActive = index === activeStep;
                return (
                    <React.Fragment key={step.key}>
                        <StepWrapper active={stepActive}>
                            <IconWrapper active={stepActive} stepCompleted={stepCompleted}>
                                {stepCompleted ? (
                                    <Icon icon="CHECK" color={theme.TYPE_GREEN} />
                                ) : (
                                    // TODO: Proper icon instead of emoji for last step
                                    <>{index === steps.length - 1 ? <>🎉</> : index + 1}</>
                                )}
                            </IconWrapper>
                            <Label>{step.label}</Label>
                        </StepWrapper>
                        {index < steps.length - 1 && <Divider />}
                    </React.Fragment>
                );
            })}
        </ProgressBarWrapper>
    );
};

export default ProgressBar;
