const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { User, WellnessContent, Community } = require('../models');

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] },
            include: [
                { model: WellnessContent, as: 'favorites' },
                { model: Community, as: 'groups' }
            ]
        });

        res.json(user);
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

        const user = await User.findByPk(req.user.id);

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
