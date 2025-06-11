// Tipos principales del sistema Prompt Maestro

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  settings: UserSettings;
}

export interface UserSettings {
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  autoReinvest: boolean;
  withdrawalThreshold: number;
  notifications: NotificationSettings;
  twoFactorEnabled: boolean;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
  trades: boolean;
  profits: boolean;
  losses: boolean;
}

export interface Exchange {
  id: string;
  name: string;
  displayName: string;
  logo: string;
  isConnected: boolean;
  apiKey?: string;
  balance: ExchangeBalance[];
  status: 'online' | 'offline' | 'error';
  lastSync: string;
}

export interface ExchangeBalance {
  asset: string;
  free: number;
  locked: number;
  total: number;
  usdValue: number;
}

export interface TradingStrategy {
  id: string;
  name: string;
  type: StrategyType;
  description: string;
  status: 'active' | 'paused' | 'stopped';
  exchange: string;
  pair: string;
  allocation: number; // USD amount
  config: StrategyConfig;
  performance: StrategyPerformance;
  createdAt: string;
  updatedAt: string;
}

export type StrategyType = 
  | 'dca'
  | 'grid'
  | 'scalping'
  | 'arbitrage'
  | 'copy_trading'
  | 'market_making'
  | 'ai_reinforcement'
  | 'sentiment';

export interface StrategyConfig {
  // Configuración común
  stopLoss?: number;
  takeProfit?: number;
  maxDrawdown?: number;
  
  // DCA específico
  dcaInterval?: number; // minutos
  dcaAmount?: number;
  
  // Grid específico
  gridLevels?: number;
  gridSpacing?: number;
  
  // Scalping específico
  scalpingTimeframe?: string;
  indicators?: string[];
  
  // Arbitrage específico
  minProfitMargin?: number;
  maxSlippage?: number;
  
  // AI específico
  modelVersion?: string;
  learningRate?: number;
}

export interface StrategyPerformance {
  totalReturn: number;
  totalReturnPercent: number;
  dailyReturn: number;
  weeklyReturn: number;
  monthlyReturn: number;
  maxDrawdown: number;
  sharpeRatio: number;
  winRate: number;
  totalTrades: number;
  profitableTrades: number;
  averageProfit: number;
  averageLoss: number;
  currentStreak: number;
  bestTrade: number;
  worstTrade: number;
}

export interface Trade {
  id: string;
  strategyId: string;
  exchange: string;
  pair: string;
  side: 'buy' | 'sell';
  type: 'market' | 'limit' | 'stop';
  amount: number;
  price: number;
  fee: number;
  profit?: number;
  status: 'pending' | 'filled' | 'cancelled' | 'failed';
  timestamp: string;
  reason: string; // Por qué se ejecutó el trade
}

export interface Portfolio {
  totalValue: number;
  totalInvested: number;
  totalProfit: number;
  totalProfitPercent: number;
  dailyChange: number;
  dailyChangePercent: number;
  assets: PortfolioAsset[];
  allocation: AllocationData[];
}

export interface PortfolioAsset {
  symbol: string;
  name: string;
  amount: number;
  value: number;
  price: number;
  change24h: number;
  change24hPercent: number;
  allocation: number; // porcentaje del portfolio
}

export interface AllocationData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface AIRecommendation {
  id: string;
  type: 'strategy' | 'rebalance' | 'exit' | 'risk';
  title: string;
  description: string;
  confidence: number; // 0-100
  impact: 'low' | 'medium' | 'high';
  action: string;
  reasoning: string[];
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

export interface MarketData {
  symbol: string;
  price: number;
  change24h: number;
  change24hPercent: number;
  volume24h: number;
  marketCap: number;
  high24h: number;
  low24h: number;
  timestamp: string;
}

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  url: string;
  source: string;
  sentiment: 'positive' | 'negative' | 'neutral';
  impact: number; // 0-100
  publishedAt: string;
  relevantAssets: string[];
}

export interface BacktestResult {
  strategyId: string;
  period: {
    start: string;
    end: string;
  };
  initialCapital: number;
  finalCapital: number;
  totalReturn: number;
  totalReturnPercent: number;
  maxDrawdown: number;
  sharpeRatio: number;
  trades: Trade[];
  equity: EquityPoint[];
  metrics: StrategyPerformance;
}

export interface EquityPoint {
  timestamp: string;
  value: number;
  drawdown: number;
}

export interface SystemStatus {
  overall: 'healthy' | 'warning' | 'error';
  services: ServiceStatus[];
  lastUpdate: string;
}

export interface ServiceStatus {
  name: string;
  status: 'online' | 'offline' | 'degraded';
  latency?: number;
  uptime: number;
  lastCheck: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

// Tipos para formularios
export interface CreateStrategyForm {
  name: string;
  type: StrategyType;
  exchange: string;
  pair: string;
  allocation: number;
  config: Partial<StrategyConfig>;
}

export interface ConnectExchangeForm {
  exchange: string;
  apiKey: string;
  apiSecret: string;
  passphrase?: string;
  sandbox?: boolean;
}

// Tipos para respuestas de API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Tipos para WebSocket
export interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export interface PriceUpdate {
  symbol: string;
  price: number;
  change: number;
  timestamp: string;
}

export interface TradeUpdate {
  tradeId: string;
  status: string;
  price?: number;
  timestamp: string;
}

export interface StrategyUpdate {
  strategyId: string;
  performance: Partial<StrategyPerformance>;
  timestamp: string;
}