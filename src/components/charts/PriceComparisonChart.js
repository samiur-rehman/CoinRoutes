import React, { useEffect, useRef } from 'react';
import { createChart, CrosshairMode } from 'lightweight-charts';

const PriceComparisonChart = ({ bidData, askData }) => {
    const chartContainerRef = useRef(null);
    const chartRef = useRef(null);
    const bidSeriesRef = useRef(null);
    const askSeriesRef = useRef(null);

    useEffect(() => {
        if (chartContainerRef.current) {
            chartRef.current = createChart(chartContainerRef.current, {
                width: chartContainerRef.current.clientWidth,
                height: 300,
                crosshair: {
                    mode: CrosshairMode.Normal,
                },
                layout: {
                    backgroundColor: '#ffffff',
                    textColor: '#000',
                },
                grid: {
                    vertLines: {
                        color: '#e1e1e1',
                    },
                    horzLines: {
                        color: '#e1e1e1',
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

            bidSeriesRef.current = chartRef.current.addLineSeries({
                lineWidth: 2,
            });

            askSeriesRef.current = chartRef.current.addLineSeries({
                lineWidth: 2,
            });
        }

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
    }, []);

    useEffect(() => {
        if (bidSeriesRef.current && bidData) {
            bidSeriesRef.current.setData(bidData);
        }
    }, [bidData]);

    useEffect(() => {
        if (askSeriesRef.current && askData) {
            askSeriesRef.current.setData(askData);
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

export default PriceComparisonChart;
