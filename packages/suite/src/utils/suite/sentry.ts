import * as Sentry from '@sentry/browser';

export const setSentryUser = (instanceId: string) => {
    Sentry.configureScope(scope => {
        scope.setUser({ id: instanceId });
    });
};

// analytics is disabled during runtime
export const unsetSentryUser = () => {
    Sentry.configureScope(scope => {
        scope.setUser(null);
    });
};
