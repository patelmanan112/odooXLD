import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

export const checkEmail = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email query parameter is required.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    return res.status(200).json({
      exists: !!user
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        avatarUrl: true,
        phone: true,
        city: true,
        country: true,
        bio: true,
        currency: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User account not found.'
      });
    }

    return res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, avatarUrl, phone, city, country } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Name, email, and password are required fields.'
      });
    }

    if (typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Password must be at least 6 characters long.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'Conflict',
        message: 'An account with this email address already exists.'
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        avatarUrl,
        phone,
        city,
        country
      }
    });

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Signup successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        city: user.city,
        country: user.country,
        bio: user.bio,
        currency: user.currency
      }
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email and password are required fields.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password.'
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid email or password.'
      });
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        city: user.city,
        country: user.country,
        bio: user.bio,
        currency: user.currency
      }
    });
  } catch (error) {
    next(error);
  }
};

export const updateMe = async (req, res, next) => {
  try {
    const { name, avatarUrl, phone, city, country, bio, currency } = req.body;
    const userId = req.user.userId;

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name && { name: name.trim() }),
        ...(avatarUrl && { avatarUrl }),
        ...(phone && { phone }),
        ...(city && { city }),
        ...(country && { country }),
        ...(bio && { bio }),
        ...(currency && { currency })
      }
    });

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl,
        phone: updatedUser.phone,
        city: updatedUser.city,
        country: updatedUser.country,
        bio: updatedUser.bio,
        currency: updatedUser.currency
      }
    });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req, res, next) => {
  try {
    const { email, name, avatarUrl } = req.body;

    if (!email || typeof email !== 'string' || !email.trim()) {
      return res.status(400).json({
        error: 'Validation Error',
        message: 'Email is required for Google authentication.'
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    });

    if (!user) {
      // Create new user for Google Sign-In with auto-generated password hash
      const randomPass = Math.random().toString(36).substring(2) + 'Wander123!';
      const passwordHash = await bcrypt.hash(randomPass, 10);

      user = await prisma.user.create({
        data: {
          name: name ? name.trim() : normalizedEmail.split('@')[0],
          email: normalizedEmail,
          passwordHash,
          avatarUrl: avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'
        }
      });
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign({ userId: user.id }, secret, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Google login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        city: user.city,
        country: user.country,
        bio: user.bio,
        currency: user.currency
      }
    });
  } catch (error) {
    next(error);
  }
};

