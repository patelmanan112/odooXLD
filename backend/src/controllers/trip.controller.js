import prisma from '../config/prisma.js';

export const createTrip = async (req, res, next) => {
  try {
    const { title, description, startDate, endDate } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Trip title is required.'
      });
    }

    const tripData = {
      userId: req.user.userId,
      title: title.trim(),
      description: description ? description.trim() : null,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null
    };

    const trip = await prisma.trip.create({
      data: tripData
    });

    return res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
};

export const getTrips = async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({
      where: {
        userId: req.user.userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
};

export const getTripById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trip = await prisma.trip.findFirst({
      where: {
        id,
        userId: req.user.userId
      },
      include: {
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
              include: {
                activity: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    category: true,
                    estimatedCost: true,
                    duration: true,
                    imageUrl: true
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
        message: 'Trip not found or you do not have permission to view it.'
      });
    }

    // Format Decimal values for JSON serialization compatibility
    const formattedStops = trip.stops.map(stop => ({
      ...stop,
      tripActivities: stop.tripActivities.map(ta => ({
        ...ta,
        activity: ta.activity ? {
          ...ta.activity,
          estimatedCost: Number(ta.activity.estimatedCost)
        } : null
      }))
    }));

    const formattedTrip = {
      ...trip,
      stops: formattedStops
    };

    return res.status(200).json(formattedTrip);
  } catch (error) {
    next(error);
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, startDate, endDate } = req.body;

    const existingTrip = await prisma.trip.findFirst({
      where: {
        id,
        userId: req.user.userId
      }
    });

    if (!existingTrip) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Trip not found or you do not have permission to update it.'
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (startDate !== undefined) updateData.startDate = startDate ? new Date(startDate) : null;
    if (endDate !== undefined) updateData.endDate = endDate ? new Date(endDate) : null;

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: updateData
    });

    return res.status(200).json(updatedTrip);
  } catch (error) {
    next(error);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingTrip = await prisma.trip.findFirst({
      where: {
        id,
        userId: req.user.userId
      }
    });

    if (!existingTrip) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Trip not found or you do not have permission to delete it.'
      });
    }

    await prisma.trip.delete({
      where: { id }
    });

    return res.status(200).json({
      message: 'Trip deleted successfully',
      id
    });
  } catch (error) {
    next(error);
  }
};
