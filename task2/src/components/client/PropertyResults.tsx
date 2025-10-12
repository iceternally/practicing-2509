'use client';

import React from 'react';
import PropertyResultsDisplay from './PropertyResultsDisplay';
import type { ComparisonProperty } from './PropertyComparison';

interface PropertyResultsProps {
  prediction: number | null;
  error: string | null;
  resultRef: React.RefObject<HTMLDivElement>;
  onAddToComparison?: (property: ComparisonProperty) => void;
  propertyData: {
    square_footage: number;
    bedrooms: number;
    bathrooms: number;
    year_built: number;
    lot_size: number;
    distance_to_city_center: number;
    school_rating: number;
  };
}

const PropertyResults: React.FC<PropertyResultsProps> = ({
  prediction,
  error,
  resultRef,
}) => {
  return (
    <div className="property-results">
      <PropertyResultsDisplay 
        prediction={prediction}
        error={error}
        resultRef={resultRef}
      />
    </div>
  );
};

export default PropertyResults;