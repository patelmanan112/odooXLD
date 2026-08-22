import prisma from '../config/prisma.js';

export const getCities = async (req, res, next) => {
  try {
    const { search } = req.query;

    const where = {};
    if (search && typeof search === 'string' && search.trim()) {
      where.name = {
        contains: search.trim(),
        mode: 'insensitive'
      };
    }

    const cities = await prisma.city.findMany({
      where,
      select: {
        id: true,
        name: true,
        country: true,
        description: true,
        imageUrl: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return res.status(200).json(cities);
  } catch (error) {
    next(error);
  }
};
