import { FastifyPluginAsync } from 'fastify';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Register
  fastify.post('/register', async (request, reply) => {
    const { email, password, name } = request.body as {
      email: string;
      password: string;
      name: string;
    };

    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return reply.code(400).send({
          success: false,
          error: 'User already exists',
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          createdAt: true,
          riskLevel: true,
          autoReinvest: true,
          withdrawalThreshold: true,
          twoFactorEnabled: true,
        },
      });

      // Create initial portfolio
      await prisma.portfolio.create({
        data: {
          userId: user.id,
        },
      });

      // Generate JWT token
      const token = fastify.jwt.sign({ userId: user.id });

      return {
        success: true,
        data: {
          user,
          token,
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

  // Login
  fastify.post('/login', async (request, reply) => {
    const { email, password } = request.body as {
      email: string;
      password: string;
    };

    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return reply.code(401).send({
          success: false,
          error: 'Invalid credentials',
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return reply.code(401).send({
          success: false,
          error: 'Invalid credentials',
        });
      }

      // Generate JWT token
      const token = fastify.jwt.sign({ userId: user.id });

      // Return user data (without password)
      const { password: _, ...userWithoutPassword } = user;

      return {
        success: true,
        data: {
          user: userWithoutPassword,
          token,
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

  // Get profile (protected route)
  fastify.get('/profile', {
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    },
  }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          createdAt: true,
          riskLevel: true,
          autoReinvest: true,
          withdrawalThreshold: true,
          twoFactorEnabled: true,
        },
      });

      if (!user) {
        return reply.code(404).send({
          success: false,
          error: 'User not found',
        });
      }

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  // Update profile
  fastify.patch('/profile', {
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    },
  }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      const updates = request.body as Partial<{
        name: string;
        avatar: string;
        riskLevel: string;
        autoReinvest: boolean;
        withdrawalThreshold: number;
      }>;

      const user = await prisma.user.update({
        where: { id: userId },
        data: updates,
        select: {
          id: true,
          email: true,
          name: true,
          avatar: true,
          createdAt: true,
          riskLevel: true,
          autoReinvest: true,
          withdrawalThreshold: true,
          twoFactorEnabled: true,
        },
      });

      return {
        success: true,
        data: user,
      };
    } catch (error) {
      fastify.log.error(error);
      return reply.code(500).send({
        success: false,
        error: 'Internal server error',
      });
    }
  });

  // Logout
  fastify.post('/logout', {
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    },
  }, async (request, reply) => {
    // In a real implementation, you might want to blacklist the token
    return {
      success: true,
      message: 'Logged out successfully',
    };
  });

  // Refresh token
  fastify.post('/refresh', {
    preHandler: async (request, reply) => {
      try {
        await request.jwtVerify();
      } catch (err) {
        reply.send(err);
      }
    },
  }, async (request, reply) => {
    try {
      const { userId } = request.user as { userId: string };
      
      // Generate new token
      const token = fastify.jwt.sign({ userId });

      return {
        success: true,
        data: { token },
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

export = authRoutes;