'use client';

import { useState, useMemo } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { PropertyData } from '@/services/marketDataService';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MarketChart = ({ marketData }: { marketData: PropertyData[] }) => {
  const [showDataTable, setShowDataTable] = useState(false);
  const [chartType, setChartType] = useState<'price-by-year' | 'price-by-school-rating'>('price-by-year')

  // Process data for different chart types
  const chartData = useMemo(() => {
    if (marketData.length === 0) return null;

    switch (chartType) {
      case 'price-by-year':
        // Group properties by year built and calculate average price
        const yearGroups = marketData.reduce((acc, property) => {
          const decade = Math.floor(property.year_built / 10) * 10;
          if (!acc[decade]) acc[decade] = [];
          acc[decade].push(property.price);
          return acc;
        }, {} as Record<number, number[]>);

        const yearLabels = Object.keys(yearGroups).sort().map(year => `${year}s`);
        const yearPrices = Object.values(yearGroups).map(prices => 
          Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
        );

        return {
          labels: yearLabels,
          datasets: [{
            label: 'Average Price by Decade Built',
            data: yearPrices,
            fill: false,
            backgroundColor: 'rgb(75, 192, 192)',
            borderColor: 'rgba(75, 192, 192, 1)',
            tension: 0.1,
          }],
        };

      case 'price-by-school-rating':
        // Group properties by rounded school rating and calculate average price
        const schoolGroups = marketData.reduce((acc, property) => {
          const rating = Math.round(property.school_rating);
          if (!acc[rating]) acc[rating] = [];
          acc[rating].push(property.price);
          return acc;
        }, {} as Record<number, number[]>);

        const schoolLabels = Object.keys(schoolGroups).sort((a, b) => parseInt(a) - parseInt(b));
        const schoolPrices = Object.values(schoolGroups).map(prices =>
          Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
        );

        return {
          labels: schoolLabels,
          datasets: [{
            label: 'Average Price by School Rating',
            data: schoolPrices,
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          }],
        };

      case 'price-by-neighborhood':
        // Group by neighborhood
        const neighborhoodGroups = marketData.reduce((acc, property) => {
          if (!acc[property.neighborhood]) acc[property.neighborhood] = [];
          acc[property.neighborhood].push(property.price);
          return acc;
        }, {} as Record<string, number[]>);

        const neighborhoodLabels = Object.keys(neighborhoodGroups);
        const neighborhoodPrices = Object.values(neighborhoodGroups).map(prices => 
          Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
        );

        return {
          labels: neighborhoodLabels,
          datasets: [{
            label: 'Average Price by Neighborhood',
            data: neighborhoodPrices,
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 205, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
              'rgba(153, 102, 255, 0.8)',
              'rgba(255, 159, 64, 0.8)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 205, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          }],
        };

      case 'price-by-type':
        // Group by property type
        const typeGroups = marketData.reduce((acc, property) => {
          if (!acc[property.property_type]) acc[property.property_type] = [];
          acc[property.property_type].push(property.price);
          return acc;
        }, {} as Record<string, number[]>);

        const typeLabels = Object.keys(typeGroups);
        const typePrices = Object.values(typeGroups).map(prices => 
          Math.round(prices.reduce((sum, price) => sum + price, 0) / prices.length)
        );

        return {
          labels: typeLabels,
          datasets: [{
            label: 'Average Price by Property Type',
            data: typePrices,
            backgroundColor: [
              'rgba(255, 99, 132, 0.8)',
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 205, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 205, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
          }],
        };

      default:
        return null;
    }
  }, [marketData, chartType]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: chartType === 'price-by-year' ? 'Average Property Prices by Decade Built' : 'Average Property Prices by School Rating',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Average Price ($)',
        },
        ticks: {
          callback: function (value: any) {
            return '$' + value.toLocaleString()
          },
        },
      },
      x: {
        title: {
          display: true,
          text: chartType === 'price-by-year' ? 'Decade Built' : 'School Rating (1-10)',
        },
      },
    },
  }), [chartType])

  // Generate chart description for screen readers
  const generateChartDescription = () => {
    if (!chartData || marketData.length === 0) return 'No data available';
    
    const dataValues = chartData.datasets[0].data as number[];
    const minValue = Math.min(...dataValues);
    const maxValue = Math.max(...dataValues);
    const avgValue = Math.round(dataValues.reduce((sum, val) => sum + val, 0) / dataValues.length);
    
    return `Chart showing property prices. Values range from $${minValue.toLocaleString()} to $${maxValue.toLocaleString()}, with an average of $${avgValue.toLocaleString()}.`;
  };

  return (
    <section 
      className="w-full"
      role="img"
      aria-labelledby="chart-title"
      aria-describedby="chart-description"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 id="chart-title" className="text-xl font-semibold mb-2 sm:mb-0">
          Property Market Visualizations
        </h2>
        
        <div className="flex flex-wrap gap-2">
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="price-by-year">Price by Decade Built</option>
            <option value="price-by-school-rating">Price by School Rating</option>
          </select>
          
          <button
            onClick={() => setShowDataTable(!showDataTable)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-expanded={showDataTable}
            aria-controls="market-data-table"
          >
            {showDataTable ? 'Hide' : 'Show'} Data Table
          </button>
        </div>
      </div>
      
      <div 
        id="chart-description" 
        className="sr-only"
        aria-live="polite"
      >
        {generateChartDescription()}
      </div>

      {chartData && (
        <div 
          className="chart-container mb-6"
          role="img"
          aria-label={`Chart showing property prices by ${chartType === 'price-by-year' ? 'decade built' : 'school rating'}`}
          tabIndex={0}
        >
          {chartType === 'price-by-year' ? (
            <Line 
              data={chartData} 
              options={chartOptions}
              aria-label="Interactive line chart of property prices by decade"
            />
          ) : (
            <Bar 
              data={chartData} 
              options={chartOptions}
              aria-label={`Interactive bar chart of property prices by ${chartType.replace('price-by-', '')}`}
            />
          )}
        </div>
      )}

      {showDataTable && chartData && (
        <div 
          id="market-data-table"
          className="mt-6"
          role="region"
          aria-labelledby="data-table-title"
        >
          <h3 id="data-table-title" className="text-lg font-medium mb-3">
            Chart Data Table
          </h3>
          <table 
            className="w-full border-collapse border border-gray-300"
            role="table"
            aria-label="Chart data values"
          >
            <caption className="sr-only">
              Table showing the data values displayed in the chart
            </caption>
            <thead>
              <tr className="bg-gray-100">
                <th 
                  className="border border-gray-300 px-4 py-2 text-left"
                  scope="col"
                  id="category-header"
                >
                  {chartType === 'price-by-year' ? 'Decade Built' : 'School Rating'}
                </th>
                <th 
                  className="border border-gray-300 px-4 py-2 text-left"
                  scope="col"
                  id="value-header"
                >
                  Average Price
                </th>
              </tr>
            </thead>
            <tbody>
              {chartData.labels?.map((label, index) => (
                <tr 
                  key={label}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                >
                  <td 
                    className="border border-gray-300 px-4 py-2"
                    headers="category-header"
                  >
                    {label}
                  </td>
                  <td 
                    className="border border-gray-300 px-4 py-2"
                    headers="value-header"
                  >
                    ${(chartData.datasets[0].data[index] as number).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default MarketChart;