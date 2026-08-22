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

export const getProfile = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: SAFE_USER_SELECT
    });

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User profile not found.'
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const {
      name,
      avatarUrl,
      phone,
      city,
      country,
      currency,
      bio,
      email,
      role,
      password,
      passwordHash,
      id,
      userId
    } = req.body;

    // Check for protected field update attempts
    if (role !== undefined) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Role cannot be updated through the profile API.'
      });
    }

    if (email !== undefined) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email cannot be updated through the profile API.'
      });
    }

    if (password !== undefined || passwordHash !== undefined) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Password cannot be updated through the profile API.'
      });
    }

    if (id !== undefined || userId !== undefined) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'User ID cannot be modified.'
      });
    }

    // Validate fields
    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Name must be a non-empty string.'
        });
      }
    }

    if (currency !== undefined && currency !== null) {
      if (typeof currency !== 'string' || !currency.trim()) {
        return res.status(400).json({
          error: 'Validation Error',
          message: 'Currency must be a non-empty string.'
        });
      }
    }

    if (avatarUrl !== undefined && avatarUrl !== null && typeof avatarUrl !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'avatarUrl must be a string.'
      });
    }

    if (phone !== undefined && phone !== null && typeof phone !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'phone must be a string.'
      });
    }

    if (city !== undefined && city !== null && typeof city !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'city must be a string.'
      });
    }

    if (country !== undefined && country !== null && typeof country !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'country must be a string.'
      });
    }

    if (bio !== undefined && bio !== null && typeof bio !== 'string') {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'bio must be a string.'
      });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name.trim();
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl ? avatarUrl.trim() : null;
    if (phone !== undefined) updateData.phone = phone ? phone.trim() : null;
    if (city !== undefined) updateData.city = city ? city.trim() : null;
    if (country !== undefined) updateData.country = country ? country.trim() : null;
    if (currency !== undefined) updateData.currency = currency ? currency.trim() : '₹';
    if (bio !== undefined) updateData.bio = bio ? bio.trim() : null;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.userId },
      data: updateData,
      select: SAFE_USER_SELECT
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};
