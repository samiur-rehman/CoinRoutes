const connectToCoinbase = (pair, type, onMessage) => {
    const ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');

    ws.onopen = () => {
        console.log('WebSocket connection opened');
        ws.send(JSON.stringify({
            type: 'subscribe',
            channels: [{ name: type, product_ids: [pair] }]
        }));
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (type === 'ticker' && data.type === 'ticker' && data.product_id === pair) {
            const bid = data.best_bid;
            const ask = data.best_ask;
            const time = new Date(data.time).getTime() / 1000;
            const volume_24h = data.volume_24h;
            onMessage({ bid, ask, time, volume_24h });
        } else if (type === 'level2_batch') {
            onMessage(data);
        }
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };

    const unsubscribe = () => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    type: 'unsubscribe',
                    channels: [{ name: type, product_ids: [pair] }]
                })
            );
        }
        ws.close();
    };

    return unsubscribe;
};

export default connectToCoinbase;

