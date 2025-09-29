import MarketDashboard from '@/components/MarketDashboard';
import { marketDataService } from '@/services/marketDataService';

async function getMarketData() {
  try {
    const housingData = await marketDataService.fetchHousingData();
    return housingData;
  } catch (error) {
    console.error('Failed to fetch market data:', error);
    return [];
  }
}

const PropertyMarketAnalysisPage = async () => {
  const marketData = await getMarketData();
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Market Analysis</h1>
      <MarketDashboard marketData={marketData} />
    </div>
  );
};

export default PropertyMarketAnalysisPage;