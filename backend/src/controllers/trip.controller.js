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

/* ==========================================
   TRIP STOPS APIs
   ========================================== */

export const addTripStop = async (req, res, next) => {
  try {
    const { id: tripId } = req.params;
    const { cityId, startDate, endDate, stopOrder } = req.body;

    if (!cityId || !startDate || !endDate) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'cityId, startDate, and endDate are required.'
      });
    }

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.userId }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Not Found', message: 'Trip not found.' });
    }

    const maxOrder = stopOrder !== undefined ? stopOrder : (await prisma.tripStop.count({ where: { tripId } })) + 1;

    const stop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        stopOrder: maxOrder
      },
      include: {
        city: true
      }
    });

    return res.status(201).json(stop);
  } catch (error) {
    next(error);
  }
};

export const deleteTripStop = async (req, res, next) => {
  try {
    const { id: tripId, stopId } = req.params;

    const stop = await prisma.tripStop.findFirst({
      where: { id: stopId, tripId, trip: { userId: req.user.userId } }
    });

    if (!stop) {
      return res.status(404).json({ error: 'Not Found', message: 'Trip stop not found.' });
    }

    await prisma.tripStop.delete({ where: { id: stopId } });
    return res.status(200).json({ message: 'Trip stop deleted successfully', stopId });
  } catch (error) {
    next(error);
  }
};

export const reorderTripStops = async (req, res, next) => {
  try {
    const { id: tripId } = req.params;
    const { stops } = req.body; // Array of { stopId, stopOrder }

    if (!Array.isArray(stops)) {
      return res.status(400).json({ error: 'Validation Error', message: 'stops must be an array.' });
    }

    const updates = stops.map(s => 
      prisma.tripStop.updateMany({
        where: { id: s.stopId, tripId, trip: { userId: req.user.userId } },
        data: { stopOrder: s.stopOrder }
      })
    );

    await prisma.$transaction(updates);

    return res.status(200).json({ message: 'Trip stops reordered successfully.' });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   TRIP ACTIVITY APIs
   ========================================== */

export const assignActivityToStop = async (req, res, next) => {
  try {
    const { stopId } = req.params;
    const { activityId, date, time } = req.body;

    if (!activityId) {
      return res.status(400).json({ error: 'Validation Error', message: 'activityId is required.' });
    }

    const tripActivity = await prisma.tripActivity.create({
      data: {
        tripStopId: stopId,
        activityId,
        date: date ? new Date(date) : null,
        time: time || null
      },
      include: {
        activity: true
      }
    });

    return res.status(201).json({
      ...tripActivity,
      activity: {
        ...tripActivity.activity,
        estimatedCost: Number(tripActivity.activity.estimatedCost)
      }
    });
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'This activity is already assigned to this trip stop.'
      });
    }
    next(error);
  }
};

export const removeActivityFromStop = async (req, res, next) => {
  try {
    const { stopId, activityId } = req.params;

    const deleted = await prisma.tripActivity.deleteMany({
      where: {
        tripStopId: stopId,
        activityId
      }
    });

    if (deleted.count === 0) {
      return res.status(404).json({ error: 'Not Found', message: 'Activity assignment not found.' });
    }

    return res.status(200).json({ message: 'Activity removed from stop successfully.' });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   BUDGET CALCULATION API
   ========================================== */

export const getTripBudget = async (req, res, next) => {
  try {
    const { id: tripId } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.userId },
      include: {
        stops: {
          include: {
            tripActivities: {
              include: {
                activity: true
              }
            }
          }
        }
      }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Not Found', message: 'Trip not found.' });
    }

    let total = 0;
    const byCategory = {};

    trip.stops.forEach(stop => {
      stop.tripActivities.forEach(ta => {
        if (ta.activity) {
          const cost = Number(ta.activity.estimatedCost) || 0;
          const category = ta.activity.category || 'General';
          total += cost;
          byCategory[category] = (byCategory[category] || 0) + cost;
        }
      });
    });

    return res.status(200).json({
      tripId,
      total,
      byCategory
    });
  } catch (error) {
    next(error);
  }
};
