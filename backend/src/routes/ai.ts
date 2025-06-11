import { FastifyPluginAsync } from 'fastify';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const aiRoutes: FastifyPluginAsync = async (fastify) => {
  const authenticate = async (request: any, reply: any) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  };

  // Get AI recommendations
  fastify.get('/recommendations', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };

      // Mock AI recommendations
      const recommendations = [
        {
          id: '1',
          type: 'STRATEGY',
          title: 'Optimizar Grid Trading en BTC/USDT',
          description: 'La IA detectó que reducir el spacing del grid en un 15% podría aumentar las ganancias en un 8%.',
          confidence: 0.85,
          impact: 'HIGH',
          action: 'adjust_grid_spacing',
          reasoning: {
            analysis: 'Análisis de volatilidad de las últimas 72 horas',
            factors: ['Volatilidad reducida', 'Volumen estable', 'Soporte técnico fuerte'],
            expectedGain: 8.2,
          },
          status: 'PENDING',
          createdAt: new Date(),
        },
        {
          id: '2',
          type: 'REBALANCE',
          title: 'Rebalancear Portfolio',
          description: 'Se recomienda mover 15% del capital de DCA a Arbitrage debido a oportunidades detectadas.',
          confidence: 0.72,
          impact: 'MEDIUM',
          action: 'rebalance_portfolio',
          reasoning: {
            analysis: 'Análisis de oportunidades de arbitraje',
            factors: ['Diferencias de precio entre exchanges', 'Liquidez alta', 'Spreads favorables'],
            expectedGain: 5.5,
          },
          status: 'PENDING',
          createdAt: new Date(),
        },
      ];

      return { success: true, data: recommendations };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // Chat with AI assistant
  fastify.post('/chat', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const { message, context } = request.body as { message: string; context?: any };

      // Mock AI response
      const aiResponse = generateAIResponse(message, context);

      // Save session
      await prisma.aISession.create({
        data: {
          userId,
          type: 'chat',
          input: { message, context },
          output: aiResponse,
          confidence: aiResponse.confidence,
        },
      });

      return { success: true, data: aiResponse };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // Market analysis
  fastify.get('/analysis/:symbol', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { symbol } = request.params as { symbol: string };

      // Mock market analysis
      const analysis = {
        symbol,
        sentiment: 'BULLISH',
        confidence: 0.78,
        signals: {
          technical: {
            rsi: 65,
            macd: 'BULLISH',
            ema: 'UPTREND',
            support: 36500,
            resistance: 38200,
          },
          fundamental: {
            news_sentiment: 0.6,
            social_sentiment: 0.7,
            whale_activity: 'ACCUMULATING',
          },
        },
        prediction: {
          short_term: { direction: 'UP', probability: 0.72, target: 38000 },
          medium_term: { direction: 'UP', probability: 0.65, target: 40000 },
          long_term: { direction: 'UP', probability: 0.58, target: 45000 },
        },
        recommendations: [
          'Considerar aumentar posición en DCA',
          'Grid trading con rango 36500-38200',
          'Stop loss conservador en 35800',
        ],
      };

      return { success: true, data: analysis };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ success: false, error: 'Internal server error' });
    }
  });

  // Accept/reject recommendation
  fastify.post('/recommendations/:id/:action', { preHandler: authenticate }, async (request, reply) => {
    try {
      const { id, action } = request.params as { id: string; action: 'accept' | 'reject' };

      if (!['accept', 'reject'].includes(action)) {
        return reply.code(400).send({ success: false, error: 'Invalid action' });
      }

      // In a real implementation, this would update the recommendation and potentially execute actions
      const result = {
        id,
        action,
        status: action === 'accept' ? 'ACCEPTED' : 'REJECTED',
        message: action === 'accept' ? 'Recomendación aceptada y ejecutándose' : 'Recomendación rechazada',
      };

      return { success: true, data: result };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({ success: false, error: 'Internal server error' });
    }
  });
};

function generateAIResponse(message: string, context?: any) {
  // Mock AI responses based on message content
  const responses: Record<string, any> = {
    'portfolio': {
      message: 'Tu portfolio está bien diversificado. Tienes un 45% en BTC, 30% en ETH y 25% en altcoins. La IA recomienda mantener esta distribución por ahora.',
      confidence: 0.82,
      suggestions: ['Mantener diversificación actual', 'Considerar DCA en próximas correcciones'],
    },
    'strategy': {
      message: 'Tus estrategias están funcionando bien. El Grid Trading tiene un ROI del 12% este mes. Recomiendo ajustar el DCA para aprovechar la volatilidad actual.',
      confidence: 0.75,
      suggestions: ['Optimizar parámetros de Grid', 'Aumentar frecuencia de DCA'],
    },
    'market': {
      message: 'El mercado muestra señales mixtas. Bitcoin está en una zona de consolidación entre $36,000 y $38,000. Es un buen momento para estrategias de rango.',
      confidence: 0.68,
      suggestions: ['Activar Grid Trading en BTC', 'Reducir exposición en altcoins'],
    },
  };

  // Simple keyword matching
  const lowerMessage = message.toLowerCase();
  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  // Default response
  return {
    message: 'Entiendo tu consulta. Basándome en el análisis actual del mercado y tu portfolio, te recomiendo mantener una estrategia conservadora mientras monitoreamos las condiciones del mercado.',
    confidence: 0.60,
    suggestions: ['Revisar configuración de stop-loss', 'Monitorear volatilidad del mercado'],
  };
}

export = aiRoutes;