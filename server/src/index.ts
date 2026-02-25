import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';
import serviceRoutes from './routes/serviceRoutes';
import appointmentRoutes from './routes/appointmentRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import subscriptionRoutes from './routes/subscriptionRoutes';
import clientRoutes from './routes/clientRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5099;

// CORS — allow both local dev and Vercel production
const allowedOrigins = [
    'http://localhost:5173',
    process.env.CLIENT_URL,
].filter(Boolean) as string[];

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (e.g. mobile, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
            return callback(null, true);
        }
        callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
}));

app.use(morgan('dev'));

// Routes that need special body parsing (Stripe Webhook)
app.use('/api/billing', subscriptionRoutes);

// Global JSON parsing for other routes
app.use(express.json());

// Main Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/clients', clientRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'BarberFlow API is running' });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({
        message: err.message || 'Internal Server Error',
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Database connection helper (cached for serverless reuse)
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/barberflow';

let isConnected = false;

export const connectDB = async () => {
    if (isConnected) return;
    await mongoose.connect(MONGODB_URI);
    isConnected = true;
    console.log('Connected to MongoDB');
};

// In serverless mode (Vercel), just export app — Vercel handles the lifecycle.
// In local dev, connect to DB and start listening.
if (!process.env.VERCEL) {
    connectDB()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server running on port ${PORT}`);
            });
        })
        .catch((error) => {
            console.error('MongoDB connection error:', error);
        });
}

export default app;
