import fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import websocket from '@fastify/websocket';
import multipart from '@fastify/multipart';
import staticFiles from '@fastify/static';
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize database and cache
const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

// Create Fastify instance
const server = fastify({
  logger: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    transport: process.env.NODE_ENV !== 'production' ? {
      target: 'pino-pretty',
      options: {
        colorize: true
      }
    } : undefined,
  },
});

// Register plugins
async function registerPlugins() {
  // CORS
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:12000',
    credentials: true,
  });

  // JWT
  await server.register(jwt, {
    secret: process.env.JWT_SECRET || 'your-secret-key',
  });

  // WebSocket
  await server.register(websocket);

  // Multipart (file uploads)
  await server.register(multipart);

  // Static files
  await server.register(staticFiles, {
    root: path.join(__dirname, '../public'),
    prefix: '/public/',
  });
}

// Health check endpoint
server.get('/health', async (request, reply) => {
  try {
    // Check database connection
    await prisma.$queryRaw`SELECT 1`;
    
    // Check Redis connection
    await redis.ping();

    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        database: 'connected',
        redis: 'connected',
        api: 'running',
      },
    };
  } catch (error) {
    reply.code(503);
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
});

// API Routes
server.register(async function (fastify) {
  // Auth routes
  fastify.register(require('./routes/auth'), { prefix: '/api/auth' });
  
  // User routes
  fastify.register(require('./routes/users'), { prefix: '/api/users' });
  
  // Portfolio routes
  fastify.register(require('./routes/portfolio'), { prefix: '/api/portfolio' });
  
  // Strategy routes
  fastify.register(require('./routes/strategies'), { prefix: '/api/strategies' });
  
  // Exchange routes
  fastify.register(require('./routes/exchanges'), { prefix: '/api/exchanges' });
  
  // Trading routes
  fastify.register(require('./routes/trades'), { prefix: '/api/trades' });
  
  // AI routes
  fastify.register(require('./routes/ai'), { prefix: '/api/ai' });
  
  // DeFi routes
  fastify.register(require('./routes/defi'), { prefix: '/api/defi' });
  
  // Analytics routes
  fastify.register(require('./routes/analytics'), { prefix: '/api/analytics' });
  
  // Market data routes
  fastify.register(require('./routes/market'), { prefix: '/api/market' });
  
  // Notification routes
  fastify.register(require('./routes/notifications'), { prefix: '/api/notifications' });
  
  // System routes
  fastify.register(require('./routes/system'), { prefix: '/api/system' });
});

// WebSocket for real-time updates
server.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection: any, req: any) => {
    console.log('WebSocket connection established');
    
    connection.on('message', (message: any) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('Received WebSocket message:', data);
        
        // Handle different message types
        switch (data.type) {
          case 'subscribe_prices':
            // Subscribe to price updates
            handlePriceSubscription(connection, data.symbols);
            break;
          case 'subscribe_strategies':
            // Subscribe to strategy updates
            handleStrategySubscription(connection, data.strategyIds);
            break;
          case 'subscribe_portfolio':
            // Subscribe to portfolio updates
            handlePortfolioSubscription(connection);
            break;
          default:
            console.log('Unknown message type:', data.type);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    connection.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });
});

// WebSocket handlers
function handlePriceSubscription(connection: any, symbols: string[]) {
  // Implementation for price updates
  console.log('Subscribing to price updates for:', symbols);
  
  // Mock price update every 5 seconds
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
  });
}

function handleStrategySubscription(connection: any, strategyIds: string[]) {
  console.log('Subscribing to strategy updates for:', strategyIds);
  // Implementation for strategy updates
}

function handlePortfolioSubscription(connection: any) {
  console.log('Subscribing to portfolio updates');
  // Implementation for portfolio updates
}

// Error handler
server.setErrorHandler((error, request, reply) => {
  server.log.error(error);
  
  if (error.validation) {
    reply.status(400).send({
      error: 'Validation Error',
      message: error.message,
      details: error.validation,
    });
  } else {
    reply.status(500).send({
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : error.message,
    });
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Received SIGINT, shutting down gracefully...');
  
  try {
    await server.close();
    await prisma.$disconnect();
    await redis.quit();
    console.log('Server shut down successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start server
async function start() {
  try {
    await registerPlugins();
    
    const port = parseInt(process.env.PORT || '3001');
    const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
    
    await server.listen({ port, host });
    
    console.log(`🚀 Prompt Maestro Backend running on http://${host}:${port}`);
    console.log(`📊 Health check: http://${host}:${port}/health`);
    console.log(`🔌 WebSocket: ws://${host}:${port}/ws`);
    
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}

// Export for testing
export { server, prisma, redis };

// Start if this file is run directly
if (require.main === module) {
  start();
}