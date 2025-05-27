import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import subscriptionRouter from './routes/subscription.route.js';
import errorMiddleware from './middleware/error.middleware.js';
import connectToDB from './database/mongodb.js';

const app = express();

// Use the PORT provided by Render or fallback to 5000 for local dev
const PORT = process.env.PORT || 5000;

// Middleware
// Middleware

// TODO: Restrict CORS origins before production
app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/subscriptions', subscriptionRouter);

// Health Check Route
app.get('/', (req, res) => {
  res.status(200).send('Server is up and running 🚀');
});

// Error handling
app.use(errorMiddleware);

// Start server
app.listen(PORT, async () => {
  try {
    await connectToDB();
    console.log(`✅ [server] Connected to database`);
    console.log(`🚀 [server] Running on port ${PORT}`);
  } catch (error) {
    console.error('❌ [server] DB connection failed:', error.message);
    process.exit(1);
  }
});
