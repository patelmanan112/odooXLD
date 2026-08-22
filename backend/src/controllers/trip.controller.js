import prisma from '../config/prisma.js';

const VALID_STATUSES = ['DRAFT', 'UPCOMING', 'ONGOING', 'COMPLETED'];

const formatTrip = (trip) => {
  if (!trip) return null;
  return {
    ...trip,
    estimatedBudget: trip.estimatedBudget !== undefined && trip.estimatedBudget !== null ? Number(trip.estimatedBudget) : 0,
    spentBudget: trip.spentBudget !== undefined && trip.spentBudget !== null ? Number(trip.spentBudget) : 0
  };
};

const formatStop = (stop) => {
  if (!stop) return null;
  return {
    ...stop,
    sectionBudget: stop.sectionBudget !== null && stop.sectionBudget !== undefined ? Number(stop.sectionBudget) : null
  };
};

export const createTrip = async (req, res, next) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      estimatedBudget,
      spentBudget,
      status,
      coverPhoto,
      isPublic
    } = req.body;

    if (!title || typeof title !== 'string' || !title.trim()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Trip title is required.'
      });
    }

    if (description !== undefined && description !== null && typeof description !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Description must be a string.'
      });
    }

    let parsedStartDate = null;
    if (startDate) {
      parsedStartDate = new Date(startDate);
      if (isNaN(parsedStartDate.getTime())) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid startDate format.'
        });
      }
    }

    let parsedEndDate = null;
    if (endDate) {
      parsedEndDate = new Date(endDate);
      if (isNaN(parsedEndDate.getTime())) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid endDate format.'
        });
      }
    }

    if (parsedStartDate && parsedEndDate && parsedEndDate < parsedStartDate) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'endDate cannot be before startDate.'
      });
    }

    if (estimatedBudget !== undefined && estimatedBudget !== null) {
      const numEst = Number(estimatedBudget);
      if (isNaN(numEst) || numEst < 0) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'estimatedBudget must be a non-negative number.'
        });
      }
    }

    if (spentBudget !== undefined && spentBudget !== null) {
      const numSpent = Number(spentBudget);
      if (isNaN(numSpent) || numSpent < 0) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'spentBudget must be a non-negative number.'
        });
      }
    }

    if (status !== undefined && status !== null) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}`
        });
      }
    }

    const tripData = {
      userId: req.user.userId,
      title: title.trim(),
      description: description ? description.trim() : null,
      startDate: parsedStartDate,
      endDate: parsedEndDate
    };

    if (estimatedBudget !== undefined && estimatedBudget !== null) tripData.estimatedBudget = Number(estimatedBudget);
    if (spentBudget !== undefined && spentBudget !== null) tripData.spentBudget = Number(spentBudget);
    if (status !== undefined && status !== null) tripData.status = status;
    if (coverPhoto !== undefined && coverPhoto !== null) tripData.coverPhoto = typeof coverPhoto === 'string' ? coverPhoto.trim() : null;
    if (isPublic !== undefined && isPublic !== null) tripData.isPublic = Boolean(isPublic);

    const trip = await prisma.trip.create({
      data: tripData
    });

    return res.status(201).json(formatTrip(trip));
  } catch (error) {
    next(error);
  }
};

export const getTrips = async (req, res, next) => {
  try {
    const { status } = req.query;

    const where = {
      userId: req.user.userId
    };

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `Invalid status filter. Allowed values: ${VALID_STATUSES.join(', ')}`
        });
      }
      where.status = status;
    }

    const trips = await prisma.trip.findMany({
      where,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json(trips.map(formatTrip));
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

    const formattedStops = trip.stops.map(stop => ({
      ...stop,
      sectionBudget: stop.sectionBudget !== null && stop.sectionBudget !== undefined ? Number(stop.sectionBudget) : null,
      tripActivities: stop.tripActivities.map(ta => ({
        ...ta,
        activity: ta.activity ? {
          ...ta.activity,
          estimatedCost: Number(ta.activity.estimatedCost)
        } : null
      }))
    }));

    const formattedTrip = {
      ...formatTrip(trip),
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
    const {
      title,
      description,
      startDate,
      endDate,
      estimatedBudget,
      spentBudget,
      status,
      coverPhoto,
      isPublic
    } = req.body;

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

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Title must be a non-empty string.'
        });
      }
    }

    const effectiveStartDate = startDate !== undefined ? (startDate ? new Date(startDate) : null) : existingTrip.startDate;
    const effectiveEndDate = endDate !== undefined ? (endDate ? new Date(endDate) : null) : existingTrip.endDate;

    if (startDate !== undefined && startDate !== null) {
      if (isNaN(effectiveStartDate.getTime())) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid startDate format.'
        });
      }
    }

    if (endDate !== undefined && endDate !== null) {
      if (isNaN(effectiveEndDate.getTime())) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Invalid endDate format.'
        });
      }
    }

    if (effectiveStartDate && effectiveEndDate && effectiveEndDate < effectiveStartDate) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'endDate cannot be before startDate.'
      });
    }

    if (estimatedBudget !== undefined && estimatedBudget !== null) {
      const numEst = Number(estimatedBudget);
      if (isNaN(numEst) || numEst < 0) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'estimatedBudget must be a non-negative number.'
        });
      }
    }

    if (spentBudget !== undefined && spentBudget !== null) {
      const numSpent = Number(spentBudget);
      if (isNaN(numSpent) || numSpent < 0) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'spentBudget must be a non-negative number.'
        });
      }
    }

    if (status !== undefined && status !== null) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `Invalid status. Allowed values: ${VALID_STATUSES.join(', ')}`
        });
      }
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (startDate !== undefined) updateData.startDate = effectiveStartDate;
    if (endDate !== undefined) updateData.endDate = effectiveEndDate;
    if (estimatedBudget !== undefined) updateData.estimatedBudget = estimatedBudget !== null ? Number(estimatedBudget) : 0;
    if (spentBudget !== undefined) updateData.spentBudget = spentBudget !== null ? Number(spentBudget) : 0;
    if (status !== undefined) updateData.status = status;
    if (coverPhoto !== undefined) updateData.coverPhoto = coverPhoto ? coverPhoto.trim() : null;
    if (isPublic !== undefined) updateData.isPublic = Boolean(isPublic);

    const updatedTrip = await prisma.trip.update({
      where: { id },
      data: updateData
    });

    return res.status(200).json(formatTrip(updatedTrip));
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

export const createTripStop = async (req, res, next) => {
  try {
    const { id: tripId } = req.params;
    const { cityId, startDate, endDate, stopOrder, sectionBudget } = req.body;

    if (!cityId || typeof cityId !== 'string' || !cityId.trim()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'cityId is required.'
      });
    }

    if (!startDate || !endDate) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'startDate and endDate are required.'
      });
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (isNaN(parsedStartDate.getTime()) || isNaN(parsedEndDate.getTime())) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid date format.'
      });
    }

    if (parsedEndDate < parsedStartDate) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'endDate cannot be before startDate.'
      });
    }

    if (stopOrder === undefined || stopOrder === null || !Number.isInteger(Number(stopOrder)) || Number(stopOrder) <= 0) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'stopOrder must be a positive integer.'
      });
    }

    if (sectionBudget !== undefined && sectionBudget !== null) {
      const numBudget = Number(sectionBudget);
      if (isNaN(numBudget) || numBudget < 0) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'sectionBudget cannot be negative.'
        });
      }
    }

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.userId }
    });

    if (!trip) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Trip not found or permission denied.'
      });
    }

    if (trip.startDate && parsedStartDate < trip.startDate) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Stop startDate cannot be before trip startDate.'
      });
    }

    if (trip.endDate && parsedEndDate > trip.endDate) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Stop endDate cannot be after trip endDate.'
      });
    }

    const city = await prisma.city.findUnique({
      where: { id: cityId.trim() }
    });

    if (!city) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'City not found.'
      });
    }

    const stop = await prisma.tripStop.create({
      data: {
        tripId,
        cityId: cityId.trim(),
        startDate: parsedStartDate,
        endDate: parsedEndDate,
        stopOrder: Number(stopOrder),
        sectionBudget: sectionBudget !== undefined && sectionBudget !== null ? Number(sectionBudget) : null
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
        }
      }
    });

    return res.status(201).json(formatStop(stop));
  } catch (error) {
    next(error);
  }
};

// Alias addTripStop to createTripStop for backwards compatibility
export const addTripStop = createTripStop;

export const getTripStops = async (req, res, next) => {
  try {
    const { id: tripId } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.userId }
    });

    if (!trip) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Trip not found or permission denied.'
      });
    }

    const stops = await prisma.tripStop.findMany({
      where: { tripId },
      orderBy: { stopOrder: 'asc' },
      include: {
        city: {
          select: {
            id: true,
            name: true,
            country: true,
            description: true,
            imageUrl: true
          }
        }
      }
    });

    return res.status(200).json(stops.map(formatStop));
  } catch (error) {
    next(error);
  }
};

export const getSingleTripStop = async (req, res, next) => {
  try {
    const { id: tripId, stopId } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.userId }
    });

    if (!trip) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Trip not found or permission denied.'
      });
    }

    const stop = await prisma.tripStop.findFirst({
      where: { id: stopId, tripId },
      include: {
        city: {
          select: {
            id: true,
            name: true,
            country: true,
            description: true,
            imageUrl: true
          }
        }
      }
    });

    if (!stop) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Trip stop not found.'
      });
    }

    return res.status(200).json(formatStop(stop));
  } catch (error) {
    next(error);
  }
};

export const updateTripStop = async (req, res, next) => {
  try {
    const { id: tripId, stopId } = req.params;
    const { cityId, startDate, endDate, stopOrder, sectionBudget } = req.body;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.userId }
    });

    if (!trip) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Trip not found or permission denied.'
      });
    }

    const existingStop = await prisma.tripStop.findFirst({
      where: { id: stopId, tripId }
    });

    if (!existingStop) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Trip stop not found.'
      });
    }

    if (cityId !== undefined) {
      if (typeof cityId !== 'string' || !cityId.trim()) {
        return res.status(400).json({ error: 'Validation Error', message: 'cityId must be a valid string.' });
      }
      const cityExists = await prisma.city.findUnique({ where: { id: cityId.trim() } });
      if (!cityExists) {
        return res.status(404).json({ error: 'Not Found', message: 'City not found.' });
      }
    }

    const effectiveStartDate = startDate !== undefined ? new Date(startDate) : existingStop.startDate;
    const effectiveEndDate = endDate !== undefined ? new Date(endDate) : existingStop.endDate;

    if (startDate !== undefined) {
      if (isNaN(effectiveStartDate.getTime())) {
        return res.status(400).json({ error: 'Validation Error', message: 'Invalid startDate format.' });
      }
    }

    if (endDate !== undefined) {
      if (isNaN(effectiveEndDate.getTime())) {
        return res.status(400).json({ error: 'Validation Error', message: 'Invalid endDate format.' });
      }
    }

    if (effectiveEndDate < effectiveStartDate) {
      return res.status(400).json({ error: 'Validation Error', message: 'endDate cannot be before startDate.' });
    }

    if (trip.startDate && effectiveStartDate < trip.startDate) {
      return res.status(400).json({ error: 'Validation Error', message: 'Stop startDate cannot be before trip startDate.' });
    }

    if (trip.endDate && effectiveEndDate > trip.endDate) {
      return res.status(400).json({ error: 'Validation Error', message: 'Stop endDate cannot be after trip endDate.' });
    }

    if (stopOrder !== undefined) {
      if (!Number.isInteger(Number(stopOrder)) || Number(stopOrder) <= 0) {
        return res.status(400).json({ error: 'Validation Error', message: 'stopOrder must be a positive integer.' });
      }
    }

    if (sectionBudget !== undefined && sectionBudget !== null) {
      const numBudget = Number(sectionBudget);
      if (isNaN(numBudget) || numBudget < 0) {
        return res.status(400).json({ error: 'Validation Error', message: 'sectionBudget cannot be negative.' });
      }
    }

    const updateData = {};
    if (cityId !== undefined) updateData.cityId = cityId.trim();
    if (startDate !== undefined) updateData.startDate = effectiveStartDate;
    if (endDate !== undefined) updateData.endDate = effectiveEndDate;
    if (stopOrder !== undefined) updateData.stopOrder = Number(stopOrder);
    if (sectionBudget !== undefined) updateData.sectionBudget = sectionBudget !== null ? Number(sectionBudget) : null;

    const updatedStop = await prisma.tripStop.update({
      where: { id: stopId },
      data: updateData,
      include: {
        city: {
          select: {
            id: true,
            name: true,
            country: true,
            description: true,
            imageUrl: true
          }
        }
      }
    });

    return res.status(200).json(formatStop(updatedStop));
  } catch (error) {
    next(error);
  }
};

export const deleteTripStop = async (req, res, next) => {
  try {
    const { id: tripId, stopId } = req.params;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.userId }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Not Found', message: 'Trip not found or permission denied.' });
    }

    const stop = await prisma.tripStop.findFirst({
      where: { id: stopId, tripId }
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
    const { stopIds, stops } = req.body;

    const trip = await prisma.trip.findFirst({
      where: { id: tripId, userId: req.user.userId }
    });

    if (!trip) {
      return res.status(404).json({ error: 'Not Found', message: 'Trip not found or permission denied.' });
    }

    const existingStops = await prisma.tripStop.findMany({
      where: { tripId }
    });

    const existingStopIds = new Set(existingStops.map(s => s.id));

    let orderedIds = [];
    if (Array.isArray(stopIds)) {
      orderedIds = stopIds;
    } else if (Array.isArray(stops)) {
      orderedIds = stops.map(s => (typeof s === 'string' ? s : s.stopId));
    } else {
      return res.status(400).json({ error: 'Validation Error', message: 'stopIds must be an array of stop IDs.' });
    }

    if (orderedIds.length !== existingStops.length) {
      return res.status(400).json({ error: 'Validation Error', message: 'Reorder payload must include all stops for this trip.' });
    }

    const uniqueInputIds = new Set(orderedIds);
    if (uniqueInputIds.size !== orderedIds.length) {
      return res.status(400).json({ error: 'Validation Error', message: 'Duplicate stop IDs are not allowed in reorder request.' });
    }

    for (const id of orderedIds) {
      if (!existingStopIds.has(id)) {
        return res.status(400).json({ error: 'Validation Error', message: `Stop ${id} does not belong to this trip.` });
      }
    }

    const updates = orderedIds.map((id, index) =>
      prisma.tripStop.update({
        where: { id },
        data: { stopOrder: index + 1 }
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
