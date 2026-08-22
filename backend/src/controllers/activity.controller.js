import prisma from '../config/prisma.js';

export const getActivities = async (req, res, next) => {
  try {
    const { cityId, search } = req.query;

    const where = {};

    if (cityId && typeof cityId === 'string' && cityId.trim()) {
      where.cityId = cityId.trim();
    }

    if (search && typeof search === 'string' && search.trim()) {
      where.name = {
        contains: search.trim(),
        mode: 'insensitive'
      };
    }

    const activities = await prisma.activity.findMany({
      where,
      select: {
        id: true,
        cityId: true,
        name: true,
        description: true,
        category: true,
        estimatedCost: true,
        duration: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    const formattedActivities = activities.map(act => ({
      ...act,
      estimatedCost: Number(act.estimatedCost)
    }));

    return res.status(200).json(formattedActivities);
  } catch (error) {
    next(error);
  }
};
