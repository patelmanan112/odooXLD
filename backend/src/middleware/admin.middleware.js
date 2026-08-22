import prisma from '../config/prisma.js';

export const adminMiddleware = async (req, res, next) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required.'
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Authenticated user account not found.'
      });
    }

    if (user.role !== 'ADMIN') {
      return res.status(403).json({
        error: 'Forbidden',
        message: 'Admin access required. You do not have permission to access this resource.'
      });
    }

    req.user.role = user.role;
    next();
  } catch (error) {
    next(error);
  }
};
