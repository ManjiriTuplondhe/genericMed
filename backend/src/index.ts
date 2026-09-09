import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import medicinesRouter from './routes/medicines';
import offersRouter from './routes/offers';
import cartRouter from './routes/cart';
import ordersRouter from './routes/orders';
import partnerRouter from './routes/partner';
import adminRouter from './routes/admin';
import devRouter from './routes/dev';
import aiRouter from './routes/ai';
import authRouter from './routes/auth';
import { paymentsRouter } from './routes/payments';
import { prescriptionsRouter } from './routes/prescriptions';
import { notificationsRouter } from './routes/notifications';
import { insuranceRouter } from './routes/insurance';
import marketplaceRouter from './routes/marketplace';
import regionsRouter from './routes/regions';
import fraudRouter from './routes/fraud';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Core Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Request logging middleware
app.use((req, _res, next) => {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'HEALTHY',
    service: 'genericMed-backend',
    version: '0.4.0',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime())
  });
});

// API Routes Mounting
app.use('/api/medicines', medicinesRouter);
app.use('/api/medicines', offersRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/partner', partnerRouter);
app.use('/api/admin', adminRouter);
app.use('/api/dev', devRouter);
app.use('/api/ai', aiRouter);
app.use('/api/auth', authRouter);
app.use('/api/payments', paymentsRouter);
app.use('/api/prescriptions', prescriptionsRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/insurance', insuranceRouter);
app.use('/api/marketplace', marketplaceRouter);
app.use('/api/regions', regionsRouter);
app.use('/api/fraud', fraudRouter);

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  logger.info(`genericMed REST API Server listening at http://localhost:${PORT}`);
});

export default app;
