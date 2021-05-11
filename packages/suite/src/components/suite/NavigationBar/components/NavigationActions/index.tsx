import React, { useMemo } from 'react';
import styled, { css } from 'styled-components';
import * as walletSettingsActions from '@settings-actions/walletSettingsActions';
import * as suiteActions from '@suite-actions/suiteActions';
import * as routerActions from '@suite-actions/routerActions';
import { Translation } from '@suite-components';
import { Icon, Tooltip, useTheme } from '@trezor/components';
import { findRouteByName } from '@suite-utils/router';
import { useActions, useAnalytics, useSelector } from '@suite-hooks';
import ActionItem from './components/ActionItem';
import TooltipContentTor from './components/TooltipContentTor';
import { isDesktop } from '@suite-utils/env';
import NotificationsDropdown from './components/NotificationsDropdown';
import SettingsDropdown from './components/SettingsDropdown';

const DESKTOP_LAYOUT_ICONS_MARGIN = '28px';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    width: 288px; /* same as DeviceSelector because we need menu in the exact center  */
    justify-content: flex-end;
`;

const MobileWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 0px 16px;
`;

const ActionsContainer = styled.div<{ desktop: boolean; mobileLayout?: boolean }>`
    border-top: 1px solid ${props => props.theme.STROKE_GREY};
    ${props =>
        !props.mobileLayout &&
        `display: flex;
        align-items: center;
        margin-left: ${DESKTOP_LAYOUT_ICONS_MARGIN};
        border-top: 0;
    `}
    ${props =>
        props.desktop &&
        !props.mobileLayout &&
        `
        margin-left: 22px;
        margin-right: -17px;
        padding: 12px 15px;
        border: 1px solid ${props.theme.STROKE_GREY};
        border-radius: 10px;
    `}
`;

const ActionItemWrapper = styled.div`
    position: relative;
`;

const ActionItemTorIndicator = styled.div`
    background: ${props => props.theme.BG_WHITE};
    display: flex;
    align-items: center;
    height: 10px;
    width: 10px;
    border-radius: 50%;
    position: absolute;
    top: 10px;
    right: 10px;
`;

const Separator = styled.div`
    border: 1px solid ${props => props.theme.STROKE_GREY};
    height: 38px;
    width: 0;
    margin: 0 10px;
    opacity: 0.7;
`;

interface Props {
    closeMainNavigation?: () => void;
    isMobileLayout?: boolean;
}

type Route = 'settings-index' | 'notifications-index';

const NavigationActions = (props: Props) => {
    const analytics = useAnalytics();
    const themeColors = useTheme();
    const { activeApp, notifications, discreetMode, tor } = useSelector(state => ({
        activeApp: state.router.app,
        notifications: state.notifications,
        discreetMode: state.wallet.settings.discreetMode,
        tor: state.suite.tor,
        theme: state.suite.settings.theme,
    }));
    const { goto, setDiscreetMode } = useActions({
        goto: routerActions.goto,
        setDiscreetMode: walletSettingsActions.setDiscreetMode,
        setTheme: suiteActions.setTheme,
    });

    const WrapperComponent = props.isMobileLayout ? MobileWrapper : Wrapper;

    const gotoWithReport = (routeName: Route) => {
        if (routeName === 'notifications-index') {
            analytics.report({ type: 'menu/goto/notifications-index' });
        } else if (routeName === 'settings-index') {
            analytics.report({ type: 'menu/goto/settings-index' });
        }
        goto(routeName);
    };

    const action = (route: Route) => {
        gotoWithReport(route);
        if (props.closeMainNavigation) props.closeMainNavigation();
    };

    const getIfRouteIsActive = (route: Route) => {
        const routeObj = findRouteByName(route);
        return routeObj ? routeObj.app === activeApp : false;
    };

    const unseenNotifications = useMemo(() => notifications.some(n => !n.seen), [notifications]);

    return (
        <WrapperComponent>
            <ActionItem
                onClick={() => {
                    analytics.report({
                        type: 'menu/toggle-discreet',
                        payload: {
                            value: !discreetMode,
                        },
                    });
                    setDiscreetMode(!discreetMode);
                }}
                isActive={discreetMode}
                label={<Translation id="TR_DISCREET" />}
                icon={discreetMode ? 'HIDE' : 'SHOW'}
                isMobileLayout={props.isMobileLayout}
            />

            <ActionItemWrapper>
                <ActionItem
                    onClick={() => {
                        analytics.report({
                            type: 'menu/toggle-tor',
                            payload: {
                                value: !tor,
                            },
                        });
                        window.desktopApi!.toggleTor(!tor);
                    }}
                    isActive={tor}
                    label={<Translation id="TR_TOR" />}
                    icon="TOR"
                    isMobileLayout={props.isMobileLayout}
                    marginLeft
                />
                {tor && (
                    <ActionItemTorIndicator>
                        <Icon icon="CHECK" size={10} color={themeColors.TYPE_GREEN} />
                    </ActionItemTorIndicator>
                )}
            </ActionItemWrapper>

            <Separator />

            {isDesktop() && (
                <Tooltip
                    placement="bottom"
                    content={
                        <TooltipContentTor active={tor} action={() => action('settings-index')} />
                    }
                    {...props}
                ></Tooltip>
            )}

            {props.isMobileLayout ? (
                <ActionItem
                    label={<Translation id="TR_NOTIFICATIONS" />}
                    data-test="@suite/menu/notifications-index"
                    onClick={() => action('notifications-index')}
                    isActive={getIfRouteIsActive('notifications-index')}
                    icon="NOTIFICATION"
                    withAlertDot={unseenNotifications}
                    isMobileLayout={props.isMobileLayout}
                />
            ) : (
                <NotificationsDropdown withAlertDot={!unseenNotifications} />
            )}

            {props.isMobileLayout ? (
                <ActionItem
                    label={<Translation id="TR_SETTINGS" />}
                    data-test="@suite/menu/settings-index"
                    onClick={() => action('settings-index')}
                    isActive={getIfRouteIsActive('settings-index')}
                    icon="SETTINGS"
                    isMobileLayout={props.isMobileLayout}
                    marginLeft
                />
            ) : (
                <SettingsDropdown />
            )}

        </WrapperComponent>
    );
};

export default NavigationActions;
