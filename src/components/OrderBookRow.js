const OrderBookRow = ({ order, type }) => {
    return (
        <div className="flex justify-between py-1">
            <span className={`text-${type === 'bid' ? 'green' : 'red'}-500`}>
                {order.price.toFixed(2)}
            </span>
            <span>{order.quantity}</span>
        </div>
    );
};

export default OrderBookRow;
