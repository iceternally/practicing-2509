'use client';

import React from 'react';

interface PropertyResultsDisplayProps {
  prediction: number | null;
  error: string | null;
  resultRef?: React.RefObject<HTMLDivElement>;
}

const PropertyResultsDisplay: React.FC<PropertyResultsDisplayProps> = ({
  prediction,
  error,
  resultRef
}) => {
  return (
    <div className="property-results-display">
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

export default PropertyResultsDisplay;