import { WebSocketMessage, PriceUpdate, TradeUpdate, StrategyUpdate } from '../types';

type EventHandler = (data: any) => void;

class WebSocketService {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  private isConnecting = false;
  private url: string;

  constructor() {
    this.url = import.meta.env.VITE_WS_URL || 'ws://localhost:3001';
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        resolve();
        return;
      }

      if (this.isConnecting) {
        reject(new Error('Already connecting'));
        return;
      }

      this.isConnecting = true;

      try {
        const token = localStorage.getItem('auth_token');
        const wsUrl = token ? `${this.url}?token=${token}` : this.url;
        
        this.ws = new WebSocket(wsUrl);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.emit('connected', {});
          resolve();
        };

        this.ws.onmessage = (event) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        this.ws.onclose = (event) => {
          console.log('WebSocket disconnected:', event.code, event.reason);
          this.isConnecting = false;
          this.emit('disconnected', { code: event.code, reason: event.reason });
          
          if (!event.wasClean && this.reconnectAttempts < this.maxReconnectAttempts) {
            this.scheduleReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnecting = false;
          this.emit('error', error);
          reject(error);
        };

      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.reconnectAttempts = this.maxReconnectAttempts; // Prevent reconnection
  }

  private scheduleReconnect(): void {
    this.reconnectAttempts++;
    const delay = this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1);
    
    console.log(`Scheduling reconnect attempt ${this.reconnectAttempts} in ${delay}ms`);
    
    setTimeout(() => {
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        this.connect().catch(console.error);
      }
    }, delay);
  }

  private handleMessage(message: WebSocketMessage): void {
    const { type, data } = message;
    
    switch (type) {
      case 'price_update':
        this.emit('priceUpdate', data as PriceUpdate);
        break;
      case 'trade_update':
        this.emit('tradeUpdate', data as TradeUpdate);
        break;
      case 'strategy_update':
        this.emit('strategyUpdate', data as StrategyUpdate);
        break;
      case 'portfolio_update':
        this.emit('portfolioUpdate', data);
        break;
      case 'notification':
        this.emit('notification', data);
        break;
      case 'ai_recommendation':
        this.emit('aiRecommendation', data);
        break;
      case 'system_status':
        this.emit('systemStatus', data);
        break;
      default:
        console.warn('Unknown WebSocket message type:', type);
    }
  }

  send(type: string, data: any): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      const message: WebSocketMessage = {
        type,
        data,
        timestamp: new Date().toISOString(),
      };
      this.ws.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket not connected, cannot send message');
    }
  }

  // Event subscription methods
  on(event: string, handler: EventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  off(event: string, handler: EventHandler): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in WebSocket event handler for ${event}:`, error);
        }
      });
    }
  }

  // Convenience methods for common subscriptions
  subscribeToPriceUpdates(symbols: string[]): void {
    this.send('subscribe_prices', { symbols });
  }

  unsubscribeFromPriceUpdates(symbols: string[]): void {
    this.send('unsubscribe_prices', { symbols });
  }

  subscribeToStrategyUpdates(strategyIds: string[]): void {
    this.send('subscribe_strategies', { strategyIds });
  }

  unsubscribeFromStrategyUpdates(strategyIds: string[]): void {
    this.send('unsubscribe_strategies', { strategyIds });
  }

  subscribeToPortfolioUpdates(): void {
    this.send('subscribe_portfolio', {});
  }

  unsubscribeFromPortfolioUpdates(): void {
    this.send('unsubscribe_portfolio', {});
  }

  subscribeToNotifications(): void {
    this.send('subscribe_notifications', {});
  }

  unsubscribeFromNotifications(): void {
    this.send('unsubscribe_notifications', {});
  }

  // Status methods
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  getReadyState(): number | null {
    return this.ws?.readyState ?? null;
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }
}

export const wsService = new WebSocketService();
export default wsService;