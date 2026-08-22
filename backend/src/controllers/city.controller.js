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

export const getCityPlaces = async (req, res, next) => {
  try {
    const { city, search } = req.query;
    const queryStr = (city || search || '').trim();

    let whereClause = {};

    if (queryStr) {
      whereClause = {
        OR: [
          { city: { name: { contains: queryStr, mode: 'insensitive' } } },
          { city: { country: { contains: queryStr, mode: 'insensitive' } } },
          { name: { contains: queryStr, mode: 'insensitive' } }
        ]
      };
    }

    const activities = await prisma.activity.findMany({
      where: whereClause,
      include: {
        city: {
          select: {
            id: true,
            name: true,
            country: true,
            imageUrl: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const places = activities.map(a => ({
      id: a.id,
      name: a.name,
      city: a.city?.name || 'City',
      cityName: a.city?.name || 'City',
      country: a.city?.country || '',
      description: a.description,
      category: a.category,
      estimatedCost: Number(a.estimatedCost || 0),
      image: a.imageUrl || a.city?.imageUrl || 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?w=600&q=80'
    }));

    return res.status(200).json(places);
  } catch (error) {
    next(error);
  }
};
