import { FastifyPluginAsync } from 'fastify';

const defiRoutes: FastifyPluginAsync = async (fastify) => {
  const authenticate = async (request: any, reply: any) => {
    try { await request.jwtVerify(); } catch (err) { reply.send(err); }
  };

  fastify.get('/opportunities', { preHandler: authenticate }, async (request, reply) => {
    const mockOpportunities = [
      { protocol: 'Aave', apy: 8.5, tvl: 12000000, risk: 'LOW' },
      { protocol: 'Curve', apy: 12.3, tvl: 8500000, risk: 'MEDIUM' },
      { protocol: 'Uniswap V3', apy: 15.7, tvl: 5200000, risk: 'HIGH' },
    ];
    return { success: true, data: mockOpportunities };
  });

  fastify.get('/positions', { preHandler: authenticate }, async (request, reply) => {
    const mockPositions = [
      { protocol: 'Aave', amount: 1000, apy: 8.5, rewards: 25.3 },
      { protocol: 'Curve', amount: 500, apy: 12.3, rewards: 18.7 },
    ];
    return { success: true, data: mockPositions };
  });
};

export = defiRoutes;