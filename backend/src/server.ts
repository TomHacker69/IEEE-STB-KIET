import dotenv from 'dotenv';
dotenv.config();

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import mongoose from 'mongoose';

import { connectDB } from './config/db';
import { initFirebase } from './config/firebase';
import { initCloudinary } from './config/cloudinary';

// Route imports
import authRoutes from './routes/auth.routes';
import rolesRoutes from './routes/roles.routes';
import contentRoutes from './routes/content.routes';
import sectionsRoutes from './routes/sections.routes';
import dignitariesRoutes from './routes/dignitaries.routes';
import membersRoutes from './routes/members.routes';
import eventsRoutes from './routes/events.routes';
import activitiesRoutes from './routes/activities.routes';
import researchRoutes from './routes/research.routes';
import socialRoutes from './routes/social.routes';
import sponsorsRoutes from './routes/sponsors.routes';
import recruitmentRoutes from './routes/recruitment.routes';
import certificatesRoutes from './routes/certificates.routes';
import devCornerRoutes from './routes/devCorner.routes';
import auditRoutes from './routes/audit.routes';
import uploadRoutes from './routes/upload.routes';

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize services
connectDB();
initFirebase();
initCloudinary();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
      // Allow requests with no origin (mobile apps, curl, etc.) or matching allowed origins
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
        callback(null, true);
      } else {
        callback(null, true); // Allow during development to prevent CORS lockouts
      }
    },
    credentials: true,
  })
);

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(morgan('dev'));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Serve uploaded media in local development mode
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Root & Health Check Endpoints
app.get(['/', '/api'], (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: '🚀 IEEE STB KIET Backend API is live & operational',
    version: '1.0.0',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      events: '/api/events',
      members: '/api/members',
      activities: '/api/activities',
      content: '/api/content',
      research: '/api/research',
      sections: '/api/sections',
      sponsors: '/api/sponsors',
      social: '/api/social',
      recruitment: '/api/recruitment',
    },
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    service: 'IEEE Student Branch REST API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/sections', sectionsRoutes);
app.use('/api/dignitaries', dignitariesRoutes);
app.use('/api/members', membersRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/activities', activitiesRoutes);
app.use('/api/research', researchRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/sponsors', sponsorsRoutes);
app.use('/api/recruitment', recruitmentRoutes);
app.use('/api/certificates', certificatesRoutes);
app.use('/api/dev-corner', devCornerRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/upload', uploadRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'An unexpected internal server error occurred',
    error: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
});

// 404 Route Catch-all
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `API endpoint ${req.method} ${req.originalUrl} not found`,
  });
});

app.listen(PORT, () => {
  console.log(`🚀 IEEE STB Backend Server running on http://localhost:${PORT}`);
});

export default app;

