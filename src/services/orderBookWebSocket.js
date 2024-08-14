const connectToOrderBook = (pair, onMessage) => {
    const ws = new WebSocket('wss://ws-feed.exchange.coinbase.com');

    ws.onopen = () => {
        console.log('WebSocket connection opened');
        // Subscribe to the level2 batch channel
        ws.send(JSON.stringify({
            type: 'subscribe',
            channels: [{ name: 'level2_batch', product_ids: [pair] }]
        }));
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
    };

    return () => ws.close();
};

export default connectToOrderBook;
