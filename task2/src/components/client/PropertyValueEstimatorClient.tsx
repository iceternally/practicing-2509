'use client';

import React, { useState } from 'react';
import PropertyForm from './PropertyForm';
import PropertyComparison, { ComparisonProperty } from './PropertyComparison';

const PropertyValueEstimatorClient: React.FC = () => {
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
    <>
      <PropertyForm onAddToComparison={handleAddToComparison} />
      <PropertyComparison 
        properties={comparisonProperties}
        onRemoveProperty={handleRemoveFromComparison}
        onClearAll={handleClearAllComparison}
      />
    </>
  );
};

export default PropertyValueEstimatorClient;