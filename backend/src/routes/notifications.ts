import { FastifyPluginAsync } from 'fastify';

const notificationRoutes: FastifyPluginAsync = async (fastify) => {
  const authenticate = async (request: any, reply: any) => {
    try { await request.jwtVerify(); } catch (err) { reply.send(err); }
  };

  fastify.get('/', { preHandler: authenticate }, async (request, reply) => {
    const mockNotifications = [
      { id: '1', type: 'SUCCESS', title: 'Trade Ejecutado', message: 'Grid Bot compró 0.1 BTC a $37,200', read: false, createdAt: new Date() },
      { id: '2', type: 'INFO', title: 'Recomendación IA', message: 'Se sugiere ajustar parámetros del DCA Bot', read: false, createdAt: new Date() },
      { id: '3', type: 'WARNING', title: 'Stop Loss Activado', message: 'Posición cerrada con pérdida del 2%', read: true, createdAt: new Date() },
    ];
    return { success: true, data: mockNotifications };
  });

  fastify.patch('/:id/read', { preHandler: authenticate }, async (request, reply) => {
    return { success: true, message: 'Notification marked as read' };
  });
};

export = notificationRoutes;