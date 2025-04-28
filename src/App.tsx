import React, { useState, useEffect } from 'react';
import { StockData } from './types/stock';
import { fetchStockData } from './services/stockApi';
import StockTable from './components/StockTable';
import StockChart from './components/StockChart';
import LoadingSpinner from './components/LoadingSpinner';

const DEFAULT_SYMBOLS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'META'];

function App() {
  const [stocks, setStocks] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [symbols, setSymbols] = useState<string[]>(DEFAULT_SYMBOLS);
  const [newSymbol, setNewSymbol] = useState('');

  const handleAddSymbol = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSymbol && !symbols.includes(newSymbol.toUpperCase())) {
      setSymbols([...symbols, newSymbol.toUpperCase()]);
      setNewSymbol('');
    }
  };

  const handleRemoveSymbol = (symbolToRemove: string) => {
    setSymbols(symbols.filter(symbol => symbol !== symbolToRemove));
  };

  useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        const stockData = [];
        // Fetch stocks sequentially to avoid rate limits
        for (const symbol of symbols) {
          try {
            const data = await fetchStockData(symbol);
            stockData.push(data);
          } catch (err) {
            console.error(`Error fetching ${symbol}:`, err);
          }
          // Add a small delay between requests
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
        if (stockData.length > 0) {
          setStocks(stockData);
          setError(null);
        } else {
          setError('No stock data available. Please try again later.');
        }
      } catch (err) {
        setError('Failed to fetch stock data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
    // Increase the refresh interval to avoid rate limits
    const interval = setInterval(fetchStocks, 300000); // Refresh every 5 minutes

    return () => clearInterval(interval);
  }, [symbols]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Stock Price Dashboard</h1>
        
        <form onSubmit={handleAddSymbol} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newSymbol}
              onChange={(e) => setNewSymbol(e.target.value)}
              placeholder="Enter stock symbol (e.g., AAPL)"
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Add Stock
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <StockTable stocks={stocks} onRemoveSymbol={handleRemoveSymbol} />
            <StockChart stocks={stocks} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
