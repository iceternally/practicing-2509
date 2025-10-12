import PageHeader from '@/components/client/PageHeader';
import MarketDashboard from '@/components/client/MarketDashboard';
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

export default async function PropertyMarketAnalysisPage() {
  const marketData = await getMarketData();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      <PageHeader 
        title="Property Market Analysis"
        description="Explore market trends, compare regions, and visualize price movements with interactive charts."
      />
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <section className="xl:col-span-3">
          <MarketDashboard marketData={marketData} />
        </section>
        <aside className="xl:col-span-1">
          {/* Filters or notes can be placed here; stacks below on smaller screens */}
        </aside>
      </div>
    </div>
  );
}