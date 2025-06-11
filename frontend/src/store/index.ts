import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { 
  User, 
  Portfolio, 
  TradingStrategy, 
  Exchange, 
  AIRecommendation, 
  Notification,
  SystemStatus,
  MarketData 
} from '../types';

interface AppState {
  // User state
  user: User | null;
  isAuthenticated: boolean;
  
  // Portfolio state
  portfolio: Portfolio | null;
  
  // Strategies state
  strategies: TradingStrategy[];
  activeStrategies: TradingStrategy[];
  
  // Exchanges state
  exchanges: Exchange[];
  connectedExchanges: Exchange[];
  
  // AI state
  recommendations: AIRecommendation[];
  
  // Notifications state
  notifications: Notification[];
  unreadCount: number;
  
  // System state
  systemStatus: SystemStatus | null;
  isLoading: boolean;
  error: string | null;
  
  // Market data
  marketData: Record<string, MarketData>;
  
  // UI state
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  
  // Actions
  setUser: (user: User | null) => void;
  setPortfolio: (portfolio: Portfolio) => void;
  setStrategies: (strategies: TradingStrategy[]) => void;
  addStrategy: (strategy: TradingStrategy) => void;
  updateStrategy: (id: string, updates: Partial<TradingStrategy>) => void;
  removeStrategy: (id: string) => void;
  setExchanges: (exchanges: Exchange[]) => void;
  addExchange: (exchange: Exchange) => void;
  updateExchange: (id: string, updates: Partial<Exchange>) => void;
  removeExchange: (id: string) => void;
  setRecommendations: (recommendations: AIRecommendation[]) => void;
  addRecommendation: (recommendation: AIRecommendation) => void;
  updateRecommendation: (id: string, updates: Partial<AIRecommendation>) => void;
  setNotifications: (notifications: Notification[]) => void;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  setSystemStatus: (status: SystemStatus) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateMarketData: (symbol: string, data: MarketData) => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  reset: () => void;
}

const initialState = {
  user: null,
  isAuthenticated: false,
  portfolio: null,
  strategies: [],
  activeStrategies: [],
  exchanges: [],
  connectedExchanges: [],
  recommendations: [],
  notifications: [],
  unreadCount: 0,
  systemStatus: null,
  isLoading: false,
  error: null,
  marketData: {},
  sidebarOpen: true,
  theme: 'dark' as const,
};

export const useAppStore = create<AppState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        
        setUser: (user) => set({ user, isAuthenticated: !!user }),
        
        setPortfolio: (portfolio) => set({ portfolio }),
        
        setStrategies: (strategies) => set({ 
          strategies,
          activeStrategies: strategies.filter(s => s.status === 'active')
        }),
        
        addStrategy: (strategy) => set((state) => {
          const strategies = [...state.strategies, strategy];
          return {
            strategies,
            activeStrategies: strategies.filter(s => s.status === 'active')
          };
        }),
        
        updateStrategy: (id, updates) => set((state) => {
          const strategies = state.strategies.map(s => 
            s.id === id ? { ...s, ...updates } : s
          );
          return {
            strategies,
            activeStrategies: strategies.filter(s => s.status === 'active')
          };
        }),
        
        removeStrategy: (id) => set((state) => {
          const strategies = state.strategies.filter(s => s.id !== id);
          return {
            strategies,
            activeStrategies: strategies.filter(s => s.status === 'active')
          };
        }),
        
        setExchanges: (exchanges) => set({ 
          exchanges,
          connectedExchanges: exchanges.filter(e => e.isConnected)
        }),
        
        addExchange: (exchange) => set((state) => {
          const exchanges = [...state.exchanges, exchange];
          return {
            exchanges,
            connectedExchanges: exchanges.filter(e => e.isConnected)
          };
        }),
        
        updateExchange: (id, updates) => set((state) => {
          const exchanges = state.exchanges.map(e => 
            e.id === id ? { ...e, ...updates } : e
          );
          return {
            exchanges,
            connectedExchanges: exchanges.filter(e => e.isConnected)
          };
        }),
        
        removeExchange: (id) => set((state) => {
          const exchanges = state.exchanges.filter(e => e.id !== id);
          return {
            exchanges,
            connectedExchanges: exchanges.filter(e => e.isConnected)
          };
        }),
        
        setRecommendations: (recommendations) => set({ recommendations }),
        
        addRecommendation: (recommendation) => set((state) => ({
          recommendations: [recommendation, ...state.recommendations]
        })),
        
        updateRecommendation: (id, updates) => set((state) => ({
          recommendations: state.recommendations.map(r => 
            r.id === id ? { ...r, ...updates } : r
          )
        })),
        
        setNotifications: (notifications) => set({ 
          notifications,
          unreadCount: notifications.filter(n => !n.read).length
        }),
        
        addNotification: (notification) => set((state) => {
          const notifications = [notification, ...state.notifications];
          return {
            notifications,
            unreadCount: notifications.filter(n => !n.read).length
          };
        }),
        
        markNotificationAsRead: (id) => set((state) => {
          const notifications = state.notifications.map(n => 
            n.id === id ? { ...n, read: true } : n
          );
          return {
            notifications,
            unreadCount: notifications.filter(n => !n.read).length
          };
        }),
        
        markAllNotificationsAsRead: () => set((state) => ({
          notifications: state.notifications.map(n => ({ ...n, read: true })),
          unreadCount: 0
        })),
        
        setSystemStatus: (systemStatus) => set({ systemStatus }),
        
        setLoading: (isLoading) => set({ isLoading }),
        
        setError: (error) => set({ error }),
        
        updateMarketData: (symbol, data) => set((state) => ({
          marketData: { ...state.marketData, [symbol]: data }
        })),
        
        setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
        
        setTheme: (theme) => set({ theme }),
        
        reset: () => set(initialState),
      }),
      {
        name: 'prompt-maestro-store',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          theme: state.theme,
          sidebarOpen: state.sidebarOpen,
        }),
      }
    ),
    { name: 'PromptMaestroStore' }
  )
);

// Selectores útiles
export const useUser = () => useAppStore((state) => state.user);
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated);
export const usePortfolio = () => useAppStore((state) => state.portfolio);
export const useStrategies = () => useAppStore((state) => state.strategies);
export const useActiveStrategies = () => useAppStore((state) => state.activeStrategies);
export const useExchanges = () => useAppStore((state) => state.exchanges);
export const useConnectedExchanges = () => useAppStore((state) => state.connectedExchanges);
export const useRecommendations = () => useAppStore((state) => state.recommendations);
export const useNotifications = () => useAppStore((state) => state.notifications);
export const useUnreadCount = () => useAppStore((state) => state.unreadCount);
export const useSystemStatus = () => useAppStore((state) => state.systemStatus);
export const useIsLoading = () => useAppStore((state) => state.isLoading);
export const useError = () => useAppStore((state) => state.error);
export const useMarketData = () => useAppStore((state) => state.marketData);
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen);
export const useTheme = () => useAppStore((state) => state.theme);