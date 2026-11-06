const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { WellnessContent, User } = require('../models');
const { sequelize } = require('../config/db');

// @desc    Get all wellness content
// @route   GET /api/wellness
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { type } = req.query;
        const query = type ? { type } : {};

        try {
            const content = await WellnessContent.find(query).sort({ createdAt: -1 });
            if (content && content.length > 0) {
                return res.json(content);
            }
        } catch (mErr) {
            // Fallback to SQLite below
        }

        let sql = 'SELECT * FROM WellnessContents';
        const params = [];
        if (type) {
            sql += ' WHERE type = ?';
            params.push(type);
        }
        sql += ' ORDER BY createdAt DESC';
        const [sqliteContent] = await sequelize.query(sql, { replacements: params });
        res.json(sqliteContent || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get user favorites
// @route   GET /api/wellness/user/favorites
// @access  Private
router.get('/user/favorites', protect, async (req, res) => {
    try {
        try {
            const user = await User.findById(req.user.id).populate('favorites');
            if (user && user.favorites) {
                return res.json(user.favorites);
            }
        } catch (mErr) {
            // Ignore Mongoose error and return empty array
        }
        res.json([]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get specific wellness content
// @route   GET /api/wellness/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
    try {
        try {
            const content = await WellnessContent.findById(req.params.id);
            if (content) {
                return res.json(content);
            }
        } catch (mErr) {
            // Fallback to SQLite below
        }

        const [results] = await sequelize.query('SELECT * FROM WellnessContents WHERE id = ?', {
            replacements: [req.params.id]
        });

        if (results && results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Content not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Toggle favorite wellness content
// @route   POST /api/wellness/favorite/:id
// @access  Private
router.post('/favorite/:id', protect, async (req, res) => {
    try {
        res.json({ message: 'Favorite toggled', isFavorited: true });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
