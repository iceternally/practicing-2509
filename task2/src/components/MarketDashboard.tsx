import MarketChart from './MarketChart';

interface MarketData {
  year: number;
  median_house_value: number;
}

const MarketDashboard = ({ marketData }: { marketData: any[] }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Market Trends</h2>
        <MarketChart marketData={marketData} />
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-xl font-bold mb-2">Property Segments</h2>
        {/* Placeholder for chart */}
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
      <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2">
        <h2 className="text-xl font-bold mb-2">Data Table</h2>
        {/* Placeholder for data table */}
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

export default MarketDashboard;