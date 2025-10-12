import PageHeader from '@/components/client/PageHeader';
import PropertyValueEstimatorClient from '@/components/client/PropertyValueEstimatorClient';

const PropertyValueEstimatorPage = async () => {
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl">
      <PageHeader 
        title="Property Value Estimator"
        description="Get accurate property valuations based on market data and property characteristics."
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2">
          <PropertyValueEstimatorClient />
        </section>
        <aside className="lg:col-span-1">
          {/* Reserved for tips/help or saved searches; collapses below on mobile */}
        </aside>
      </div>
    </div>
  );
};

export default PropertyValueEstimatorPage;