import { FastifyPluginAsync } from 'fastify';

const marketRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.get('/prices', async (request, reply) => {
    const mockPrices = {
      'BTC/USDT': { price: 37250, change: 2.5, volume: 1250000000 },
      'ETH/USDT': { price: 2180, change: -1.2, volume: 850000000 },
      'BNB/USDT': { price: 315, change: 0.8, volume: 120000000 },
    };
    return { success: true, data: mockPrices };
  });

  fastify.get('/trending', async (request, reply) => {
    const trending = [
      { symbol: 'BTC', change: 5.2, volume: 1250000000 },
      { symbol: 'ETH', change: -2.1, volume: 850000000 },
      { symbol: 'SOL', change: 8.7, volume: 320000000 },
    ];
    return { success: true, data: trending };
  });
};

export = marketRoutes;