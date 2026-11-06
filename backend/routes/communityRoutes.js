const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { Community, User } = require('../models');

// @desc    Get all support groups
// @route   GET /api/community/groups
// @access  Private
router.get('/groups', protect, async (req, res) => {
    try {
        const groups = await Community.findAll({
            order: [['memberCount', 'DESC']]
        });
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get specific group
// @route   GET /api/community/groups/:id
// @access  Private
router.get('/groups/:id', protect, async (req, res) => {
    try {
        const group = await Community.findByPk(req.params.id, {
            include: [{ model: User, as: 'members', attributes: ['id', 'name', 'avatar'] }]
        });

        if (group) {
            res.json(group);
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
        const group = await Community.findByPk(req.params.id);
        const user = await User.findByPk(req.user.id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const isMember = await group.hasMember(user);

        if (isMember) {
            // Leave group
            await group.removeMember(user);
        } else {
            // Join group
            await group.addMember(user);
        }

        // Update member count manually as memberCount is a field
        const members = await group.getMembers();
        group.memberCount = members.length;
        await group.save();

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
        const group = await Community.findByPk(req.params.id);

        if (group) {
            const members = await group.getMembers({
                attributes: ['id', 'name', 'avatar', 'illnessType']
            });
            res.json(members);
        } else {
            res.status(404).json({ message: 'Group not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
