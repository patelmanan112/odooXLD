import prisma from '../config/prisma.js';

export const saveDestination = async (req, res, next) => {
  try {
    const { cityId } = req.body;

    if (!cityId || typeof cityId !== 'string' || !cityId.trim()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'cityId is required.'
      });
    }

    const city = await prisma.city.findUnique({
      where: { id: cityId.trim() }
    });

    if (!city) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'City not found in catalog.'
      });
    }

    const existing = await prisma.savedDestination.findFirst({
      where: {
        userId: req.user.userId,
        cityId: cityId.trim()
      }
    });

    if (existing) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'This city is already saved to your destinations.'
      });
    }

    const saved = await prisma.savedDestination.create({
      data: {
        userId: req.user.userId,
        cityId: cityId.trim()
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

    return res.status(201).json(saved);
  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'Conflict',
        message: 'This city is already saved to your destinations.'
      });
    }
    next(error);
  }
};

export const getSavedDestinations = async (req, res, next) => {
  try {
    const saved = await prisma.savedDestination.findMany({
      where: {
        userId: req.user.userId
      },
      orderBy: {
        createdAt: 'desc'
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

    return res.status(200).json(saved);
  } catch (error) {
    next(error);
  }
};

export const checkCityIsSaved = async (req, res, next) => {
  try {
    const { cityId } = req.params;

    const city = await prisma.city.findUnique({
      where: { id: cityId }
    });

    if (!city) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'City not found in catalog.'
      });
    }

    const saved = await prisma.savedDestination.findFirst({
      where: {
        userId: req.user.userId,
        cityId
      }
    });

    return res.status(200).json({
      cityId,
      isSaved: Boolean(saved)
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleSavedDestination = async (req, res, next) => {
  try {
    const { id } = req.params;

    const saved = await prisma.savedDestination.findFirst({
      where: {
        id,
        userId: req.user.userId
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

    if (!saved) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Saved destination not found or permission denied.'
      });
    }

    return res.status(200).json(saved);
  } catch (error) {
    next(error);
  }
};

export const deleteSavedDestination = async (req, res, next) => {
  try {
    const { id } = req.params;

    const saved = await prisma.savedDestination.findFirst({
      where: {
        id,
        userId: req.user.userId
      }
    });

    if (!saved) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Saved destination not found or permission denied.'
      });
    }

    await prisma.savedDestination.delete({
      where: { id }
    });

    return res.status(200).json({
      message: 'Saved destination removed successfully',
      id
    });
  } catch (error) {
    next(error);
  }
};
