'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MarketData {
  year: number;
  median_house_value: number;
}

const MarketChart = ({ marketData }: { marketData: MarketData[] }) => {
  const chartData = {
    labels: marketData.map((item) => item.year),
    datasets: [
      {
        label: 'Median House Value',
        data: marketData.map((item) => item.median_house_value),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return <Line data={chartData} />;
};

export default MarketChart;