'use client';

import React from 'react';
import { ComparisonProperty } from './PropertyComparison';

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
  onAddToComparison,
  propertyData
}) => {
  const handleAddToComparison = () => {
    if (prediction && onAddToComparison) {
      const comparisonProperty: ComparisonProperty = {
        id: Date.now().toString(),
        name: `Property ${Date.now()}`,
        propertyData: propertyData,
        estimatedValue: prediction,
        addedAt: new Date()
      };
      onAddToComparison(comparisonProperty);
    }
  };

  return (
    <div className="property-results">
      {prediction !== null && (
        <div 
          ref={resultRef}
          tabIndex={-1}
          role="region"
          aria-labelledby="result-title"
          className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md"
        >
          <h2 id="result-title" className="text-lg font-medium text-green-800 mb-2">
            Property Estimate Result
          </h2>
          <div className="text-2xl font-bold text-green-900 mb-4">
            ${prediction.toLocaleString()}
          </div>
          <div className="text-sm text-green-700 mb-4">
            This estimate is based on the property details you provided and current market data.
          </div>
          {onAddToComparison && (
            <button
              onClick={handleAddToComparison}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              aria-describedby="add-comparison-help"
            >
              Add to Comparison
            </button>
          )}
          {onAddToComparison && (
            <div id="add-comparison-help" className="mt-2 text-xs text-green-600">
              Add this property to your comparison list to compare with other properties.
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <h2 id="error-title" className="text-lg font-medium text-red-800 mb-2">
            Error
          </h2>
          <p className="text-red-700">{error}</p>
          <p className="mt-2 text-sm text-red-600">
            Please check your input and try again. If the problem persists, contact support.
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyResults;