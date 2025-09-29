'use client';

import { useState } from 'react';
import PropertyForm from '@/components/PropertyForm';
import PropertyComparison, { ComparisonProperty } from '@/components/PropertyComparison';

const PropertyValueEstimatorPage = () => {
  const [comparisonProperties, setComparisonProperties] = useState<ComparisonProperty[]>([]);

  const handleAddToComparison = (property: ComparisonProperty) => {
    setComparisonProperties(prev => {
      // Check if property with same name already exists
      const existingIndex = prev.findIndex(p => p.name === property.name);
      if (existingIndex !== -1) {
        // Replace existing property with same name
        const updated = [...prev];
        updated[existingIndex] = property;
        return updated;
      } else {
        // Add new property
        return [...prev, property];
      }
    });
  };

  const handleRemoveFromComparison = (id: string) => {
    setComparisonProperties(prev => prev.filter(p => p.id !== id));
  };

  const handleClearAllComparison = () => {
    setComparisonProperties([]);
  };

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <h1 className="text-2xl font-bold mb-4">Property Value Estimator</h1>
      
      <PropertyForm onAddToComparison={handleAddToComparison} />
      
      <PropertyComparison 
        properties={comparisonProperties}
        onRemoveProperty={handleRemoveFromComparison}
        onClearAll={handleClearAllComparison}
      />
    </div>
  );
};

export default PropertyValueEstimatorPage;