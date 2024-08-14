import React, { useState, useEffect, useRef } from 'react';
import connectToCoinbase from '../services/coinbaseWebSocket';
import HistoricalChart from './charts/HistoricalChart';
import PriceComparisonChart from './charts/PriceComparisonChart';

const RealTimePriceChart = ({ pair }) => {
    const [priceData, setPriceData] = useState([]);
    const [currentChart, setCurrentChart] = useState('lineComparison');

    const [bidData, setBidData] = useState([]);
    const [askData, setAskData] = useState([]);
    const unsubscribeRef = useRef(null);

    useEffect(() => {
        setBidData([]);
        setAskData([]);

        if (unsubscribeRef.current) {
            unsubscribeRef.current();
        }

        unsubscribeRef.current = connectToCoinbase(pair, ({ bid, ask, time }) => {

            setBidData((prevBidData) => {
                const lastTime = prevBidData.length > 0 ? prevBidData[prevBidData.length - 1].time : 0;
                if (time > lastTime) {
                    return [...prevBidData, { time, value: parseFloat(bid) }];
                }
                return prevBidData;
            });

            setAskData((prevAskData) => {
                const lastTime = prevAskData.length > 0 ? prevAskData[prevAskData.length - 1].time : 0;
                if (time > lastTime) {
                    return [...prevAskData, { time, value: parseFloat(ask) }];
                }
                return prevAskData;
            });

            setPriceData(prevData => [...prevData, { time, ask, bid }]);
        });

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
            }
        };
    }, [pair]);

    return (
        <div className=" mt-2 p-4 bg-white shadow rounded-lg">
            <div className="mt-2">
                <label className="mr-4">Select Chart:</label>
                <select
                    value={currentChart}
                    onChange={(e) => setCurrentChart(e.target.value)}
                    className="p-2 border rounded"
                >
                    <option value="lineComparison">Line Comparison Chart</option>
                    <option value="Histogram">Histogram Chart</option>
                </select>
            </div>

            {currentChart === 'lineComparison' ? (
                <PriceComparisonChart bidData={bidData} askData={askData} />
            ) : (
                <HistoricalChart pair={pair} bidData={bidData} askData={askData} />
            )}
        </div>
    );
};

export default RealTimePriceChart;
