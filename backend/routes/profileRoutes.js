const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { User, WellnessContent, Community } = require('../models');
const { sequelize } = require('../config/db');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        try {
            const user = await User.findById(req.user.id)
                .select('-password')
                .populate('favorites')
                .populate('groups');

            if (user) {
                return res.json(user);
            }
        } catch (mErr) {
            // Fallback to SQLite
        }

        try {
            const [users] = await sequelize.query('SELECT id, name, email, supportType, avatar, bio, illnessType FROM Users WHERE id = ?', {
                replacements: [req.user.id]
            });
            if (users && users.length > 0) {
                return res.json({ ...users[0], favorites: [], groups: [] });
            }
        } catch (sqlErr) {
            // Ignore
        }

        res.json({
            id: req.user.id,
            name: req.user.name || 'User',
            email: req.user.email || 'user@example.com',
            supportType: 'Cancer Support',
            bio: 'Living each day with hope and strength.',
            illnessType: 'General Wellness',
            avatar: '',
            favorites: [],
            groups: []
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
router.put('/', protect, async (req, res) => {
    try {
        const { name, bio, illnessType, avatar } = req.body;

        const user = await User.findById(req.user.id);

        if (user) {
            user.name = name || user.name;
            user.bio = bio || user.bio;
            user.illnessType = illnessType || user.illnessType;
            user.avatar = avatar || user.avatar;

            await user.save();

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                illnessType: user.illnessType,
                avatar: user.avatar
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
