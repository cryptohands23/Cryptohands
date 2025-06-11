import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const userRoutes: FastifyPluginAsync = async (fastify) => {
  const authenticate = async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  };

  fastify.get('/dashboard', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };

      // Get user's portfolio summary
      const portfolio = await prisma.portfolio.findFirst({
        where: { userId },
        include: { assets: true },
      });

      // Get active strategies
      const strategies = await prisma.strategy.findMany({
        where: { userId, status: 'ACTIVE' },
        include: { exchange: { select: { displayName: true } } },
      });

      // Get recent trades
      const recentTrades = await prisma.trade.findMany({
        where: { userId },
        include: {
          strategy: { select: { name: true } },
          exchange: { select: { displayName: true } },
        },
        orderBy: { timestamp: 'desc' },
        take: 10,
      });

      // Calculate summary stats
      const totalStrategies = await prisma.strategy.count({ where: { userId } });
      const totalTrades = await prisma.trade.count({ where: { userId } });
      const profitableTrades = await prisma.trade.count({
        where: { userId, profit: { gt: 0 } },
      });

      const summary = {
        portfolio: portfolio || { totalValue: 0, totalProfit: 0, dailyChange: 0 },
        stats: {
          totalStrategies,
          activeStrategies: strategies.length,
          totalTrades,
          winRate: totalTrades > 0 ? (profitableTrades / totalTrades) * 100 : 0,
        },
        strategies: strategies.slice(0, 5),
        recentTrades: recentTrades.slice(0, 5),
      };

      return { success: true, data: summary };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ success: false, error: 'Internal server error' });
    }
  });
};

export = userRoutes;