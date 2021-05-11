import { Translation, Notifications } from '@suite-components';
import { Dropdown, DropdownRef, variables } from '@trezor/components';
import React, { useRef, useCallback, useState } from 'react';
import styled from 'styled-components';
import ActionItem from '../ActionItem';
import { useActions } from '@suite-hooks';
import * as notificationActions from '@suite-actions/notificationActions';
import * as routerActions from '@suite-actions/routerActions';

const Wrapper = styled.div<Pick<Props, 'marginLeft' | 'marginRight'>>`
    margin-left: ${props => props.marginLeft};
    margin-right: ${props => props.marginRight};
`;

const LabelWithIcon = styled.div`

`;

const NotificationsWrapper = styled.div`
    width: 450px;
    /* overwrite pointer cursor which is defined on Dropdown element by default */
    cursor: default;
    @media screen and (max-width: ${variables.SCREEN_SIZE.LG}) {
        width: 330px;
    }
`;

interface Props {
    marginLeft?: string;
    marginRight?: string;
}

const SettingsDropdown = (props: Props) => {
    // use "opened" state to decide if "active" styles on ActionItem should be applied
    const [opened, setOpened] = useState(false);
    const dropdownRef = useRef<DropdownRef>();

    const { resetUnseen, goto } = useActions({
        resetUnseen: notificationActions.resetUnseen,
        goto: routerActions.goto,
    });

    const handleToggleChange = useCallback(
        (isToggled: boolean) => {
            if (isToggled) {
                setOpened(true);
            } else {
                // if the dropdown is going to be closed, mark all notifications as seen and "deactivate" ActionItem
                resetUnseen();
                setOpened(false);
            }
        },
        [resetUnseen],
    );

    return (
        <Wrapper {...props}>
            <Dropdown
                onToggle={handleToggleChange}
                ref={dropdownRef}
                alignMenu="right"
                offset={34}
                horizontalPadding={10}
                topPadding={0}
                items={[
                    {
                        key: 'settings',
                        label: <Translation id="TR_SETTINGS" />,
                        options: [
                            {
                                key: '1',
                                label: (
                                    <LabelWithIcon>
                                        <Translation id="TR_APPLICATION" />
                                    </LabelWithIcon>
                                ),
                                icon: 'APP',
                                callback: () => {
                                    goto('settings-index');
                                },
                                isRounded: true,
                            },
                            {
                                key: '2',
                                label: (
                                    <LabelWithIcon>
                                        <Translation id="TR_DEVICE" />
                                    </LabelWithIcon>
                                ),
                                icon: 'DEVICE',
                                callback: () => {
                                    goto('settings-device');
                                },
                                isRounded: true,
                            },
                            {
                                key: '3',
                                label: (
                                    <LabelWithIcon>
                                        <Translation id="TR_COINS" />
                                    </LabelWithIcon>
                                ),
                                icon: 'COINS',
                                callback: () => {
                                    goto('settings-coins');
                                },
                                isRounded: true,
                            },
                        ],
                    },
                    {
                        key: 'guide',
                        options: [
                            {
                                key: '4',
                                label: (
                                    <LabelWithIcon>
                                        <Translation id="TR_LEARN_AND_DISCOVER" />
                                    </LabelWithIcon>
                                ),
                                icon: 'LIGHTBULB',
                                callback: () => false, // don't close Dropdown on mouse click automatically
                                isRounded: true,
                            },
                        ],
                    },
                ]}
            >
                <ActionItem
                    label={<Translation id="TR_SETTINGS" />}
                    icon="SETTINGS"
                    isActive={opened}
                />
            </Dropdown>
        </Wrapper>
    );
};

export default SettingsDropdown;
