const express = require('express');
const router = express.Router();
const { Music } = require('../models');
const { protect } = require('../middleware/authMiddleware');

// @desc    Get all music/wellness content
// @route   GET /api/music
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const music = await Music.findAll({});
        res.json(music);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Seed initial music data (Dev only)
// @route   POST /api/music/seed
// @access  Public (for simplicity in this phase)
router.post('/seed', async (req, res) => {
    try {
        await Music.destroy({ where: {}, truncate: true });

        const sampleMusic = [
            {
                title: "Healing Frequencies",
                artist: "Nature Sounds",
                category: "Relaxation",
                url: "#",
                duration: "10:00",
                imageUrl: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80&w=1000"
            },
            {
                title: "Mindful Breathing",
                artist: "Wellness Coach",
                category: "Meditation",
                url: "#",
                duration: "15:30",
                imageUrl: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=1000"
            },
            {
                title: "Deep Sleep Waves",
                artist: "Sleep Expert",
                category: "Sleep",
                url: "#",
                duration: "30:00",
                imageUrl: "https://images.unsplash.com/photo-1511296933631-18b1c0008b1b?auto=format&fit=crop&q=80&w=1000"
            }
        ];

        const createdMusic = await Music.bulkCreate(sampleMusic);
        res.json(createdMusic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
