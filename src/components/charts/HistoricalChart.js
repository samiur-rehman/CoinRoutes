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

            // Create histogram series for bids
            bidSeriesRef.current = chartRef.current.addHistogramSeries({
                color: 'rgba(0, 150, 136, 0.7)', // Green color with opacity for bid prices
                lineWidth: 2,
                priceLineVisible: false, // Hide the price line for histogram
                overlay: false, // Place on different price scale
            });

            // Create histogram series for asks
            askSeriesRef.current = chartRef.current.addHistogramSeries({
                color: 'rgba(255, 82, 82, .7)', // Red color with opacity for ask prices
                lineWidth: 2,
                priceLineVisible: false, // Hide the price line for histogram
                overlay: false, // Place on different price scale
            });



            // Resize observer to make the chart responsive
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
            bidSeriesRef.current.setData(bidData);
        }
    }, [bidData]);

    useEffect(() => {
        if (askSeriesRef.current && askData) {
            askSeriesRef.current.setData(askData);
        }
    }, [askData]);

    return (
        <div
            ref={chartContainerRef}
            className="mt-4 bg-white shadow rounded-lg relative"
        />
    );
};

export default HistoricalBarChart;
