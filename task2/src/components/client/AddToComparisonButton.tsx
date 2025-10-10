'use client';

import React from 'react';
import { ComparisonProperty } from './PropertyComparison';

interface AddToComparisonButtonProps {
  prediction: number | null;
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

const AddToComparisonButton: React.FC<AddToComparisonButtonProps> = ({
  prediction,
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

  if (!prediction || !onAddToComparison) {
    return null;
  }

  return (
    <div className="mt-4">
      <button
        onClick={handleAddToComparison}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        aria-describedby="add-comparison-help"
      >
        Add to Comparison
      </button>
      <div id="add-comparison-help" className="mt-2 text-xs text-green-600">
        Add this property to your comparison list to compare with other properties.
      </div>
    </div>
  );
};

export default AddToComparisonButton;