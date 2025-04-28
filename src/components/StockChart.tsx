import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { StockData } from '../types/stock';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Props {
  stocks: StockData[];
}

const StockChart: React.FC<Props> = ({ stocks }) => {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Stock Price Changes',
      },
    },
  };

  const data = {
    labels: stocks.map(stock => stock.symbol),
    datasets: [
      {
        label: 'Price Change %',
        data: stocks.map(stock => stock.changePercent),
        backgroundColor: stocks.map(stock => 
          stock.changePercent >= 0 ? 'rgba(34, 197, 94, 0.5)' : 'rgba(239, 68, 68, 0.5)'
        ),
        borderColor: stocks.map(stock => 
          stock.changePercent >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
        ),
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-8">
      <Bar options={options} data={data} />
    </div>
  );
};

export default StockChart;