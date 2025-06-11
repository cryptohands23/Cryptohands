import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const tradeRoutes: FastifyPluginAsync = async (fastify) => {
  const authenticate = async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  };

  fastify.get('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { limit = 50, offset = 0, strategyId, exchange } = request.query as any;

      const where: any = { userId };
      if (strategyId) where.strategyId = strategyId;
      if (exchange) where.exchange = { name: exchange };

      const trades = await prisma.trade.findMany({
        where,
        include: {
          strategy: { select: { name: true, type: true } },
          exchange: { select: { name: true, displayName: true } },
        },
        orderBy: { timestamp: 'desc' },
        take: parseInt(limit),
        skip: parseInt(offset),
      });

      const total = await prisma.trade.count({ where });

      return {
        success: true,
        data: {
          data: trades,
          total,
          page: Math.floor(offset / limit) + 1,
          limit: parseInt(limit),
          hasNext: offset + limit < total,
          hasPrev: offset > 0,
        },
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ success: false, error: 'Internal server error' });
    }
  });

  fastify.get('/:id', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { id } = request.params as { id: string };

      const trade = await prisma.trade.findFirst({
        where: { id, userId },
        include: {
          strategy: true,
          exchange: true,
        },
      });

      if (!trade) {
        return reply.code(404).send({ success: false, error: 'Trade not found' });
      }

      return { success: true, data: trade };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ success: false, error: 'Internal server error' });
    }
  });
};

export = tradeRoutes;