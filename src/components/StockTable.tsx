import React, { useState } from 'react';
import { StockData } from '../types/stock';

interface Props {
  stocks: StockData[];
  onRemoveSymbol: (symbol: string) => void;
}

const StockTable: React.FC<Props> = ({ stocks, onRemoveSymbol }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof StockData;
    direction: 'ascending' | 'descending';
  } | null>(null);

  const handleSort = (key: keyof StockData) => {
    setSortConfig(current => ({
      key,
      direction: current?.key === key && current?.direction === 'ascending' 
        ? 'descending' 
        : 'ascending'
    }));
  };

  const sortedStocks = React.useMemo(() => {
    const stocksCopy = [...stocks];
    if (sortConfig) {
      stocksCopy.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return stocksCopy;
  }, [stocks, sortConfig]);

  const filteredStocks = sortedStocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const tableHeaders = ['Symbol', 'Price', 'Change', 'Change %', 'Actions'];
  const sortableKeys: (keyof StockData)[] = ['symbol', 'price', 'change', 'changePercent'];

  if (stocks.length === 0) {
    return (
      <div className="text-center py-8 bg-white rounded-lg shadow">
        <p className="text-gray-500">No stocks data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search stocks..."
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              {tableHeaders.map((header, index) => (
                <th
                  key={header}
                  onClick={() => header !== 'Actions' && handleSort(sortableKeys[index])}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    header !== 'Actions' ? 'cursor-pointer hover:bg-gray-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-1">
                    <span>{header}</span>
                    {sortConfig && sortableKeys[index] === sortConfig.key && (
                      <span>{sortConfig.direction === 'ascending' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredStocks.map((stock) => (
              <tr key={stock.symbol} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {stock.symbol}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${stock.price.toFixed(2)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stock.change.toFixed(2)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${
                  stock.changePercent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stock.changePercent.toFixed(2)}%
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <button
                    onClick={() => onRemoveSymbol(stock.symbol)}
                    className="text-red-600 hover:text-red-800"
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
  );
};

export default StockTable;