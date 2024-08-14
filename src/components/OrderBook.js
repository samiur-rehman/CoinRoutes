import React, { useState, useEffect } from 'react';
import connectToOrderBook from '../services/orderBookWebSocket';
import OrderBookRow from './OrderBookRow';
import AggregationSelector from './AggregationSelector';

const OrderBook = ({ pair }) => {
    const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
    const [aggregationLevel, setAggregationLevel] = useState(0.01);

    useEffect(() => {
        const unsubscribe = connectToOrderBook(pair, (data) => {
            if (data.type === 'l2update') {
                const updatedOrderBook = {
                    bids: aggregateOrders(data.changes.filter(change => change[0] === 'buy'), aggregationLevel),
                    asks: aggregateOrders(data.changes.filter(change => change[0] === 'sell'), aggregationLevel),
                };
                setOrderBook(updatedOrderBook);
            }
        });

        return () => unsubscribe();
    }, [pair, aggregationLevel]);

    const aggregateOrders = (orders, level) => {
        const aggregated = {};

        orders.forEach(([side, price, size]) => {
            const roundedPrice = (Math.floor(price / level) * level).toFixed(2);
            if (aggregated[roundedPrice]) {
                aggregated[roundedPrice] += parseFloat(size);
            } else {
                aggregated[roundedPrice] = parseFloat(size);
            }
        });

        return Object.entries(aggregated).map(([price, size]) => ({
            price: parseFloat(price),
            quantity: size,
        }));
    };

    return (
        <div className="p-4 bg-black shadow rounded-lg h-[100vh] flex flex-col mt-2 overflow-hidden">
            <h3 className="text-xl font-semibold text-white mb-4">{pair} Order Book</h3>
            <AggregationSelector setAggregationLevel={setAggregationLevel} />
            <div className="flex flex-grow overflow-hidden text-white space-x-4">
                {/* Bids Section */}
                <div className="w-1/2 p-2 border border-gray-700 rounded">
                    <div className="flex justify-between border-b border-gray-700 pb-1 mb-2">
                        <h4 className="text-green-500 font-semibold mb-2">Bids</h4>
                        <h4 className="text-green-500 font-semibold mb-2">Size</h4>
                    </div>
                    <div className="overflow-hidden" style={{ height: 'calc(100% - 4rem)' }}>
                        {orderBook.bids.map((order, index) => (
                            <div key={index} className="flex justify-between py-1 border-b border-gray-700">
                                <span className="text-green-500">{order.price.toFixed(2)}</span>
                                <span>{order.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Asks Section */}
                <div className="w-1/2 p-2 border border-gray-700 rounded">
                    <div className="flex justify-between border-b border-gray-700 pb-1 mb-2">
                        <h4 className="text-red-500 font-semibold mb-2">Asks</h4>
                        <h4 className="text-red-500 font-semibold mb-2">Size</h4>


                    </div>
                    <div className="overflow-hidden" style={{ height: 'calc(100% - 4rem)' }}>
                        {orderBook.asks.map((order, index) => (
                            <div key={index} className="flex justify-between py-1 border-b border-gray-700">
                                <span className="text-red-500">{order.price.toFixed(2)}</span>
                                <span>{order.quantity}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>


    );
};

export default OrderBook;
