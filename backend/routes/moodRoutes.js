const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { Mood } = require('../models');

// @desc    Get user mood history
// @route   GET /api/moods
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const moods = await Mood.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.json(moods);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a new mood entry
// @route   POST /api/moods
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { mood, note, date, time, intensity, activities } = req.body;

        if (!mood || !date || !time) {
            return res.status(400).json({ message: 'Please provide mood, date, and time' });
        }

        const newMood = await Mood.create({
            userId: req.user.id,
            mood,
            note,
            date,
            time,
            intensity,
            activities
        });

        res.status(201).json(newMood);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Clear all mood history
// @route   DELETE /api/moods
// @access  Private
router.delete('/', protect, async (req, res) => {
    try {
        await Mood.destroy({
            where: { userId: req.user.id }
        });
        res.json({ message: 'Mood history cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
