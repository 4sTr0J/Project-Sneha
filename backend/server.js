const express = require('express');
const dotenv = require('dotenv');
// Forced restart for model updates
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const sequelize = require('./config/db');

dotenv.config();

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

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/wellness', require('./routes/wellnessRoutes'));
app.use('/api/community', require('./routes/communityRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));
app.use('/api/music', require('./routes/musicRoutes'));
app.use('/api/moods', require('./routes/moodRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

app.listen(port, () => console.log(`Server started on port ${port}`));
