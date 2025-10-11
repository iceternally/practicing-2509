'use client';

import { useState, useEffect, useMemo } from 'react';
import { PropertyData, MarketFilters, marketDataService } from '@/services/marketDataService';
import MarketChart from './MarketChart';
import PropertyDataTable from './PropertyDataTable';
import WhatIfAnalyzer from './WhatIfAnalyzer';
import DataExporter from './DataExporter';
import { Filter, BarChart3, Calculator, Download, Eye, EyeOff } from 'lucide-react';

import { useHousingData } from '@/hooks';

interface MarketDashboardProps {
  marketData: PropertyData[];
}

const MarketDashboard = ({ marketData: initialData }: MarketDashboardProps) => {
  // Replace manual data state with housing data hook, seeding with server data
  const { data, loading, error, lastUpdated, refetch, usingFallback } = useHousingData({ initialData, revalidateMs: 60_000, immediate: false });
  const [filteredData, setFilteredData] = useState<PropertyData[]>(initialData);
  const [filters, setFilters] = useState<Partial<MarketFilters>>({});
  const [activeView, setActiveView] = useState<'overview' | 'table' | 'analysis'>('overview');
  const [showFilters, setShowFilters] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // Update filtered data when data changes
  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  // Apply filters whenever filters or data change (use current data)
  useEffect(() => {
    if (Object.keys(filters).length === 0) {
      setFilteredData(data);
    } else {
      const filtered = marketDataService.filterProperties(filters, data);
      setFilteredData(filtered);
    }
  }, [filters, data]);

  // Calculate market statistics
  const marketStats = useMemo(() => {
    return marketDataService.calculateMarketStats(filteredData);
  }, [filteredData]);

  // Get property segments
  const propertySegments = useMemo(() => {
    return {
      byBedrooms: marketDataService.getPropertySegmentsByBedrooms(filteredData),
      byPriceRange: marketDataService.getPropertySegmentsByPriceRange(filteredData)
    };
  }, [filteredData]);

  // Get data ranges for filter controls (derive from current data)
  const dataRanges = useMemo(() => {
    return marketDataService.getDataRanges(data);
  }, [data]);

  const handleFilterChange = (newFilters: Partial<MarketFilters>) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
  };

  return (
    <main 
      className="market-dashboard space-y-6"
      role="main"
      aria-labelledby="dashboard-title"
    >
      {/* Dashboard Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 id="dashboard-title" className="text-3xl font-bold text-gray-900">
            Property Market Analysis Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Showing {filteredData.length} of {data.length} properties
          </p>
          {error && (
            <p className="text-red-600 text-sm mt-1" role="alert">Failed to refresh market data: {error}</p>
          )}
          {loading && (
            <p className="text-gray-500 text-sm mt-1">Refreshing market data...</p>
          )}
          {lastUpdated && (
            <p className="text-gray-400 text-xs mt-1">
              Last updated: <time dateTime={new Date(lastUpdated).toISOString()} suppressHydrationWarning={true}>
                {new Date(lastUpdated).toLocaleTimeString('en-GB', { hour12: false })}
              </time>
            </p>
          )}
          {usingFallback && (
            <p className="text-amber-600 text-xs mt-1" role="status">Showing sample data (fallback)</p>
          )}
        </div>
        
        {/* View Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-blue-50 border-blue-200 text-blue-700' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {showFilters ? <EyeOff size={16} /> : <Eye size={16} />}
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
          <button
            onClick={() => refetch()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            aria-label="Refresh market data"
          >
            <Download size={16} /> Refresh Data
          </button>
          
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveView('overview')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeView === 'overview' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 size={16} />
              Overview
            </button>
            <button
              onClick={() => setActiveView('table')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeView === 'table' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Filter size={16} />
              Data Table
            </button>
            <button
              onClick={() => setActiveView('analysis')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeView === 'analysis' 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calculator size={16} />
              What-If Analysis
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear All
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min={dataRanges.priceRange.min}
                  max={dataRanges.priceRange.max}
                  value={filters.priceRange?.min || dataRanges.priceRange.min}
                  onChange={(e) => handleFilterChange({
                    ...filters,
                    priceRange: {
                      min: parseInt(e.target.value),
                      max: filters.priceRange?.max || dataRanges.priceRange.max
                    }
                  })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>${(filters.priceRange?.min || dataRanges.priceRange.min).toLocaleString()}</span>
                  <span>${(filters.priceRange?.max || dataRanges.priceRange.max).toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bedrooms
              </label>
              <select
                multiple
                value={filters.bedrooms || []}
                onChange={(e) => {
                  const values = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                  handleFilterChange({ ...filters, bedrooms: values });
                }}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {dataRanges.bedroomOptions.map(bedroom => (
                  <option key={bedroom} value={bedroom}>
                    {bedroom} {bedroom === 1 ? 'bedroom' : 'bedrooms'}
                  </option>
                ))}
              </select>
            </div>

            {/* Square Footage Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Square Footage
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min={dataRanges.squareFootageRange.min}
                  max={dataRanges.squareFootageRange.max}
                  value={filters.squareFootageRange?.min || dataRanges.squareFootageRange.min}
                  onChange={(e) => handleFilterChange({
                    ...filters,
                    squareFootageRange: {
                      min: parseInt(e.target.value),
                      max: filters.squareFootageRange?.max || dataRanges.squareFootageRange.max
                    }
                  })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{(filters.squareFootageRange?.min || dataRanges.squareFootageRange.min).toLocaleString()} sq ft</span>
                  <span>{(filters.squareFootageRange?.max || dataRanges.squareFootageRange.max).toLocaleString()} sq ft</span>
                </div>
              </div>
            </div>

            {/* School Rating Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Rating
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min={dataRanges.schoolRatingRange.min}
                  max={dataRanges.schoolRatingRange.max}
                  step="0.1"
                  value={filters.schoolRatingRange?.min || dataRanges.schoolRatingRange.min}
                  onChange={(e) => handleFilterChange({
                    ...filters,
                    schoolRatingRange: {
                      min: parseFloat(e.target.value),
                      max: filters.schoolRatingRange?.max || dataRanges.schoolRatingRange.max
                    }
                  })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{(filters.schoolRatingRange?.min || dataRanges.schoolRatingRange.min).toFixed(1)}</span>
                  <span>{(filters.schoolRatingRange?.max || dataRanges.schoolRatingRange.max).toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Properties</p>
              <p className="text-2xl font-bold text-gray-900">{marketStats.totalProperties.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Price</p>
              <p className="text-2xl font-bold text-gray-900">${marketStats.averagePrice.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 font-bold">$</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Median Price</p>
              <p className="text-2xl font-bold text-gray-900">${marketStats.medianPrice.toLocaleString()}</p>
            </div>
            <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 font-bold">M</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Price per Sq Ft</p>
              <p className="text-2xl font-bold text-gray-900">${marketStats.pricePerSqFt.toFixed(0)}</p>
            </div>
            <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 font-bold">²</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {activeView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Market Trends Chart */}
          <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Price Distribution</h2>
              {/* Removed Export Data section from Overview */}
            </div>
            <MarketChart marketData={filteredData} />
          </section>

            {/* Property Segments */}
            <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Property Segments</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">By Bedrooms</h3>
                  <div className="space-y-2">
                    {propertySegments.byBedrooms.map((segment, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{segment.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${segment.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{segment.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">By Price Range</h3>
                  <div className="space-y-2">
                    {propertySegments.byPriceRange.map((segment, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{segment.label}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${segment.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">{segment.count}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
        </div>
      )}

      {activeView === 'table' && (
        <section className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Property Data Table</h2>
              <button
                onClick={() => setShowExport(!showExport)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                aria-expanded={showExport}
                aria-controls="export-section"
              >
                Export Data
              </button>
            </div>
            {showExport && (
              <div id="export-section" className="mt-4">
                <DataExporter data={data} filteredData={filteredData} />
              </div>
            )}
          </div>
          <PropertyDataTable data={filteredData} />
        </section>
      )}

      {activeView === 'analysis' && (
        <section className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">What-If Analysis Tool</h2>
            {/* Removed Export Data section from What-If */}
          </div>
          <WhatIfAnalyzer data={filteredData} />
        </section>
      )}
    </main>
  );
};

export default MarketDashboard;