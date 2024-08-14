const connectToCoinbase = (pair, onMessage) => {
    const ws = new WebSocket(`wss://ws-feed.exchange.coinbase.com`);

    ws.onopen = () => {
        console.log('WebSocket connection opened');
        // Subscribe to the ticker channel
        ws.send(JSON.stringify({
            type: 'subscribe',
            channels: [{ name: 'ticker', product_ids: [pair] }],
        })
        );
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'ticker' && data.product_id === pair) {
            const bid = data.best_bid;
            const ask = data.best_ask;
            const time = new Date(data.time).getTime() / 1000;
            const volume_24h = data.volume_24h;
            onMessage({ bid, ask, time, volume_24h });
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    const unsubscribe = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    type: 'unsubscribe',
                    channels: [{ name: 'ticker', product_ids: [pair] }],
                })
            );
        }
        ws.close();
    };

    return unsubscribe;
};

export default connectToCoinbase;
