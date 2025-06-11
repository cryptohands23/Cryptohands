import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Fastify instance
const server = fastify({
  logger: {
    level: 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    },
  },
});

// Register plugins
async function registerPlugins() {
  // CORS
  await server.register(cors, {
    origin: true,
    credentials: true,
  });

  // JWT
  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'demo-secret-key',
  });

  // WebSocket
  await server.register(websocket);
}

// Health check endpoint
server.get('/health', async (request, reply) => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      api: 'running',
      mode: 'demo',
    },
  };
});

// Demo auth routes
server.post('/api/auth/login', async (request, reply) => {
  const { email, password } = request.body as { email: string; password: string };
  
  // Demo login - accept any email/password
  if (email && password) {
    const token = server.jwt.sign({ userId: 'demo-user', email });
    
    return {
      success: true,
      data: {
        user: {
          id: 'demo-user',
          email,
          name: 'Demo User',
          avatar: null,
          riskLevel: 'MODERATE',
          autoReinvest: true,
          withdrawalThreshold: 1000,
          twoFactorEnabled: false,
        },
        token,
      },
    };
  }
  
  return reply.code(401).send({
    success: false,
    error: 'Invalid credentials',
  });
});

server.post('/api/auth/register', async (request, reply) => {
  const { email, password, name } = request.body as { email: string; password: string; name: string };
  
  if (email && password && name) {
    const token = server.jwt.sign({ userId: 'demo-user', email });
    
    return {
      success: true,
      data: {
        user: {
          id: 'demo-user',
          email,
          name,
          avatar: null,
          riskLevel: 'MODERATE',
          autoReinvest: true,
          withdrawalThreshold: 1000,
          twoFactorEnabled: false,
        },
        token,
      },
    };
  }
  
  return reply.code(400).send({
    success: false,
    error: 'Missing required fields',
  });
});

// Demo portfolio data
server.get('/api/portfolio', async (request, reply) => {
  return {
    success: true,
    data: {
      id: 'demo-portfolio',
      totalValue: 12500,
      totalInvested: 10000,
      totalProfit: 2500,
      totalProfitPercent: 25,
      dailyChange: 350,
      dailyChangePercent: 2.8,
      assets: [
        { symbol: 'BTC', name: 'Bitcoin', amount: 0.25, value: 9300, price: 37200, change24h: 850, change24hPercent: 2.3, allocation: 74.4 },
        { symbol: 'ETH', name: 'Ethereum', amount: 1.2, value: 2400, price: 2000, change24h: -50, change24hPercent: -2.1, allocation: 19.2 },
        { symbol: 'USDT', name: 'Tether', amount: 800, value: 800, price: 1, change24h: 0, change24hPercent: 0, allocation: 6.4 },
      ],
      allocation: [
        { name: 'Bitcoin', value: 9300, percentage: 74.4, color: '#F7931A' },
        { name: 'Ethereum', value: 2400, percentage: 19.2, color: '#627EEA' },
        { name: 'Tether', value: 800, percentage: 6.4, color: '#26A17B' },
      ],
    },
  };
});

// Demo strategies
server.get('/api/strategies', async (request, reply) => {
  return {
    success: true,
    data: [
      {
        id: 'strategy-1',
        name: 'BTC Grid Trading',
        type: 'GRID',
        status: 'ACTIVE',
        pair: 'BTC/USDT',
        allocation: 5000,
        totalReturn: 1250,
        totalReturnPercent: 25,
        dailyReturn: 85,
        winRate: 72.5,
        totalTrades: 156,
        exchange: { name: 'binance', displayName: 'Binance', status: 'ONLINE' },
      },
      {
        id: 'strategy-2',
        name: 'ETH DCA Bot',
        type: 'DCA',
        status: 'ACTIVE',
        pair: 'ETH/USDT',
        allocation: 3000,
        totalReturn: 450,
        totalReturnPercent: 15,
        dailyReturn: 25,
        winRate: 68,
        totalTrades: 89,
        exchange: { name: 'binance', displayName: 'Binance', status: 'ONLINE' },
      },
      {
        id: 'strategy-3',
        name: 'Arbitrage Bot',
        type: 'ARBITRAGE',
        status: 'PAUSED',
        pair: 'BTC/USDT',
        allocation: 2000,
        totalReturn: 180,
        totalReturnPercent: 9,
        dailyReturn: 12,
        winRate: 85,
        totalTrades: 45,
        exchange: { name: 'kucoin', displayName: 'KuCoin', status: 'ONLINE' },
      },
    ],
  };
});

// Demo AI recommendations
server.get('/api/ai/recommendations', async (request, reply) => {
  return {
    success: true,
    data: [
      {
        id: '1',
        type: 'STRATEGY',
        title: 'Optimizar Grid Trading en BTC/USDT',
        description: 'La IA detectó que reducir el spacing del grid en un 15% podría aumentar las ganancias en un 8%.',
        confidence: 0.85,
        impact: 'HIGH',
        action: 'adjust_grid_spacing',
        reasoning: {
          analysis: 'Análisis de volatilidad de las últimas 72 horas',
          factors: ['Volatilidad reducida', 'Volumen estable', 'Soporte técnico fuerte'],
          expectedGain: 8.2,
        },
        status: 'PENDING',
        createdAt: new Date(),
      },
      {
        id: '2',
        type: 'REBALANCE',
        title: 'Rebalancear Portfolio',
        description: 'Se recomienda mover 15% del capital de DCA a Arbitrage debido a oportunidades detectadas.',
        confidence: 0.72,
        impact: 'MEDIUM',
        action: 'rebalance_portfolio',
        reasoning: {
          analysis: 'Análisis de oportunidades de arbitraje',
          factors: ['Diferencias de precio entre exchanges', 'Liquidez alta', 'Spreads favorables'],
          expectedGain: 5.5,
        },
        status: 'PENDING',
        createdAt: new Date(),
      },
    ],
  };
});

// Demo market data
server.get('/api/market/prices', async (request, reply) => {
  return {
    success: true,
    data: {
      'BTC/USDT': { price: 37250, change: 2.5, volume: 1250000000 },
      'ETH/USDT': { price: 2180, change: -1.2, volume: 850000000 },
      'BNB/USDT': { price: 315, change: 0.8, volume: 120000000 },
    },
  };
});

// Demo exchanges
server.get('/api/exchanges', async (request, reply) => {
  return {
    success: true,
    data: [
      {
        id: 'exchange-1',
        name: 'binance',
        displayName: 'Binance',
        isConnected: true,
        status: 'ONLINE',
        lastSync: new Date(),
        balances: [
          { asset: 'BTC', free: 0.25, locked: 0, total: 0.25, usdValue: 9300 },
          { asset: 'ETH', free: 1.2, locked: 0, total: 1.2, usdValue: 2400 },
          { asset: 'USDT', free: 800, locked: 0, total: 800, usdValue: 800 },
        ],
      },
      {
        id: 'exchange-2',
        name: 'kucoin',
        displayName: 'KuCoin',
        isConnected: true,
        status: 'ONLINE',
        lastSync: new Date(),
        balances: [],
      },
    ],
  };
});

// Demo trades
server.get('/api/trades', async (request, reply) => {
  return {
    success: true,
    data: {
      data: [
        {
          id: 'trade-1',
          pair: 'BTC/USDT',
          side: 'BUY',
          type: 'LIMIT',
          amount: 0.01,
          price: 37200,
          fee: 0.75,
          profit: 25,
          status: 'FILLED',
          reason: 'Grid level triggered',
          timestamp: new Date(),
          strategy: { name: 'BTC Grid Trading', type: 'GRID' },
          exchange: { name: 'binance', displayName: 'Binance' },
        },
        {
          id: 'trade-2',
          pair: 'ETH/USDT',
          side: 'BUY',
          type: 'MARKET',
          amount: 0.1,
          price: 2180,
          fee: 0.22,
          profit: null,
          status: 'FILLED',
          reason: 'DCA schedule',
          timestamp: new Date(),
          strategy: { name: 'ETH DCA Bot', type: 'DCA' },
          exchange: { name: 'binance', displayName: 'Binance' },
        },
      ],
      total: 156,
      page: 1,
      limit: 50,
      hasNext: true,
      hasPrev: false,
    },
  };
});

// Demo notifications
server.get('/api/notifications', async (request, reply) => {
  return {
    success: true,
    data: [
      { id: '1', type: 'SUCCESS', title: 'Trade Ejecutado', message: 'Grid Bot compró 0.1 BTC a $37,200', read: false, createdAt: new Date() },
      { id: '2', type: 'INFO', title: 'Recomendación IA', message: 'Se sugiere ajustar parámetros del DCA Bot', read: false, createdAt: new Date() },
      { id: '3', type: 'WARNING', title: 'Stop Loss Activado', message: 'Posición cerrada con pérdida del 2%', read: true, createdAt: new Date() },
    ],
  };
});

// WebSocket for real-time updates
server.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection: any, req: any) => {
    console.log('WebSocket connection established');
    
    // Send periodic price updates
    const interval = setInterval(() => {
      const mockUpdate = {
        type: 'price_update',
        data: {
          symbol: 'BTC/USDT',
          price: 37000 + Math.random() * 1000,
          change: Math.random() * 100 - 50,
          timestamp: new Date().toISOString(),
        },
      };
      
      connection.send(JSON.stringify(mockUpdate));
    }, 5000);
    
    connection.on('close', () => {
      clearInterval(interval);
      console.log('WebSocket connection closed');
    });
  });
});

// Error handler
server.setErrorHandler((error, request, reply) => {
  server.log.error(error);
  reply.status(500).send({
    error: 'Internal Server Error',
    message: 'Something went wrong',
  });
});

// Start server
async function start() {
  try {
    await registerPlugins();
    
    const port = parseInt(process.env.PORT || '3001');
    const host = '0.0.0.0';
    
    await server.listen({ port, host });
    
    console.log(`🚀 Prompt Maestro Demo Backend running on http://${host}:${port}`);
    console.log(`📊 Health check: http://${host}:${port}/health`);
    console.log(`🔌 WebSocket: ws://${host}:${port}/ws`);
    console.log(`💡 Demo Mode: No database required - all data is mocked`);
    
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  try {
    await server.close();
    console.log('Server shut down successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start if this file is run directly
if (require.main === module) {
  start();
}

export { server };