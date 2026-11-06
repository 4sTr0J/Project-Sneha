const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { Message, User } = require('../models');
const { sequelize } = require('../config/db');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
console.log("Initializing Gemini with API Key:", process.env.GEMINI_API_KEY ? "Key Present" : "Key Missing");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Chat Service Root Info
// @route   GET /api/chat
// @access  Public
router.get('/', (req, res) => {
    res.json({
        service: 'Chat Service',
        status: 'online',
        endpoints: {
            conversations: 'GET /api/chat/conversations',
            messages: 'GET /api/chat/messages/:conversationId',
            sendMessage: 'POST /api/chat/messages',
            clearMessages: 'DELETE /api/chat/messages/:conversationId'
        }
    });
});

// @desc    Get user conversations
// @route   GET /api/chat/conversations
// @access  Private
router.get('/conversations', protect, async (req, res) => {
    try {
        try {
            const messages = await Message.find({
                $or: [
                    { sender: req.user.id },
                    { receiver: req.user.id }
                ]
            })
                .populate('sender', 'name avatar')
                .populate('receiver', 'name avatar')
                .sort({ createdAt: -1 });

            if (messages) return res.json(messages);
        } catch (mErr) {
            // Fallback below
        }

        try {
            const [sqliteMessages] = await sequelize.query('SELECT * FROM Messages ORDER BY createdAt DESC');
            return res.json(sqliteMessages || []);
        } catch (sqlErr) {
            return res.json([]);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get messages for a conversation
// @route   GET /api/chat/messages/:conversationId
// @access  Private
router.get('/messages/:conversationId', protect, async (req, res) => {
    try {
        try {
            const messages = await Message.find({
                conversationId: req.params.conversationId
            })
                .populate('sender', 'name avatar')
                .sort({ createdAt: 1 });

            if (messages) return res.json(messages);
        } catch (mErr) {
            // Fallback below
        }

        try {
            const [sqliteMessages] = await sequelize.query('SELECT * FROM Messages WHERE conversationId = ? ORDER BY createdAt ASC', {
                replacements: [req.params.conversationId]
            });
            return res.json(sqliteMessages || []);
        } catch (sqlErr) {
            return res.json([]);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Send a message
// @route   POST /api/chat/messages
// @access  Private
router.post('/messages', protect, async (req, res) => {
    try {
        const { conversationId, content } = req.body;

        // 1. Save User Message
        const message = await Message.create({
            sender: req.user.id,
            conversationId,
            content,
            isAI: false
        });

        const populatedMessage = await Message.findById(message.id)
            .populate('sender', 'name avatar');

        // 2. Trigger AI Response if this is the AI Chat
        if (conversationId === 'ai-chat') {
            async function generateWithFallback(promptText) {
                const modelsToTry = ["gemini-1.5-flash", "gemini-pro"];
                for (const modelName of modelsToTry) {
                    try {
                        console.log(`Attempting to generate with model: ${modelName}`);
                        const model = genAI.getGenerativeModel({ model: modelName });
                        const result = await model.generateContent(promptText);
                        const response = await result.response;
                        return response.text();
                    } catch (error) {
                        console.warn(`Failed with model ${modelName}:`, error.message);
                        if (modelName === modelsToTry[modelsToTry.length - 1]) throw error;
                    }
                }
            }

            try {
                const prompt = `You are Sneha, a compassionate and empathetic wellness companion designed to support users with chronic illnesses like cancer. 
                Your tone is warm, gentle, and encouraging. You provide emotional support, mindfulness tips, and a listening ear. 
                Avoid giving medical advice. Keep responses concise and conversational.
                
                User: ${content}`;

                const text = await generateWithFallback(prompt);

                // 3. Save AI Response
                await Message.create({
                    sender: req.user.id,
                    conversationId,
                    content: text,
                    isAI: true
                });

            } catch (aiError) {
                console.error("Gemini API All Models Failed:", aiError);
                await Message.create({
                    sender: req.user.id,
                    conversationId,
                    content: "I'm having a little trouble connecting right now, but I'm here with you. Please try again in a moment.",
                    isAI: true
                });
            }
        }

        res.status(201).json(populatedMessage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Clear messages for a conversation
// @route   DELETE /api/chat/messages/:conversationId
// @access  Private
router.delete('/messages/:conversationId', protect, async (req, res) => {
    try {
        await Message.deleteMany({
            conversationId: req.params.conversationId,
            sender: req.user.id
        });

        res.json({ message: 'Chat history cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
