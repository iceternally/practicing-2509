'use client';

import React, { useState } from 'react';
import PropertyForm from './PropertyForm';
import PropertyComparison, { ComparisonProperty } from './PropertyComparison';

const PropertyValueEstimatorClient: React.FC = () => {
  const [comparisonProperties, setComparisonProperties] = useState<ComparisonProperty[]>([]);

  const isSameProperty = (a: ComparisonProperty, b: ComparisonProperty) => {
    const pa = a.propertyData;
    const pb = b.propertyData;
    return (
      a.estimatedValue === b.estimatedValue &&
      pa.square_footage === pb.square_footage &&
      pa.bedrooms === pb.bedrooms &&
      pa.bathrooms === pb.bathrooms &&
      pa.year_built === pb.year_built &&
      pa.lot_size === pb.lot_size &&
      pa.distance_to_city_center === pb.distance_to_city_center &&
      pa.school_rating === pb.school_rating
    );
  };

  const handleAddToComparison = (property: ComparisonProperty) => {
    setComparisonProperties(prev => {
      // Prevent adding duplicate entries with identical propertyData and estimatedValue
      const alreadyExists = prev.some(p => isSameProperty(p, property));
      if (alreadyExists) {
        return prev; // no change when duplicate
      }
      return [...prev, property];
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