import MarketDashboard from '@/components/MarketDashboard';

// async function getMarketData() {
//   const res = await fetch('http://127.0.0.1:8000/market-analysis', { cache: 'no-store' });
//   if (!res.ok) {
//     throw new Error('Failed to fetch data');
//   }
//   return res.json();
// }

const PropertyMarketAnalysisPage = async () => {
  // const marketData = await getMarketData();
const marketData = {};
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Market Analysis</h1>
      <MarketDashboard marketData={marketData} />
    </div>
  );
};

export default PropertyMarketAnalysisPage;