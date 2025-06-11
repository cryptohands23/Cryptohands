import { FastifyPluginAsync } from 'fastify';

const systemRoutes: FastifyPluginAsync = async (fastify) => {
  const authenticate = async (request: any, reply: any) => {
    try { await request.jwtVerify(); } catch (err) { reply.send(err); }
  };

  fastify.get('/status', { preHandler: authenticate }, async (request, reply) => {
    const status = {
      system: 'online',
      bots: { active: 5, total: 8 },
      exchanges: { connected: 2, total: 3 },
      uptime: '2d 14h 32m',
      version: '1.0.0',
    };
    return { success: true, data: status };
  });

  fastify.get('/logs', { preHandler: authenticate }, async (request, reply) => {
    const logs = [
      { timestamp: new Date(), level: 'INFO', service: 'grid-bot', message: 'Trade executed successfully' },
      { timestamp: new Date(), level: 'WARN', service: 'dca-bot', message: 'Low balance detected' },
      { timestamp: new Date(), level: 'ERROR', service: 'arbitrage', message: 'Exchange connection failed' },
    ];
    return { success: true, data: logs };
  });
};

export = systemRoutes;