import prisma from '../config/prisma.js';

const SAFE_USER_SELECT = {
  id: true,
  name: true,
  email: true,
  avatarUrl: true,
  phone: true,
  city: true,
  country: true,
  currency: true,
  bio: true,
  role: true,
  createdAt: true,
  updatedAt: true
};

const VALID_EFFORT_LEVELS = ['LOW', 'MODERATE', 'HIGH'];

export const getDashboardStats = async (req, res, next) => {
  try {
    const [
      users,
      trips,
      publicTrips,
      privateTrips,
      cities,
      activities,
      expenses,
      expenseAgg
    ] = await Promise.all([
      prisma.user.count(),
      prisma.trip.count(),
      prisma.trip.count({ where: { isPublic: true } }),
      prisma.trip.count({ where: { isPublic: false } }),
      prisma.city.count(),
      prisma.activity.count(),
      prisma.expense.count(),
      prisma.expense.aggregate({ _sum: { amount: true } })
    ]);

    const totalExpenseAmount = expenseAgg._sum.amount !== null && expenseAgg._sum.amount !== undefined ? Number(expenseAgg._sum.amount) : 0;

    return res.status(200).json({
      users,
      trips,
      publicTrips,
      privateTrips,
      cities,
      activities,
      expenses,
      totalExpenseAmount
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

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

    const skip = (pageNum - 1) * limitNum;

    const [total, users] = await Promise.all([
      prisma.user.count(),
      prisma.user.findMany({
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' },
        select: SAFE_USER_SELECT
      })
    ]);

    return res.status(200).json({
      data: users,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum) || 1
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: SAFE_USER_SELECT
    });

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User account not found.'
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || typeof role !== 'string' || !['USER', 'ADMIN'].includes(role.trim().toUpperCase())) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Invalid role. Allowed values: USER, ADMIN'
      });
    }

    const targetRole = role.trim().toUpperCase();

    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!targetUser) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User account not found.'
      });
    }

    // Prevent demoting the last remaining administrator
    if (targetUser.role === 'ADMIN' && targetRole === 'USER') {
      const adminCount = await prisma.user.count({
        where: { role: 'ADMIN' }
      });
      if (adminCount <= 1) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Cannot demote the last remaining administrator account.'
        });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: targetRole },
      select: SAFE_USER_SELECT
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const getAdminTrips = async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: SAFE_USER_SELECT
        }
      }
    });

    const formattedTrips = trips.map(t => ({
      ...t,
      estimatedBudget: Number(t.estimatedBudget),
      spentBudget: Number(t.spentBudget)
    }));

    return res.status(200).json(formattedTrips);
  } catch (error) {
    next(error);
  }
};

export const deleteAdminTrip = async (req, res, next) => {
  try {
    const { tripId } = req.params;

    const trip = await prisma.trip.findUnique({
      where: { id: tripId }
    });

    if (!trip) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Trip not found.'
      });
    }

    await prisma.trip.delete({
      where: { id: tripId }
    });

    return res.status(200).json({
      message: 'Trip deleted successfully by admin',
      tripId
    });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   ADMIN CITY MANAGEMENT APIs
   ========================================== */

export const createAdminCity = async (req, res, next) => {
  try {
    const { name, country, description, imageUrl } = req.body;

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'City name is required.' });
    }

    if (!country || typeof country !== 'string' || !country.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Country is required.' });
    }

    const city = await prisma.city.create({
      data: {
        name: name.trim(),
        country: country.trim(),
        description: description ? description.trim() : null,
        imageUrl: imageUrl ? imageUrl.trim() : null
      }
    });

    return res.status(201).json(city);
  } catch (error) {
    next(error);
  }
};

export const updateAdminCity = async (req, res, next) => {
  try {
    const { cityId } = req.params;
    const { name, country, description, imageUrl } = req.body;

    const existing = await prisma.city.findUnique({ where: { id: cityId } });
    if (!existing) {
      return res.status(404).json({ error: 'Not Found', message: 'City not found.' });
    }

    const updateData = {};
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Validation Error', message: 'City name must be non-empty.' });
      }
      updateData.name = name.trim();
    }

    if (country !== undefined) {
      if (typeof country !== 'string' || !country.trim()) {
        return res.status(400).json({ error: 'Validation Error', message: 'Country must be non-empty.' });
      }
      updateData.country = country.trim();
    }

    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl ? imageUrl.trim() : null;

    const updatedCity = await prisma.city.update({
      where: { id: cityId },
      data: updateData
    });

    return res.status(200).json(updatedCity);
  } catch (error) {
    next(error);
  }
};

export const deleteAdminCity = async (req, res, next) => {
  try {
    const { cityId } = req.params;

    const existing = await prisma.city.findUnique({ where: { id: cityId } });
    if (!existing) {
      return res.status(404).json({ error: 'Not Found', message: 'City not found.' });
    }

    await prisma.city.delete({ where: { id: cityId } });

    return res.status(200).json({ message: 'City deleted successfully by admin', cityId });
  } catch (error) {
    next(error);
  }
};

/* ==========================================
   ADMIN ACTIVITY MANAGEMENT APIs
   ========================================== */

export const createAdminActivity = async (req, res, next) => {
  try {
    const { cityId, name, description, category, estimatedCost, duration, imageUrl, effortLevel } = req.body;

    if (!cityId || typeof cityId !== 'string' || !cityId.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'cityId is required.' });
    }

    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Activity name is required.' });
    }

    if (!category || typeof category !== 'string' || !category.trim()) {
      return res.status(400).json({ error: 'Validation Error', message: 'Category is required.' });
    }

    if (estimatedCost === undefined || estimatedCost === null) {
      return res.status(400).json({ error: 'Validation Error', message: 'estimatedCost is required.' });
    }

    const numCost = Number(estimatedCost);
    if (isNaN(numCost) || numCost < 0) {
      return res.status(400).json({ error: 'Validation Error', message: 'estimatedCost must be a non-negative number.' });
    }

    const city = await prisma.city.findUnique({ where: { id: cityId.trim() } });
    if (!city) {
      return res.status(404).json({ error: 'Not Found', message: 'Associated city not found.' });
    }

    let validEffort = 'MODERATE';
    if (effortLevel !== undefined && effortLevel !== null && String(effortLevel).trim() !== '') {
      const upperEffort = String(effortLevel).trim().toUpperCase();
      if (!VALID_EFFORT_LEVELS.includes(upperEffort)) {
        return res.status(400).json({
          error: 'Validation Error',
          message: `Invalid effortLevel. Allowed values: ${VALID_EFFORT_LEVELS.join(', ')}`
        });
      }
      validEffort = upperEffort;
    }

    const activity = await prisma.activity.create({
      data: {
        cityId: cityId.trim(),
        name: name.trim(),
        description: description ? description.trim() : null,
        category: category.trim(),
        estimatedCost: numCost,
        duration: duration !== undefined && duration !== null ? Number(duration) : null,
        imageUrl: imageUrl ? imageUrl.trim() : null,
        effortLevel: validEffort
      }
    });

    return res.status(201).json({
      ...activity,
      estimatedCost: Number(activity.estimatedCost)
    });
  } catch (error) {
    next(error);
  }
};

export const updateAdminActivity = async (req, res, next) => {
  try {
    const { activityId } = req.params;
    const { cityId, name, description, category, estimatedCost, duration, imageUrl, effortLevel } = req.body;

    const existing = await prisma.activity.findUnique({ where: { id: activityId } });
    if (!existing) {
      return res.status(404).json({ error: 'Not Found', message: 'Activity not found.' });
    }

    const updateData = {};
    if (cityId !== undefined) {
      const city = await prisma.city.findUnique({ where: { id: cityId.trim() } });
      if (!city) {
        return res.status(404).json({ error: 'Not Found', message: 'Associated city not found.' });
      }
      updateData.cityId = cityId.trim();
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({ error: 'Validation Error', message: 'Activity name must be non-empty.' });
      }
      updateData.name = name.trim();
    }

    if (category !== undefined) {
      if (typeof category !== 'string' || !category.trim()) {
        return res.status(400).json({ error: 'Validation Error', message: 'Category must be non-empty.' });
      }
      updateData.category = category.trim();
    }

    if (estimatedCost !== undefined && estimatedCost !== null) {
      const numCost = Number(estimatedCost);
      if (isNaN(numCost) || numCost < 0) {
        return res.status(400).json({ error: 'Validation Error', message: 'estimatedCost must be a non-negative number.' });
      }
      updateData.estimatedCost = numCost;
    }

    if (duration !== undefined) updateData.duration = duration !== null ? Number(duration) : null;
    if (description !== undefined) updateData.description = description ? description.trim() : null;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl ? imageUrl.trim() : null;

    if (effortLevel !== undefined && effortLevel !== null) {
      const upperEffort = String(effortLevel).trim().toUpperCase();
      if (!VALID_EFFORT_LEVELS.includes(upperEffort)) {
        return res.status(400).json({ error: 'Validation Error', message: `Invalid effortLevel. Allowed values: ${VALID_EFFORT_LEVELS.join(', ')}` });
      }
      updateData.effortLevel = upperEffort;
    }

    const updatedActivity = await prisma.activity.update({
      where: { id: activityId },
      data: updateData
    });

    return res.status(200).json({
      ...updatedActivity,
      estimatedCost: Number(updatedActivity.estimatedCost)
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAdminActivity = async (req, res, next) => {
  try {
    const { activityId } = req.params;

    const existing = await prisma.activity.findUnique({ where: { id: activityId } });
    if (!existing) {
      return res.status(404).json({ error: 'Not Found', message: 'Activity not found.' });
    }

    await prisma.activity.delete({ where: { id: activityId } });

    return res.status(200).json({ message: 'Activity deleted successfully by admin', activityId });
  } catch (error) {
    next(error);
  }
};
