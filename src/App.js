import React, { useState } from 'react';
import Dropdown from './components/Dropdown';
import TopOfBook from './components/TopOfBook';
import { OrderBook } from './components/OrderBook';
import RealTimePriceChart from './components/RealTimePriceChart';

const App = () => {
  const cryptoPairs = ["BTC-USD", "ETH-USD", "LTC-USD", "XRP-USD"];
  const [selectedPair, setSelectedPair] = useState("BTC-USD");
  return (
    <div className="p-8 bg-gray-100 h-screen w-screen overflow-x-hidden">
      <Dropdown
        options={cryptoPairs}
        onChange={(pair) => setSelectedPair(pair)}
        value={selectedPair}
      />
      <TopOfBook pair={selectedPair} />
      <RealTimePriceChart pair={selectedPair} />
      <OrderBook pair={selectedPair} />
    </div>
  );
};

export default App;
