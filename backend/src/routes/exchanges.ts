import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const exchangeRoutes: FastifyPluginAsync = async (fastify) => {
  const authenticate = async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  };

  // Get all exchanges
  fastify.get('/', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      
      const exchanges = await prisma.exchange.findMany({
        where: { userId },
        include: { balances: true },
        orderBy: { createdAt: 'desc' },
      });

      return { success: true, data: exchanges };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // Connect exchange
  fastify.post('/connect', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { exchange, apiKey, apiSecret, passphrase, sandbox } = request.body as any;

      // In production, encrypt the API keys
      const newExchange = await prisma.exchange.create({
        data: {
          userId,
          name: exchange,
          displayName: getExchangeDisplayName(exchange),
          apiKey: apiKey, // Should be encrypted
          apiSecret: apiSecret, // Should be encrypted
          passphrase,
          isTestnet: sandbox || false,
          isConnected: true,
          status: 'ONLINE',
        },
      });

      return { success: true, data: newExchange };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // Test connection
  fastify.post('/:id/test', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { id } = request.params as { id: string };

      const exchange = await prisma.exchange.findFirst({
        where: { id, userId },
      });

      if (!exchange) {
        return reply.code(404).send({ success: false, error: 'Exchange not found' });
      }

      // Mock test - in production, test actual API connection
      const testResult = {
        status: 'connected',
        latency: Math.floor(Math.random() * 100) + 20,
      };

      return { success: true, data: testResult };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // Sync exchange balances
  fastify.post('/:id/sync', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { id } = request.params as { id: string };

      const exchange = await prisma.exchange.findFirst({
        where: { id, userId },
      });

      if (!exchange) {
        return reply.code(404).send({ success: false, error: 'Exchange not found' });
      }

      // Mock balance sync - in production, fetch from actual exchange
      const mockBalances = [
        { asset: 'BTC', free: 0.25, locked: 0, total: 0.25, usdValue: 9300 },
        { asset: 'ETH', free: 0.8, locked: 0, total: 0.8, usdValue: 1700 },
        { asset: 'USDT', free: 500, locked: 0, total: 500, usdValue: 500 },
      ];

      // Update balances
      await prisma.balance.deleteMany({ where: { exchangeId: id } });
      await prisma.balance.createMany({
        data: mockBalances.map(balance => ({
          exchangeId: id,
          ...balance,
        })),
      });

      const updatedExchange = await prisma.exchange.update({
        where: { id },
        data: { lastSync: new Date() },
        include: { balances: true },
      });

      return { success: true, data: updatedExchange };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // Disconnect exchange
  fastify.delete('/:id', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { id } = request.params as { id: string };

      await prisma.exchange.delete({
        where: { id, userId },
      });

      return { success: true, message: 'Exchange disconnected successfully' };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ success: false, error: 'Internal server error' });
    }
  });
};

function getExchangeDisplayName(exchange: string): string {
  const names: Record<string, string> = {
    binance: 'Binance',
    kucoin: 'KuCoin',
    bybit: 'Bybit',
    kraken: 'Kraken',
    okx: 'OKX',
  };
  return names[exchange] || exchange;
}

export = exchangeRoutes;