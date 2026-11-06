const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { Community, User } = require('../models');
const { sequelize } = require('../config/db');

// @desc    Community root
// @route   GET /api/community
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const [groups] = await sequelize.query('SELECT * FROM Communities ORDER BY memberCount DESC');
        res.json(groups || []);
    } catch (e) {
        res.json([]);
    }
});

// @desc    Get all support groups
// @route   GET /api/community/groups
// @access  Private
router.get('/groups', protect, async (req, res) => {
    try {
        try {
            const groups = await Community.find().sort({ memberCount: -1 });
            if (groups && groups.length > 0) {
                return res.json(groups);
            }
        } catch (mErr) {
            // Fallback to SQLite
        }

        const [groups] = await sequelize.query('SELECT * FROM Communities ORDER BY memberCount DESC');
        res.json(groups || []);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get specific group
// @route   GET /api/community/groups/:id
// @access  Private
router.get('/groups/:id', protect, async (req, res) => {
    try {
        try {
            const group = await Community.findById(req.params.id).populate('members', 'name avatar');
            if (group) {
                return res.json(group);
            }
        } catch (mErr) {
            // Fallback to SQLite
        }

        const [results] = await sequelize.query('SELECT * FROM Communities WHERE id = ?', {
            replacements: [req.params.id]
        });

        if (results && results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Group not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Join a support group
// @route   POST /api/community/groups/:id/join
// @access  Private
router.post('/groups/:id/join', protect, async (req, res) => {
    try {
        const group = await Community.findById(req.params.id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const isMember = group.members.includes(req.user.id);
        const user = await User.findById(req.user.id);

        if (isMember) {
            // Leave group
            group.members = group.members.filter(id => id.toString() !== req.user.id.toString());
            user.groups = user.groups.filter(id => id.toString() !== group.id.toString());
        } else {
            // Join group
            group.members.push(req.user.id);
            user.groups.push(group.id);
        }

        group.memberCount = group.members.length;
        await group.save();
        await user.save();

        res.json({
            group,
            isMember: !isMember
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get group members
// @route   GET /api/community/groups/:id/members
// @access  Private
router.get('/groups/:id/members', protect, async (req, res) => {
    try {
        const group = await Community.findById(req.params.id).populate('members', 'name avatar illnessType');

        if (group) {
            res.json(group.members);
        } else {
            res.status(404).json({ message: 'Group not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
