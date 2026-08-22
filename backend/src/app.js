import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import tripRoutes from './routes/trip.routes.js';
import cityRoutes from './routes/city.routes.js';
import activityRoutes from './routes/activity.routes.js';
import { errorMiddleware } from './middleware/error.middleware.js';

dotenv.config();

const app = express();

// Configure CORS
const allowedOrigin = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({
  origin: [allowedOrigin, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'GlobeTrotter backend is running'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/activities', activityRoutes);

// Error middleware
app.use(errorMiddleware);

export default app;
