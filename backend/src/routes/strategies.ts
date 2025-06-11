import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const strategyRoutes: FastifyPluginAsync = async (fastify) => {
  // Middleware to verify JWT
  const authenticate = async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  };

  // Get all strategies
  fastify.get('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };

      const strategies = await prisma.strategy.findMany({
        where: { userId },
        include: {
          exchange: {
            select: {
              name: true,
              displayName: true,
              status: true,
            },
          },
          trades: {
            take: 5,
            orderBy: { timestamp: 'desc' },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      return {
        success: true,
        data: strategies,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  // Get strategy by ID
  fastify.get('/:id', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { id } = request.params as { id: string };

      const strategy = await prisma.strategy.findFirst({
        where: { id, userId },
        include: {
          exchange: true,
          trades: {
            orderBy: { timestamp: 'desc' },
            take: 50,
          },
        },
      });

      if (!strategy) {
        return reply.code(404).send({
          success: false,
          error: 'Strategy not found',
        });
      }

      return {
        success: true,
        data: strategy,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  // Create new strategy
  fastify.post('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const {
        name,
        type,
        exchangeId,
        pair,
        allocation,
        config,
        description,
      } = request.body as {
        name: string;
        type: string;
        exchangeId: string;
        pair: string;
        allocation: number;
        config: any;
        description?: string;
      };

      // Validate exchange belongs to user
      const exchange = await prisma.exchange.findFirst({
        where: { id: exchangeId, userId },
      });

      if (!exchange) {
        return reply.code(400).send({
          success: false,
          error: 'Invalid exchange',
        });
      }

      // Validate strategy configuration
      const validatedConfig = validateStrategyConfig(type, config);

      const strategy = await prisma.strategy.create({
        data: {
          userId,
          exchangeId,
          name,
          type: type as any,
          pair,
          allocation,
          config: validatedConfig,
          description,
          status: 'STOPPED',
        },
        include: {
          exchange: {
            select: {
              name: true,
              displayName: true,
              status: true,
            },
          },
        },
      });

      return {
        success: true,
        data: strategy,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  // Update strategy
  fastify.patch('/:id', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { id } = request.params as { id: string };
      const updates = request.body as Partial<{
        name: string;
        allocation: number;
        config: any;
        description: string;
      }>;

      // Validate strategy belongs to user
      const existingStrategy = await prisma.strategy.findFirst({
        where: { id, userId },
      });

      if (!existingStrategy) {
        return reply.code(404).send({
          success: false,
          error: 'Strategy not found',
        });
      }

      // Validate config if provided
      if (updates.config) {
        updates.config = validateStrategyConfig(existingStrategy.type, updates.config);
      }

      const strategy = await prisma.strategy.update({
        where: { id },
        data: updates,
        include: {
          exchange: {
            select: {
              name: true,
              displayName: true,
              status: true,
            },
          },
        },
      });

      return {
        success: true,
        data: strategy,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  // Delete strategy
  fastify.delete('/:id', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { id } = request.params as { id: string };

      // Check if strategy exists and belongs to user
      const strategy = await prisma.strategy.findFirst({
        where: { id, userId },
      });

      if (!strategy) {
        return reply.code(404).send({
          success: false,
          error: 'Strategy not found',
        });
      }

      // Can't delete active strategies
      if (strategy.status === 'ACTIVE') {
        return reply.code(400).send({
          success: false,
          error: 'Cannot delete active strategy. Stop it first.',
        });
      }

      await prisma.strategy.delete({
        where: { id },
      });

      return {
        success: true,
        message: 'Strategy deleted successfully',
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  // Start strategy
  fastify.post('/:id/start', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { id } = request.params as { id: string };

      const strategy = await prisma.strategy.findFirst({
        where: { id, userId },
        include: { exchange: true },
      });

      if (!strategy) {
        return reply.code(404).send({
          success: false,
          error: 'Strategy not found',
        });
      }

      // Check if exchange is connected
      if (!strategy.exchange.isConnected) {
        return reply.code(400).send({
          success: false,
          error: 'Exchange is not connected',
        });
      }

      // Update strategy status
      const updatedStrategy = await prisma.strategy.update({
        where: { id },
        data: { 
          status: 'ACTIVE',
          updatedAt: new Date(),
        },
        include: {
          exchange: {
            select: {
              name: true,
              displayName: true,
              status: true,
            },
          },
        },
      });

      // Here you would start the actual trading bot
      await startTradingBot(updatedStrategy);

      return {
        success: true,
        data: updatedStrategy,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  // Stop strategy
  fastify.post('/:id/stop', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { id } = request.params as { id: string };

      const strategy = await prisma.strategy.findFirst({
        where: { id, userId },
      });

      if (!strategy) {
        return reply.code(404).send({
          success: false,
          error: 'Strategy not found',
        });
      }

      const updatedStrategy = await prisma.strategy.update({
        where: { id },
        data: { 
          status: 'STOPPED',
          updatedAt: new Date(),
        },
        include: {
          exchange: {
            select: {
              name: true,
              displayName: true,
              status: true,
            },
          },
        },
      });

      // Here you would stop the actual trading bot
      await stopTradingBot(id);

      return {
        success: true,
        data: updatedStrategy,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  // Pause strategy
  fastify.post('/:id/pause', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { id } = request.params as { id: string };

      const strategy = await prisma.strategy.findFirst({
        where: { id, userId },
      });

      if (!strategy) {
        return reply.code(404).send({
          success: false,
          error: 'Strategy not found',
        });
      }

      const updatedStrategy = await prisma.strategy.update({
        where: { id },
        data: { 
          status: 'PAUSED',
          updatedAt: new Date(),
        },
        include: {
          exchange: {
            select: {
              name: true,
              displayName: true,
              status: true,
            },
          },
        },
      });

      // Here you would pause the actual trading bot
      await pauseTradingBot(id);

      return {
        success: true,
        data: updatedStrategy,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  // Backtest strategy
  fastify.post('/:id/backtest', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { id } = request.params as { id: string };
      const { startDate, endDate, initialCapital } = request.body as {
        startDate: string;
        endDate: string;
        initialCapital: number;
      };

      const strategy = await prisma.strategy.findFirst({
        where: { id, userId },
      });

      if (!strategy) {
        return reply.code(404).send({
          success: false,
          error: 'Strategy not found',
        });
      }

      // Run backtest (mock implementation)
      const backtestResult = await runBacktest(strategy, {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        initialCapital,
      });

      // Save backtest result
      const savedResult = await prisma.backtestResult.create({
        data: {
          strategyId: id,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          initialCapital,
          finalCapital: backtestResult.finalCapital,
          totalReturn: backtestResult.totalReturn,
          totalReturnPercent: backtestResult.totalReturnPercent,
          maxDrawdown: backtestResult.maxDrawdown,
          sharpeRatio: backtestResult.sharpeRatio,
          trades: backtestResult.trades,
          equity: backtestResult.equity,
          metrics: backtestResult.metrics,
        },
      });

      return {
        success: true,
        data: savedResult,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  // Get strategy analytics
  fastify.get('/:id/analytics', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { id } = request.params as { id: string };
      const { period = '30d' } = request.query as { period?: string };

      const strategy = await prisma.strategy.findFirst({
        where: { id, userId },
        include: {
          trades: {
            orderBy: { timestamp: 'desc' },
            take: 100,
          },
        },
      });

      if (!strategy) {
        return reply.code(404).send({
          success: false,
          error: 'Strategy not found',
        });
      }

      // Calculate analytics
      const analytics = calculateStrategyAnalytics(strategy, period);

      return {
        success: true,
        data: analytics,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  });
};

// Helper functions
function validateStrategyConfig(type: string, config: any) {
  // Basic validation - in production, use a proper schema validator
  const defaultConfigs: Record<string, any> = {
    DCA: {
      interval: 3600, // 1 hour
      amount: 100,
      stopLoss: 0.1,
      takeProfit: 0.2,
    },
    GRID: {
      levels: 10,
      spacing: 0.01,
      upperBound: 1.1,
      lowerBound: 0.9,
    },
    SCALPING: {
      timeframe: '1m',
      indicators: ['RSI', 'MACD'],
      rsiOverbought: 70,
      rsiOversold: 30,
    },
  };

  return { ...defaultConfigs[type], ...config };
}

async function startTradingBot(strategy: any) {
  // Implementation would start the actual trading bot
  console.log(`Starting trading bot for strategy ${strategy.id}`);
}

async function stopTradingBot(strategyId: string) {
  // Implementation would stop the actual trading bot
  console.log(`Stopping trading bot for strategy ${strategyId}`);
}

async function pauseTradingBot(strategyId: string) {
  // Implementation would pause the actual trading bot
  console.log(`Pausing trading bot for strategy ${strategyId}`);
}

async function runBacktest(strategy: any, params: any) {
  // Mock backtest implementation
  const trades = [];
  const equity = [];
  let capital = params.initialCapital;
  
  // Generate mock backtest data
  for (let i = 0; i < 50; i++) {
    const profit = (Math.random() - 0.4) * 100; // Slightly positive bias
    capital += profit;
    
    trades.push({
      timestamp: new Date(params.startDate.getTime() + i * 24 * 60 * 60 * 1000),
      side: profit > 0 ? 'SELL' : 'BUY',
      amount: 0.1,
      price: 35000 + Math.random() * 5000,
      profit,
    });
    
    equity.push({
      timestamp: new Date(params.startDate.getTime() + i * 24 * 60 * 60 * 1000),
      value: capital,
      drawdown: Math.max(0, (Math.max(...equity.map(e => e.value), params.initialCapital) - capital) / Math.max(...equity.map(e => e.value), params.initialCapital)),
    });
  }

  const totalReturn = capital - params.initialCapital;
  const totalReturnPercent = (totalReturn / params.initialCapital) * 100;
  const maxDrawdown = Math.max(...equity.map(e => e.drawdown));

  return {
    finalCapital: capital,
    totalReturn,
    totalReturnPercent,
    maxDrawdown,
    sharpeRatio: totalReturnPercent / Math.max(maxDrawdown, 1),
    trades,
    equity,
    metrics: {
      winRate: trades.filter(t => t.profit > 0).length / trades.length,
      averageProfit: trades.filter(t => t.profit > 0).reduce((sum, t) => sum + t.profit, 0) / trades.filter(t => t.profit > 0).length,
      averageLoss: trades.filter(t => t.profit < 0).reduce((sum, t) => sum + t.profit, 0) / trades.filter(t => t.profit < 0).length,
    },
  };
}

function calculateStrategyAnalytics(strategy: any, period: string) {
  // Mock analytics calculation
  return {
    performance: {
      totalReturn: strategy.totalReturn,
      totalReturnPercent: strategy.totalReturnPercent,
      dailyReturn: strategy.dailyReturn,
      weeklyReturn: strategy.weeklyReturn,
      monthlyReturn: strategy.monthlyReturn,
      sharpeRatio: strategy.sharpeRatio,
    },
    risk: {
      maxDrawdown: strategy.maxDrawdown,
      volatility: 15.2,
      valueAtRisk: strategy.allocation * 0.05,
    },
    trades: {
      total: strategy.totalTrades,
      profitable: strategy.profitableTrades,
      winRate: strategy.winRate,
      averageProfit: strategy.averageProfit,
      averageLoss: strategy.averageLoss,
    },
  };
}

export = strategyRoutes;