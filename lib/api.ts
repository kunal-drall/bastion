import { toast } from "sonner";

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

interface MarketData {
  [key: string]: {
    usd: number;
    usd_24h_change?: number;
  };
}

interface HistoricalData {
  prices: [number, number][];
}

export async function fetchData<T>(url: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred';
    toast.error(errorMessage);
    return { data: null, error: errorMessage };
  }
}

// Example API endpoints
const API_BASE_URL = 'https://api.coingecko.com/api/v3';

export const api = {
  getMarketData: () => fetchData<MarketData>(`${API_BASE_URL}/simple/price?ids=bitcoin,ethereum,solana,dogecoin,shiba-inu,pepe&vs_currencies=usd&include_24h_change=true`),
  getHistoricalData: (days: number = 7) => 
    fetchData<HistoricalData>(`${API_BASE_URL}/coins/bitcoin/market_chart?vs_currency=usd&days=${days}&interval=daily`),
};