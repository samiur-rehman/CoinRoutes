import React, { useState, useEffect } from 'react';
import connectToCoinbase from '../services/coinbaseWebSocket';

const TopOfBook = ({ pair }) => {
    const [topOfBook, setTopOfBook] = useState({ bid: null, ask: null, volume: null });

    useEffect(() => {
        const unsubscribe = connectToCoinbase(pair, 'ticker', ({ bid, ask, volume_24h }) => {
            setTopOfBook({ bid, ask, volume_24h });
        });

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [pair]);

    // Calculate the spread
    const spread = topOfBook.ask && topOfBook.bid ? (topOfBook.ask - topOfBook.bid).toFixed(3) : null;

    return (
        <div className="p-4 bg-white shadow rounded-lg mt-2">
            <h3 className="text-xl font-semibold text-gray-800">{pair}</h3>
            <p className="text-green-500">Bid: {topOfBook.bid || 'Loading...'}</p>
            <p className="text-red-500">Ask: {topOfBook.ask || 'Loading...'}</p>
            <p className="text-blue-500">Spread: {spread || 'Loading...'}</p>
            <p className="text-gray-600">
                24h Volume: {Number.isFinite(topOfBook?.volume_24h) ? topOfBook.volume_24h.toFixed(3) : 'Loading...'}
            </p>


        </div>
    );
};

export default TopOfBook;
