import React from 'react';
import { Dropdown } from './index';
import { storiesOf } from '@storybook/react';
import { select, number, boolean } from '@storybook/addon-knobs';

storiesOf('Dropdown', module).add('Dropdown', () => {
    const alignMenu: any = select(
        'alignMenu',
        {
            default: null,
            left: 'left',
            right: 'right',
        },
        null
    );
    const isDisabled = boolean('isDisabled', false);
    const offset = number('offset', 10);
    const horizontalPadding = number('Horizontal padding', 0);
    const topPadding = number('Top padding', 8);
    const bottomPadding = number('Bottom padding', 8);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Dropdown
                {...(alignMenu ? { alignMenu } : {})}
                {...(offset ? { offset } : {})}
                {...(isDisabled ? { isDisabled } : {})}
                horizontalPadding={horizontalPadding}
                topPadding={topPadding}
                bottomPadding={bottomPadding}
                items={[
                    // {
                    //     options: [
                    //         {
                    //             label: 'item without a group',
                    //             callback: () => {
                    //                 console.log('item 1 clicked');
                    //             },
                    //         },
                    //     ],
                    // },
                    {
                        key: '1',
                        label: 'Group 1',
                        options: [
                            {
                                key: '1',
                                label: 'item 1',
                                callback: () => {
                                    console.log('item 1 clicked');
                                },
                            },
                            {
                                key: '2',
                                label: 'item 2',
                                callback: () => {
                                    console.log('item 2 clicked');
                                },
                            },
                        ],
                    },
                    {
                        key: '2',
                        label: 'Group 2 - with rounded items',
                        options: [
                            {
                                key: '1',
                                label: 'item 3 with very long name',
                                callback: () => {
                                    console.log('item 3 clicked');
                                },
                                isRounded: true,
                            },
                            {
                                key: '2',
                                label: 'disabled item',
                                callback: () => {
                                    console.log('disabled item clicked');
                                },
                                isRounded: true,
                                isDisabled: true,
                            },

                            {
                                key: '3',
                                label: 'item with iconRight',
                                callback: () => {
                                    console.log('item 4 clicked');
                                },
                                iconRight: 'ARROW_RIGHT',
                                isRounded: true,
                            },
                        ],
                    },
                ]}
            />
        </div>
    );
});
