import PageHeader from '@/components/server/PageHeader';
import PropertyValueEstimatorClient from '@/components/client/PropertyValueEstimatorClient';

const PropertyValueEstimatorPage = async () => {
  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <PageHeader 
        title="Property Value Estimator"
        description="Get accurate property valuations based on market data and property characteristics."
      />
      <PropertyValueEstimatorClient />
    </div>
  );
};

export default PropertyValueEstimatorPage;