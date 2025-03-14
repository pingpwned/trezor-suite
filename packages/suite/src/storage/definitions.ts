import type { BuyTrade, ExchangeTrade, SellVoucherTrade as SpendTrade } from 'invity-api';
import type { DBSchema } from 'idb';

import type { StorageUpdateMessage } from '@trezor/suite-storage';
import type { State as WalletSettings } from '@wallet-reducers/settingsReducer';
import type { SuiteState } from '@suite-reducers/suiteReducer';
import type { State as AnalyticsState } from '@suite-reducers/analyticsReducer';
import type { FormState } from '@wallet-types/sendForm';
import type { AcquiredDevice } from '@suite-types';
import type { MetadataState } from '@suite-types/metadata';
import type { Account, Discovery, CoinFiatRates, WalletAccountTransaction } from '@wallet-types';
import type { GraphData } from '@wallet-types/graph';
import type { TradeType } from '@wallet-types/coinmarketCommonTypes';
import type { MessageSystem } from '@suite-types/messageSystem';
import type { MessageState } from '@suite/reducers/suite/messageSystemReducer';

export interface DBWalletAccountTransaction {
    tx: WalletAccountTransaction;
    order: number;
}

export interface SuiteDBSchema extends DBSchema {
    txs: {
        key: string;
        value: DBWalletAccountTransaction;
        indexes: {
            accountKey: string[]; // descriptor, symbol, deviceState
            txid: WalletAccountTransaction['txid'];
            deviceState: string;
            order: number;
            blockTime: number; // TODO: blockTime can be undefined
        };
    };
    sendFormDrafts: {
        key: string; // accountKey
        value: FormState;
    };
    suiteSettings: {
        key: string;
        value: {
            settings: SuiteState['settings'];
            flags: SuiteState['flags'];
        };
    };
    walletSettings: {
        key: string;
        value: WalletSettings;
    };
    devices: {
        key: string;
        value: AcquiredDevice;
    };
    accounts: {
        key: string[];
        value: Account;
        indexes: {
            deviceState: string;
        };
    };
    discovery: {
        key: string;
        value: Discovery;
    };
    fiatRates: {
        key: string;
        value: CoinFiatRates;
    };
    analytics: {
        key: string;
        value: AnalyticsState;
    };
    graph: {
        key: string[]; // descriptor, symbol, deviceState, interval
        value: GraphData;
        indexes: {
            accountKey: string[]; // descriptor, symbol, deviceState
            deviceState: string;
        };
    };
    coinmarketTrades: {
        key: string;
        value: {
            key?: string;
            date: string;
            tradeType: TradeType;
            data: BuyTrade | ExchangeTrade | SpendTrade;
            account: {
                descriptor?: Account['descriptor'];
                symbol: Account['symbol'];
                accountIndex: Account['index'];
                accountType: Account['accountType'];
            };
        };
    };
    metadata: {
        key: 'state';
        value: MetadataState;
    };
    messageSystem: {
        key: string;
        value: {
            currentSequence: number;
            config: MessageSystem | null;
            dismissedMessages: {
                [key: string]: MessageState;
            };
        };
    };
}

export type SuiteStorageUpdateMessage = StorageUpdateMessage<SuiteDBSchema>;
