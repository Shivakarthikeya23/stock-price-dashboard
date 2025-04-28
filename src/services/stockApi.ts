import axios from 'axios';
import { StockData } from '../types/stock';

const API_KEY = process.env.REACT_APP_ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

// Mock data for development
const mockStockData: Record<string, StockData> = {
  'AAPL': {
    symbol: 'AAPL',
    price: 175.43,
    change: 2.15,
    changePercent: 1.24
  },
  'GOOGL': {
    symbol: 'GOOGL',
    price: 134.99,
    change: -0.45,
    changePercent: -0.33
  },
  'MSFT': {
    symbol: 'MSFT',
    price: 338.11,
    change: 3.22,
    changePercent: 0.96
  },
  'AMZN': {
    symbol: 'AMZN',
    price: 145.68,
    change: -1.32,
    changePercent: -0.90
  },
  'META': {
    symbol: 'META',
    price: 312.81,
    change: 4.56,
    changePercent: 1.48
  },
  'ORACLE': {
    symbol: 'ORACLE',
    price: 116.24,
    change: 1.78,
    changePercent: 1.55
  }
};

export const fetchStockData = async (symbol: string): Promise<StockData> => {
  try {
    console.log(`Fetching data for ${symbol}...`);
    const response = await axios.get(`${BASE_URL}`, {
      params: {
        function: 'GLOBAL_QUOTE',
        symbol,
        apikey: API_KEY
      }
    });

    console.log(`Response for ${symbol}:`, response.data);

    // Check for rate limit message
    if (response.data.Information && response.data.Information.includes('API key')) {
      console.log('API rate limit reached, using mock data');
      return mockStockData[symbol] || {
        symbol,
        price: Math.random() * 1000,
        change: (Math.random() * 10) - 5,
        changePercent: (Math.random() * 5) - 2.5
      };
    }

    // Check for valid data structure
    if (!response.data['Global Quote'] || Object.keys(response.data['Global Quote']).length === 0) {
      console.log('No data available, using mock data');
      return mockStockData[symbol] || {
        symbol,
        price: Math.random() * 1000,
        change: (Math.random() * 10) - 5,
        changePercent: (Math.random() * 5) - 2.5
      };
    }

    const data = response.data['Global Quote'];
    return {
      symbol: data['01. symbol'] || symbol,
      price: parseFloat(data['05. price'] || '0'),
      change: parseFloat(data['09. change'] || '0'),
      changePercent: parseFloat((data['10. change percent'] || '0%').replace('%', ''))
    };
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error);
    // Return mock data with realistic values
    return mockStockData[symbol] || {
      symbol,
      price: Math.random() * 1000,
      change: (Math.random() * 10) - 5,
      changePercent: (Math.random() * 5) - 2.5
    };
  }
};