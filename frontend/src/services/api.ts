import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  PaginatedResponse, 
  User, 
  Portfolio, 
  TradingStrategy, 
  Exchange, 
  AIRecommendation, 
  Notification,
  SystemStatus,
  Trade,
  BacktestResult,
  CreateStrategyForm,
  ConnectExchangeForm
} from '../types';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor para añadir token
    this.api.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor para manejar errores
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth endpoints
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.api.post('/auth/login', { email, password });
    return response.data;
  }

  async register(email: string, password: string, name: string): Promise<ApiResponse<{ user: User; token: string }>> {
    const response = await this.api.post('/auth/register', { email, password, name });
    return response.data;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.api.post('/auth/logout');
    return response.data;
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await this.api.post('/auth/refresh');
    return response.data;
  }

  async getProfile(): Promise<ApiResponse<User>> {
    const response = await this.api.get('/auth/profile');
    return response.data;
  }

  async updateProfile(updates: Partial<User>): Promise<ApiResponse<User>> {
    const response = await this.api.patch('/auth/profile', updates);
    return response.data;
  }

  // Portfolio endpoints
  async getPortfolio(): Promise<ApiResponse<Portfolio>> {
    const response = await this.api.get('/portfolio');
    return response.data;
  }

  async getPortfolioHistory(period: string = '7d'): Promise<ApiResponse<any[]>> {
    const response = await this.api.get(`/portfolio/history?period=${period}`);
    return response.data;
  }

  // Strategies endpoints
  async getStrategies(): Promise<ApiResponse<TradingStrategy[]>> {
    const response = await this.api.get('/strategies');
    return response.data;
  }

  async getStrategy(id: string): Promise<ApiResponse<TradingStrategy>> {
    const response = await this.api.get(`/strategies/${id}`);
    return response.data;
  }

  async createStrategy(strategy: CreateStrategyForm): Promise<ApiResponse<TradingStrategy>> {
    const response = await this.api.post('/strategies', strategy);
    return response.data;
  }

  async updateStrategy(id: string, updates: Partial<TradingStrategy>): Promise<ApiResponse<TradingStrategy>> {
    const response = await this.api.patch(`/strategies/${id}`, updates);
    return response.data;
  }

  async deleteStrategy(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/strategies/${id}`);
    return response.data;
  }

  async startStrategy(id: string): Promise<ApiResponse<TradingStrategy>> {
    const response = await this.api.post(`/strategies/${id}/start`);
    return response.data;
  }

  async stopStrategy(id: string): Promise<ApiResponse<TradingStrategy>> {
    const response = await this.api.post(`/strategies/${id}/stop`);
    return response.data;
  }

  async pauseStrategy(id: string): Promise<ApiResponse<TradingStrategy>> {
    const response = await this.api.post(`/strategies/${id}/pause`);
    return response.data;
  }

  async backtestStrategy(id: string, params: any): Promise<ApiResponse<BacktestResult>> {
    const response = await this.api.post(`/strategies/${id}/backtest`, params);
    return response.data;
  }

  // Exchanges endpoints
  async getExchanges(): Promise<ApiResponse<Exchange[]>> {
    const response = await this.api.get('/exchanges');
    return response.data;
  }

  async connectExchange(exchangeData: ConnectExchangeForm): Promise<ApiResponse<Exchange>> {
    const response = await this.api.post('/exchanges/connect', exchangeData);
    return response.data;
  }

  async disconnectExchange(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.delete(`/exchanges/${id}`);
    return response.data;
  }

  async testExchangeConnection(id: string): Promise<ApiResponse<{ status: string; latency: number }>> {
    const response = await this.api.post(`/exchanges/${id}/test`);
    return response.data;
  }

  async syncExchange(id: string): Promise<ApiResponse<Exchange>> {
    const response = await this.api.post(`/exchanges/${id}/sync`);
    return response.data;
  }

  // Trades endpoints
  async getTrades(params?: { 
    strategyId?: string; 
    exchange?: string; 
    limit?: number; 
    offset?: number 
  }): Promise<ApiResponse<PaginatedResponse<Trade>>> {
    const response = await this.api.get('/trades', { params });
    return response.data;
  }

  async getTrade(id: string): Promise<ApiResponse<Trade>> {
    const response = await this.api.get(`/trades/${id}`);
    return response.data;
  }

  // AI Recommendations endpoints
  async getRecommendations(): Promise<ApiResponse<AIRecommendation[]>> {
    const response = await this.api.get('/ai/recommendations');
    return response.data;
  }

  async acceptRecommendation(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.post(`/ai/recommendations/${id}/accept`);
    return response.data;
  }

  async rejectRecommendation(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.post(`/ai/recommendations/${id}/reject`);
    return response.data;
  }

  async generateRecommendations(): Promise<ApiResponse<AIRecommendation[]>> {
    const response = await this.api.post('/ai/recommendations/generate');
    return response.data;
  }

  // Notifications endpoints
  async getNotifications(): Promise<ApiResponse<Notification[]>> {
    const response = await this.api.get('/notifications');
    return response.data;
  }

  async markNotificationAsRead(id: string): Promise<ApiResponse<void>> {
    const response = await this.api.patch(`/notifications/${id}/read`);
    return response.data;
  }

  async markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
    const response = await this.api.patch('/notifications/read-all');
    return response.data;
  }

  // System endpoints
  async getSystemStatus(): Promise<ApiResponse<SystemStatus>> {
    const response = await this.api.get('/system/status');
    return response.data;
  }

  async getSystemLogs(params?: { level?: string; limit?: number }): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/system/logs', { params });
    return response.data;
  }

  // Market data endpoints
  async getMarketData(symbols: string[]): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/market/data', { 
      params: { symbols: symbols.join(',') } 
    });
    return response.data;
  }

  async getMarketNews(params?: { limit?: number; assets?: string[] }): Promise<ApiResponse<any[]>> {
    const response = await this.api.get('/market/news', { params });
    return response.data;
  }

  // Analytics endpoints
  async getAnalytics(period: string = '30d'): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/analytics?period=${period}`);
    return response.data;
  }

  async getStrategyAnalytics(id: string, period: string = '30d'): Promise<ApiResponse<any>> {
    const response = await this.api.get(`/analytics/strategies/${id}?period=${period}`);
    return response.data;
  }

  // Utility methods
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.api.get('/health');
      return response.status === 200;
    } catch {
      return false;
    }
  }

  setAuthToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  removeAuthToken(): void {
    localStorage.removeItem('auth_token');
  }

  getAuthToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}

export const apiService = new ApiService();
export default apiService;