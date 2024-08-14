const Dropdown = ({ options = [], onChange, value }) => {
    return (
        <select
            className="p-2 border rounded-md bg-white"
            onChange={(e) => onChange(e.target.value)}
            value={value}
        >
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

export default Dropdown;
