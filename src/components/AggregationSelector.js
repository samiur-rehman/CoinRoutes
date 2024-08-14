const AggregationSelector = ({ setAggregationLevel }) => {
    const options = [0.01, 0.05, 0.10, 0.50, 1.00];

    return (
        <div className="my-2">
            <label className="mr-2 text-white ">Aggregation:</label>
            <select
                onChange={(e) => setAggregationLevel(parseFloat(e.target.value))}
                className="p-1 border rounded">
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option.toFixed(2)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default AggregationSelector;
