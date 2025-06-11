import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const portfolioRoutes: FastifyPluginAsync = async (fastify) => {
  // Middleware to verify JWT
  const authenticate = async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  };

  // Get portfolio
  fastify.get('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };

      const portfolio = await prisma.portfolio.findFirst({
        where: { userId },
        include: {
          assets: true,
        },
      });

      if (!portfolio) {
        // Create portfolio if it doesn't exist
        const newPortfolio = await prisma.portfolio.create({
          data: { userId },
          include: { assets: true },
        });

        return {
          success: true,
          data: {
            ...newPortfolio,
            allocation: [],
          },
        };
      }

      // Calculate allocation data
      const allocation = portfolio.assets.map(asset => ({
        name: asset.name,
        value: asset.value,
        percentage: portfolio.totalValue > 0 ? (asset.value / portfolio.totalValue) * 100 : 0,
        color: getAssetColor(asset.symbol),
      }));

      return {
        success: true,
        data: {
          ...portfolio,
          allocation,
        },
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  // Get portfolio history
  fastify.get('/history', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { period = '7d' } = request.query as { period?: string };

      // Mock data for now - in production, this would come from historical data
      const mockHistory = generateMockPortfolioHistory(period);

      return {
        success: true,
        data: mockHistory,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  // Update portfolio (manual sync)
  fastify.post('/sync', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };

      // Get user's exchanges
      const exchanges = await prisma.exchange.findMany({
        where: { userId, isConnected: true },
        include: { balances: true },
      });

      let totalValue = 0;
      const assets: any[] = [];

      // Aggregate balances from all exchanges
      const assetMap = new Map();

      for (const exchange of exchanges) {
        for (const balance of exchange.balances) {
          if (balance.total > 0) {
            const existing = assetMap.get(balance.asset);
            if (existing) {
              existing.amount += balance.total;
              existing.value += balance.usdValue;
            } else {
              assetMap.set(balance.asset, {
                symbol: balance.asset,
                name: getAssetName(balance.asset),
                amount: balance.total,
                value: balance.usdValue,
                price: balance.usdValue / balance.total,
                change24h: 0, // Would be fetched from market data
                change24hPercent: 0,
                allocation: 0,
              });
            }
            totalValue += balance.usdValue;
          }
        }
      }

      // Convert map to array and calculate allocations
      for (const [symbol, asset] of assetMap) {
        asset.allocation = totalValue > 0 ? (asset.value / totalValue) * 100 : 0;
        assets.push(asset);
      }

      // Update portfolio
      const portfolio = await prisma.portfolio.upsert({
        where: { userId },
        update: {
          totalValue,
          // Calculate other metrics based on historical data
          dailyChange: totalValue * 0.05, // Mock 5% daily change
          dailyChangePercent: 5,
        },
        create: {
          userId,
          totalValue,
          dailyChange: 0,
          dailyChangePercent: 0,
        },
      });

      // Update assets
      await prisma.asset.deleteMany({
        where: { portfolioId: portfolio.id },
      });

      if (assets.length > 0) {
        await prisma.asset.createMany({
          data: assets.map(asset => ({
            portfolioId: portfolio.id,
            ...asset,
          })),
        });
      }

      // Fetch updated portfolio
      const updatedPortfolio = await prisma.portfolio.findUnique({
        where: { id: portfolio.id },
        include: { assets: true },
      });

      return {
        success: true,
        data: updatedPortfolio,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  // Get portfolio analytics
  fastify.get('/analytics', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { period = '30d' } = request.query as { period?: string };

      // Mock analytics data
      const analytics = {
        performance: {
          totalReturn: 2500,
          totalReturnPercent: 25.5,
          bestDay: 450,
          worstDay: -320,
          volatility: 15.2,
          sharpeRatio: 1.8,
        },
        allocation: {
          byAsset: [
            { name: 'Bitcoin', percentage: 45, value: 4500 },
            { name: 'Ethereum', percentage: 30, value: 3000 },
            { name: 'Others', percentage: 25, value: 2500 },
          ],
          byStrategy: [
            { name: 'DCA Bots', percentage: 40, value: 4000 },
            { name: 'Grid Trading', percentage: 35, value: 3500 },
            { name: 'Arbitrage', percentage: 25, value: 2500 },
          ],
        },
        riskMetrics: {
          valueAtRisk: 850,
          maxDrawdown: 12.5,
          beta: 1.2,
          correlation: 0.85,
        },
      };

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
function getAssetColor(symbol: string): string {
  const colors: Record<string, string> = {
    BTC: '#F7931A',
    ETH: '#627EEA',
    USDT: '#26A17B',
    USDC: '#2775CA',
    BNB: '#F3BA2F',
    ADA: '#0033AD',
    SOL: '#9945FF',
    DOT: '#E6007A',
  };
  return colors[symbol] || '#8B5CF6';
}

function getAssetName(symbol: string): string {
  const names: Record<string, string> = {
    BTC: 'Bitcoin',
    ETH: 'Ethereum',
    USDT: 'Tether',
    USDC: 'USD Coin',
    BNB: 'Binance Coin',
    ADA: 'Cardano',
    SOL: 'Solana',
    DOT: 'Polkadot',
  };
  return names[symbol] || symbol;
}

function generateMockPortfolioHistory(period: string) {
  const points = period === '24h' ? 24 : period === '7d' ? 7 : 30;
  const history = [];
  let baseValue = 10000;

  for (let i = 0; i < points; i++) {
    const change = (Math.random() - 0.5) * 500;
    baseValue += change;
    
    history.push({
      timestamp: new Date(Date.now() - (points - i) * 24 * 60 * 60 * 1000).toISOString(),
      value: Math.max(baseValue, 5000),
      change: change,
      changePercent: (change / baseValue) * 100,
    });
  }

  return history;
}

export = portfolioRoutes;