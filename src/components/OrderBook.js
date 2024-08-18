import React, { useState, useEffect } from 'react';
import connectToCoinbase from '../services/coinbaseWebSocket';

export const OrderBook = ({ pair }) => {
    const [orderBookData, setOrderBookData] = useState({ bids: [], asks: [] });
    const increments = [0.01, 0.05, 0.10, 0.50, 1.00];
    const [increment, setIncrement] = useState(0.01);

    useEffect(() => {
        const unsubscribe = connectToCoinbase(pair, 'level2_batch', (data) => {
            if (data.type === 'l2update') {
                const bids = data.changes.filter(([side]) => side === 'buy');
                const asks = data.changes.filter(([side]) => side === 'sell');

                setOrderBookData({
                    bids: aggregateOrderBook(bids, increment, 'buy'),
                    asks: aggregateOrderBook(asks, increment, 'sell'),
                });
            }
        });

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [pair, increment]);

    const aggregateOrderBook = (orders, increment, side) => {
        const aggregatedOrders = {};
        orders.forEach(([_, priceStr, quantityStr]) => {
            const price = parseFloat(priceStr);
            const quantity = parseFloat(quantityStr);
            const priceLevel = Math.round(price / increment) * increment;

            if (!aggregatedOrders[priceLevel]) {
                aggregatedOrders[priceLevel] = 0;
            }
            aggregatedOrders[priceLevel] += quantity;
        });

        return Object.entries(aggregatedOrders)
            .sort(([priceA], [priceB]) => (side === 'buy' ? parseFloat(priceB) - parseFloat(priceA) : parseFloat(priceA) - parseFloat(priceB)));
    };

    return (
        <div className="p-4 bg-black shadow rounded-lg h-[100vh] flex flex-col mt-2 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-300">{pair} Order Book</h3>
                <select
                    value={increment}
                    onChange={(e) => setIncrement(parseFloat(e.target.value))}
                    className="p-2 bg-white border border-gray-300 rounded-md"
                >
                    {increments.map((inc) => (
                        <option key={inc} value={inc}>
                            Aggregate by {inc}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-grow overflow-hidden gap-4">
                <div className="w-1/2  p-4 border border-gray-700 rounded-lg shadow-md overflow-hidden">
                    <div className="flex justify-between border-b border-gray-700 pb-1 mb-2">
                        <h4 className="text-green-500 font-semibold mb-2">Bids</h4>
                        <h4 className="text-gray-400 font-semibold mb-2">Size</h4>
                    </div>
                    <div className="space-y-1">
                        {orderBookData.bids.map(([price, quantity]) => (
                            <div key={price} className="flex justify-between py-1 border-b border-gray-300">
                                <span className="text-green-500">{Number(price).toFixed(3)}</span>
                                <span className='text-gray-400 '>{quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="w-1/2 p-4 border border-gray-700 rounded-lg shadow-md overflow-hidden">
                    <div className="flex justify-between border-b border-gray-700 pb-1 mb-2">
                        <h4 className="text-red-500 font-semibold mb-2">Asks</h4>
                        <h4 className="text-gray-400  font-semibold mb-2">Size</h4>
                    </div>
                    <div className="space-y-1">
                        {orderBookData.asks.map(([price, quantity]) => (
                            <div key={price} className="flex justify-between py-1 border-b border-gray-300">
                                <span className="text-red-500">{Number(price).toFixed(3)}</span>
                                <span className='text-gray-400 '>{quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>

    );
};
