import prisma from '../config/prisma.js';

const VALID_STATUSES = ['DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED'];

const SAFE_USER_SELECT = {
  id: true,
  name: true,
  avatarUrl: true,
  city: true,
  country: true
};

const formatPublicTrip = (trip) => {
  if (!trip) return null;
  return {
    ...trip,
    estimatedBudget: trip.estimatedBudget !== undefined && trip.estimatedBudget !== null ? Number(trip.estimatedBudget) : 0,
    spentBudget: trip.spentBudget !== undefined && trip.spentBudget !== null ? Number(trip.spentBudget) : 0
  };
};

const formatPublicTripDetail = (trip) => {
  if (!trip) return null;
  const formattedStops = (trip.stops || []).map(stop => ({
    ...stop,
    sectionBudget: stop.sectionBudget !== null && stop.sectionBudget !== undefined ? Number(stop.sectionBudget) : null,
    tripActivities: (stop.tripActivities || []).map(ta => ({
      ...ta,
      activity: ta.activity ? {
        ...ta.activity,
        estimatedCost: ta.activity.estimatedCost !== undefined && ta.activity.estimatedCost !== null ? Number(ta.activity.estimatedCost) : 0
      } : null
    }))
  }));

  return {
    ...formatPublicTrip(trip),
    stops: formattedStops
  };
};

export const getPublicTrips = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);

    if (isNaN(pageNum) || !Number.isInteger(pageNum) || pageNum < 1) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'page must be a positive integer >= 1.'
      });
    }

    if (isNaN(limitNum) || !Number.isInteger(limitNum) || limitNum < 1 || limitNum > 50) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'limit must be an integer between 1 and 50.'
      });
    }

    const where = {
      isPublic: true
    };

    if (status) {
      const upperStatus = String(status).trim().toUpperCase();
      if (!VALID_STATUSES.includes(upperStatus)) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `Invalid status filter. Allowed values: ${VALID_STATUSES.join(', ')}`
        });
      }
      where.status = upperStatus;
    }

    if (search && typeof search === 'string' && search.trim()) {
      const trimmedSearch = search.trim();
      where.OR = [
        { title: { contains: trimmedSearch, mode: 'insensitive' } },
        { description: { contains: trimmedSearch, mode: 'insensitive' } }
      ];
    }

    const skip = (pageNum - 1) * limitNum;

    const [total, trips] = await Promise.all([
      prisma.trip.count({ where }),
      prisma.trip.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          user: {
            select: SAFE_USER_SELECT
          }
        }
      })
    ]);

    const totalPages = Math.ceil(total / limitNum) || 1;

    return res.status(200).json({
      data: trips.map(formatPublicTrip),
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicTripById = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    if (!tripId || typeof tripId !== 'string' || !tripId.trim()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'tripId parameter is required.'
      });
    }

    const trip = await prisma.trip.findFirst({
      where: {
        id: tripId.trim(),
        isPublic: true
      },
      include: {
        user: {
          select: SAFE_USER_SELECT
        },
        stops: {
          orderBy: {
            stopOrder: 'asc'
          },
          include: {
            city: {
              select: {
                id: true,
                name: true,
                country: true,
                description: true,
                imageUrl: true
              }
            },
            tripActivities: {
              orderBy: [
                { date: 'asc' },
                { time: 'asc' },
                { order: 'asc' }
              ],
              include: {
                activity: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    category: true,
                    estimatedCost: true,
                    duration: true,
                    imageUrl: true,
                    effortLevel: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!trip) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Public trip not found.'
      });
    }

    return res.status(200).json(formatPublicTripDetail(trip));
  } catch (error) {
    next(error);
  }
};
