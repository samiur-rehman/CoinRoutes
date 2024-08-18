import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const HistoricalBarChart = ({ bidData, askData }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const bidSeriesRef = useRef(null);
    const askSeriesRef = useRef(null);

    useEffect(() => {
        if (chartContainerRef.current) {
            chartRef.current = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: 300,
                layout: {
                    backgroundColor: '#ffffff',
                    textColor: '#000000',
                },
                grid: {
                    vertLines: {
                        color: '#e0e0e0',
                    },
                    horzLines: {
                        color: '#e0e0e0',
                    },
                },
                priceScale: {
                    borderColor: '#cccccc',
                },
                timeScale: {
                    borderColor: '#cccccc',
                    timeVisible: true,
                    secondsVisible: true,
                },
            });

            bidSeriesRef.current = chartRef.current.addHistogramSeries({
                lineWidth: 1,
                priceLineVisible: true,
                overlay: true,
            });

            askSeriesRef.current = chartRef.current.addHistogramSeries({
                lineWidth: 1,
                priceLineVisible: true,
                overlay: true,
            });

            const resizeObserver = new ResizeObserver(() => {
                if (chartContainerRef.current) {
                    chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
                }
            });

            resizeObserver.observe(chartContainerRef.current);

            return () => {
                resizeObserver.disconnect();
                chartRef.current.remove();
            };
        }
    }, []);

    useEffect(() => {
        if (bidSeriesRef.current && bidData) {
            const filteredBidData = bidData.map(item => ({
                ...item,
                color: item.color || 'rgba(0, 150, 136, 0.7)' // Default color for bid data
            }));
            bidSeriesRef.current.setData(filteredBidData);
        }
    }, [bidData]);

    useEffect(() => {
        if (askSeriesRef.current && askData) {
            const filteredAskData = askData.map(item => ({
                ...item,
                color: item.color || 'rgba(255, 82, 82, 0.7)'
            }));
            askSeriesRef.current.setData(filteredAskData);
        }
    }, [askData]);

    return (
        <div className='mt-4 p-4 border border-gray-300 bg-white shadow rounded-lg'>
            <div
                ref={chartContainerRef}
            />
        </div>
    );
};

export default HistoricalBarChart;
