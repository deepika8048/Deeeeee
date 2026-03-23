export interface MetalData {
  id: string;
  name: string;
  symbol: string;
  price: number;
  currency: string;
  timestamp: string;
  prevOpen: number;
  prevClose: number;
  date: string;
  change: number;
  changePercent: number;
}

export type MetalId = 'gold' | 'silver' | 'platinum' | 'palladium';
