'use client';

import { useState } from 'react';

export interface ComparisonProperty {
  id: string;
  name: string;
  propertyData: {
    square_footage: number;
    bedrooms: number;
    bathrooms: number;
    year_built: number;
    lot_size: number;
    distance_to_city_center: number;
    school_rating: number;
  };
  estimatedValue: number;
  addedAt: Date;
}

interface PropertyComparisonProps {
  properties: ComparisonProperty[];
  onRemoveProperty: (id: string) => void;
  onClearAll: () => void;
}

const PropertyComparison = ({ properties, onRemoveProperty, onClearAll }: PropertyComparisonProps) => {
  if (properties.length === 0) {
    return (
      <section 
        className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-lg text-center"
        aria-labelledby="empty-comparison-title"
        role="region"
      >
        <h2 id="empty-comparison-title" className="text-lg font-semibold text-gray-900 mb-2">
          Property Comparison
        </h2>
        <p className="text-gray-600">
          Add properties to comparison to analyze them side-by-side
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Use the "Add to Comparison" button after getting a property estimate to start comparing properties.
        </p>
      </section>
    );
  }

  return (
    <section 
      className="mt-8"
      aria-labelledby="comparison-title"
      role="region"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 id="comparison-title" className="text-lg font-semibold text-gray-900">
          Property Comparison ({properties.length} {properties.length === 1 ? 'property' : 'properties'})
        </h2>
        <button
          onClick={onClearAll}
          className="px-3 py-1 text-sm text-red-600 hover:text-red-800 border border-red-300 hover:border-red-500 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          aria-describedby="clear-all-help"
        >
          Clear All
        </button>
      </div>
      <div id="clear-all-help" className="sr-only">
        Remove all properties from the comparison table
      </div>

      {/* Mobile View - Stacked Cards */}
      <div className="block md:hidden space-y-4" role="list" aria-label="Property comparison cards">
        {properties.map((property, index) => (
          <article 
            key={property.id} 
            className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            role="listitem"
            aria-labelledby={`mobile-property-${property.id}-title`}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 id={`mobile-property-${property.id}-title`} className="font-medium text-gray-900">
                  {property.name}
                </h3>
                <div className="text-lg font-semibold text-green-600" aria-label={`Estimated value: $${property.estimatedValue.toLocaleString()}`}>
                  ${property.estimatedValue.toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => onRemoveProperty(property.id)}
                className="text-red-500 hover:text-red-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1 transition-colors"
                aria-label={`Remove ${property.name} from comparison`}
              >
                Remove
              </button>
            </div>
            
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <dt className="font-medium inline">Sq Ft:</dt>
                <dd className="inline ml-1">{property.propertyData.square_footage.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="font-medium inline">Bedrooms:</dt>
                <dd className="inline ml-1">{property.propertyData.bedrooms}</dd>
              </div>
              <div>
                <dt className="font-medium inline">Bathrooms:</dt>
                <dd className="inline ml-1">{property.propertyData.bathrooms}</dd>
              </div>
              <div>
                <dt className="font-medium inline">Year Built:</dt>
                <dd className="inline ml-1">{property.propertyData.year_built}</dd>
              </div>
              <div>
                <dt className="font-medium inline">Lot Size:</dt>
                <dd className="inline ml-1">{property.propertyData.lot_size.toLocaleString()} sq ft</dd>
              </div>
              <div>
                <dt className="font-medium inline">Distance:</dt>
                <dd className="inline ml-1">{property.propertyData.distance_to_city_center} miles</dd>
              </div>
              <div className="col-span-2">
                <dt className="font-medium inline">School Rating:</dt>
                <dd className="inline ml-1">{property.propertyData.school_rating}/10</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      {/* Desktop View - Side-by-side Table */}
      <div className="hidden md:block overflow-x-auto">
        <table 
          className="w-full border-collapse bg-white border border-gray-200 rounded-lg shadow-sm"
          role="table"
          aria-label="Property comparison table"
          aria-describedby="table-description"
        >
          <caption className="sr-only" id="table-description">
            Comparison table showing property details and estimated values for {properties.length} properties. 
            Each column represents a different property with rows showing various property characteristics.
          </caption>
          <thead>
            <tr className="bg-gray-50">
              <th 
                className="p-3 text-left font-medium text-gray-900 border-b border-gray-200"
                scope="col"
                id="property-details-header"
              >
                Property Details
              </th>
              {properties.map((property, index) => (
                <th 
                  key={property.id} 
                  className="p-3 text-center font-medium text-gray-900 border-b border-gray-200 min-w-48"
                  scope="col"
                  id={`property-${property.id}-header`}
                >
                  <div className="flex flex-col items-center">
                    <span className="mb-1" aria-label={`Property ${index + 1}: ${property.name}`}>
                      {property.name}
                    </span>
                    <button
                      onClick={() => onRemoveProperty(property.id)}
                      className="text-xs text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-2 py-1 transition-colors"
                      aria-label={`Remove ${property.name} from comparison`}
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="bg-green-50">
              <th 
                className="p-3 font-medium text-gray-900 border-b border-gray-200 text-left"
                scope="row"
                id="estimated-value-row"
              >
                Estimated Value
              </th>
              {properties.map((property) => (
                <td 
                  key={property.id} 
                  className="p-3 text-center border-b border-gray-200"
                  headers={`property-${property.id}-header estimated-value-row`}
                >
                  <div 
                    className="text-lg font-semibold text-green-600"
                    aria-label={`${property.name} estimated value: $${property.estimatedValue.toLocaleString()}`}
                  >
                    ${property.estimatedValue.toLocaleString()}
                  </div>
                </td>
              ))}
            </tr>
            
            <tr>
              <th 
                className="p-3 font-medium text-gray-900 border-b border-gray-200 text-left"
                scope="row"
                id="square-footage-row"
              >
                Square Footage
              </th>
              {properties.map((property) => (
                <td 
                  key={property.id} 
                  className="p-3 text-center border-b border-gray-200"
                  headers={`property-${property.id}-header square-footage-row`}
                >
                  {property.propertyData.square_footage.toLocaleString()} sq ft
                </td>
              ))}
            </tr>
            
            <tr className="bg-gray-50">
              <th 
                className="p-3 font-medium text-gray-900 border-b border-gray-200 text-left"
                scope="row"
                id="bedrooms-row"
              >
                Bedrooms
              </th>
              {properties.map((property) => (
                <td 
                  key={property.id} 
                  className="p-3 text-center border-b border-gray-200"
                  headers={`property-${property.id}-header bedrooms-row`}
                >
                  {property.propertyData.bedrooms}
                </td>
              ))}
            </tr>
            
            <tr>
              <th 
                className="p-3 font-medium text-gray-900 border-b border-gray-200 text-left"
                scope="row"
                id="bathrooms-row"
              >
                Bathrooms
              </th>
              {properties.map((property) => (
                <td 
                  key={property.id} 
                  className="p-3 text-center border-b border-gray-200"
                  headers={`property-${property.id}-header bathrooms-row`}
                >
                  {property.propertyData.bathrooms}
                </td>
              ))}
            </tr>
            
            <tr className="bg-gray-50">
              <th 
                className="p-3 font-medium text-gray-900 border-b border-gray-200 text-left"
                scope="row"
                id="year-built-row"
              >
                Year Built
              </th>
              {properties.map((property) => (
                <td 
                  key={property.id} 
                  className="p-3 text-center border-b border-gray-200"
                  headers={`property-${property.id}-header year-built-row`}
                >
                  {property.propertyData.year_built}
                </td>
              ))}
            </tr>
            
            <tr>
              <th 
                className="p-3 font-medium text-gray-900 border-b border-gray-200 text-left"
                scope="row"
                id="lot-size-row"
              >
                Lot Size
              </th>
              {properties.map((property) => (
                <td 
                  key={property.id} 
                  className="p-3 text-center border-b border-gray-200"
                  headers={`property-${property.id}-header lot-size-row`}
                >
                  {property.propertyData.lot_size.toLocaleString()} sq ft
                </td>
              ))}
            </tr>
            
            <tr className="bg-gray-50">
              <th 
                className="p-3 font-medium text-gray-900 border-b border-gray-200 text-left"
                scope="row"
                id="distance-row"
              >
                Distance to City Center
              </th>
              {properties.map((property) => (
                <td 
                  key={property.id} 
                  className="p-3 text-center border-b border-gray-200"
                  headers={`property-${property.id}-header distance-row`}
                >
                  {property.propertyData.distance_to_city_center} miles
                </td>
              ))}
            </tr>
            
            <tr>
              <th 
                className="p-3 font-medium text-gray-900 text-left"
                scope="row"
                id="school-rating-row"
              >
                School Rating
              </th>
              {properties.map((property) => (
                <td 
                  key={property.id} 
                  className="p-3 text-center"
                  headers={`property-${property.id}-header school-rating-row`}
                >
                  {property.propertyData.school_rating}/10
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default PropertyComparison;