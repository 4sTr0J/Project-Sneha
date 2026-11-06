const express = require('express');
const dotenv = require('dotenv');
// Forced restart for model updates
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { sequelize, connectDB } = require('./config/db');

dotenv.config();
// Connect to MongoDB
connectDB();

const { User, WellnessContent, Community, Message, Music, Mood } = require('./models');

const port = process.env.PORT || 5000;

const app = express();

// Security Middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased for development
    message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// CORS configuration for frontend
app.use(cors({
    origin: [
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:5175',
        'http://localhost:5174',
        process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect to SQLite
sequelize.sync({ alter: true })
    .then(() => console.log('SQLite Database Synced'))
    .catch(err => {
        console.error('Database Sync Error:', err.message);
    });

// Root & API status endpoints
app.get('/', (req, res) => {
    res.json({
        status: 'online',
        service: 'Sneha Support Platform API',
        version: '1.0.0',
        frontendUrl: 'http://localhost:5173',
        endpoints: {
            auth: '/api/auth',
            profile: '/api/profile',
            wellness: '/api/wellness',
            community: '/api/community/groups',
            chat: '/api/chat/conversations',
            music: '/api/music',
            moods: '/api/moods'
        }
    });
});

app.get('/api', (req, res) => {
    res.json({
        status: 'online',
        message: 'Sneha API Root',
        endpoints: {
            auth: '/api/auth',
            profile: '/api/profile',
            wellness: '/api/wellness',
            community: '/api/community/groups',
            chat: '/api/chat/conversations',
            music: '/api/music',
            moods: '/api/moods'
        }
    });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/wellness', require('./routes/wellnessRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/music', require('./routes/musicRoutes'));
app.use('/api/moods', require('./routes/moodRoutes'));

// 404 Handler for undefined routes
app.use((req, res, next) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Cannot ${req.method} ${req.originalUrl}`,
        hint: req.originalUrl.startsWith('/api')
            ? 'Endpoint not found. Check available routes at /api'
            : 'For the frontend user interface, please open http://localhost:5173'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

app.listen(port, () => console.log(`Server started on port ${port}`));
