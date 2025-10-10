import MarketDashboard from '@/components/client/MarketDashboard';
import PageHeader from '@/components/server/PageHeader';
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
      <PageHeader 
        title="Property Market Analysis"
        description="Comprehensive market insights and trends for informed real estate decisions."
      />
      <MarketDashboard marketData={marketData} />
    </div>
  );
};

export default PropertyMarketAnalysisPage;