'use client';

import { useState, useMemo } from 'react';
import { PropertyData } from '@/services/marketDataService';
import { Calculator, TrendingUp, Home, MapPin } from 'lucide-react';

interface WhatIfAnalyzerProps {
  data: PropertyData[];
}

interface PropertyInputs {
  square_footage: number;
  bedrooms: number;
  bathrooms: number;
  year_built: number;
  lot_size: number;
  distance_to_city_center: number;
  school_rating: number;
}

const WhatIfAnalyzer = ({ data }: WhatIfAnalyzerProps) => {
  const [inputs, setInputs] = useState<PropertyInputs>({
    square_footage: 1500,
    bedrooms: 3,
    bathrooms: 2,
    year_built: 2000,
    lot_size: 7000,
    distance_to_city_center: 5,
    school_rating: 7.5,
  });

  const [scenarios, setScenarios] = useState<Array<{ name: string; inputs: PropertyInputs; estimatedPrice: number }>>([]);

  // Simple price estimation model based on similar properties
  const estimatePrice = (propertyInputs: PropertyInputs): number => {
    if (data.length === 0) return 0;

    // Find similar properties (within reasonable ranges)
    const similarProperties = data.filter(property => {
      const sqftDiff = Math.abs(property.square_footage - propertyInputs.square_footage) / propertyInputs.square_footage;
      const bedroomMatch = property.bedrooms === propertyInputs.bedrooms;
      const yearDiff = Math.abs(property.year_built - propertyInputs.year_built);
      
      return sqftDiff <= 0.3 && bedroomMatch && yearDiff <= 10;
    });

    if (similarProperties.length === 0) {
      // Fallback to all properties if no similar ones found
      const avgPricePerSqFt = data.reduce((sum, p) => sum + (p.price / p.square_footage), 0) / data.length;
      return Math.round(avgPricePerSqFt * propertyInputs.square_footage);
    }

    // Calculate weighted average based on similarity
    let totalWeight = 0;
    let weightedPrice = 0;

    similarProperties.forEach(property => {
      // Calculate similarity weights
      const sqftWeight = 1 - Math.abs(property.square_footage - propertyInputs.square_footage) / propertyInputs.square_footage;
      const yearWeight = 1 - Math.abs(property.year_built - propertyInputs.year_built) / 50;
      const schoolWeight = 1 - Math.abs(property.school_rating - propertyInputs.school_rating) / 10;
      const distanceWeight = 1 - Math.abs(property.distance_to_city_center - propertyInputs.distance_to_city_center) / 10;
      
      const weight = (sqftWeight + yearWeight + schoolWeight + distanceWeight) / 4;
      
      totalWeight += weight;
      weightedPrice += property.price * weight;
    });

    return Math.round(weightedPrice / totalWeight);
  };

  const currentEstimate = useMemo(() => estimatePrice(inputs), [inputs, data]);

  const handleInputChange = (field: keyof PropertyInputs, value: number) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const addScenario = () => {
    const scenarioName = `Scenario ${scenarios.length + 1}`;
    const estimatedPrice = estimatePrice(inputs);
    setScenarios(prev => [...prev, { name: scenarioName, inputs: { ...inputs }, estimatedPrice }]);
  };

  const removeScenario = (index: number) => {
    setScenarios(prev => prev.filter((_, i) => i !== index));
  };

  const clearScenarios = () => {
    setScenarios([]);
  };

  // Calculate market insights
  const marketInsights = useMemo(() => {
    if (data.length === 0) return null;

    const avgPrice = data.reduce((sum, p) => sum + p.price, 0) / data.length;
    const avgPricePerSqFt = data.reduce((sum, p) => sum + (p.price / p.square_footage), 0) / data.length;
    const currentPricePerSqFt = currentEstimate / inputs.square_footage;
    
    const priceComparison = ((currentEstimate - avgPrice) / avgPrice) * 100;
    const pricePerSqFtComparison = ((currentPricePerSqFt - avgPricePerSqFt) / avgPricePerSqFt) * 100;

    return {
      avgPrice,
      avgPricePerSqFt,
      currentPricePerSqFt,
      priceComparison,
      pricePerSqFtComparison,
    };
  }, [data, currentEstimate, inputs.square_footage]);

  return (
    <div className="space-y-6">
      {/* Property Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Home size={20} />
            Property Details
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Square Footage
              </label>
              <input
                type="number"
                value={inputs.square_footage}
                onChange={(e) => handleInputChange('square_footage', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="500"
                max="10000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bedrooms
              </label>
              <select
                value={inputs.bedrooms}
                onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bathrooms
              </label>
              <select
                value={inputs.bathrooms}
                onChange={(e) => handleInputChange('bathrooms', parseFloat(e.target.value))}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 1.5, 2, 2.5, 3, 3.5, 4].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year Built
              </label>
              <input
                type="number"
                value={inputs.year_built}
                onChange={(e) => handleInputChange('year_built', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1900"
                max={new Date().getFullYear()}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lot Size (sq ft)
              </label>
              <input
                type="number"
                value={inputs.lot_size}
                onChange={(e) => handleInputChange('lot_size', parseInt(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1000"
                max="50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Distance to City Center (miles)
              </label>
              <input
                type="number"
                step="0.1"
                value={inputs.distance_to_city_center}
                onChange={(e) => handleInputChange('distance_to_city_center', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="0"
                max="50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Rating (1-10)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={inputs.school_rating}
                  onChange={(e) => handleInputChange('school_rating', parseFloat(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium text-gray-900 w-12">
                  {inputs.school_rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Estimate */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Calculator size={20} />
            Price Estimate
          </h3>
          
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Estimated Property Value</p>
              <p className="text-4xl font-bold text-blue-600 mb-4">
                ${currentEstimate.toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                ${(currentEstimate / inputs.square_footage).toFixed(0)} per sq ft
              </p>
            </div>
          </div>

          {marketInsights && (
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp size={16} />
                Market Comparison
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded border">
                  <p className="text-xs text-gray-600">vs. Market Average</p>
                  <p className={`text-sm font-semibold ${
                    marketInsights.priceComparison >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {marketInsights.priceComparison >= 0 ? '+' : ''}
                    {marketInsights.priceComparison.toFixed(1)}%
                  </p>
                </div>
                
                <div className="bg-white p-3 rounded border">
                  <p className="text-xs text-gray-600">Price per Sq Ft vs. Market</p>
                  <p className={`text-sm font-semibold ${
                    marketInsights.pricePerSqFtComparison >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {marketInsights.pricePerSqFtComparison >= 0 ? '+' : ''}
                    {marketInsights.pricePerSqFtComparison.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={addScenario}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Save as Scenario
          </button>
        </div>
      </div>

      {/* Scenarios Comparison */}
      {scenarios.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Saved Scenarios</h3>
            <button
              onClick={clearScenarios}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Scenario</th>
                  <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Sq Ft</th>
                  <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Bed/Bath</th>
                  <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Year</th>
                  <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">School Rating</th>
                  <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Estimated Price</th>
                  <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {scenarios.map((scenario, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-200 px-4 py-2 text-sm">{scenario.name}</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">{scenario.inputs.square_footage.toLocaleString()}</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">{scenario.inputs.bedrooms}/{scenario.inputs.bathrooms}</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">{scenario.inputs.year_built}</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">{scenario.inputs.school_rating.toFixed(1)}</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm font-semibold text-green-600">
                      ${scenario.estimatedPrice.toLocaleString()}
                    </td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">
                      <button
                        onClick={() => removeScenario(index)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatIfAnalyzer;