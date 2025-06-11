import { FastifyPluginAsync } from 'fastify';

const analyticsRoutes: FastifyPluginAsync = async (fastify) => {
  const authenticate = async (request: any, reply: any) => {
    try { await request.jwtVerify(); } catch (err) { reply.send(err); }
  };

  fastify.get('/performance', { preHandler: authenticate }, async (request, reply) => {
    const mockData = {
      totalReturn: 2500,
      totalReturnPercent: 25.5,
      sharpeRatio: 1.8,
      maxDrawdown: 12.5,
      winRate: 68.5,
      bestStrategy: 'Grid Trading BTC',
      worstStrategy: 'DCA ETH',
    };
    return { success: true, data: mockData };
  });
};

export = analyticsRoutes;