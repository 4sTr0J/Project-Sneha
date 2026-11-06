const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { Message, User } = require('../models');
const { Op } = require('sequelize');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini
console.log("Initializing Gemini with API Key:", process.env.GEMINI_API_KEY ? "Key Present" : "Key Missing");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// @desc    Get user conversations
// @route   GET /api/chat/conversations
// @access  Private
router.get('/conversations', protect, async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { sender: req.user.id },
                    { receiver: req.user.id }
                ]
            },
            include: [
                { model: User, as: 'senderUser', attributes: ['id', 'name', 'avatar'] },
                { model: User, as: 'receiverUser', attributes: ['id', 'name', 'avatar'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get messages for a conversation
// @route   GET /api/chat/messages/:conversationId
// @access  Private
router.get('/messages/:conversationId', protect, async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: {
                conversationId: req.params.conversationId
            },
            include: [
                { model: User, as: 'senderUser', attributes: ['id', 'name', 'avatar'] }
            ],
            order: [['createdAt', 'ASC']]
        });

        res.json(messages);
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
            isAI: false // User messages are never AI
        });

        const populatedMessage = await Message.findByPk(message.id, {
            include: [{ model: User, as: 'senderUser', attributes: ['id', 'name', 'avatar'] }]
        });

        // 2. Trigger AI Response if this is the AI Chat
        if (conversationId === 'ai-chat') {
            // We don't await this to avoid blocking the user's UI response?
            // Actually, for a better UX, we might want to await it if it's fast,
            // but for now let's do it asynchronously so the user sees their message sent immediately.
            // However, the frontend reloads after 1.5s. If Gemini takes 3s, the reload misses it.
            // Let's await it to be safe, so the frontend spinning state persists until it's done.

            // Helper function to generate content with fallback
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
                        // Continue to next model if available
                        if (modelName === modelsToTry[modelsToTry.length - 1]) throw error;
                    }
                }
            }

            try {
                // Context for Sneha
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
                // LOG THE ACTUAL ERROR TO THE SERVER CONSOLE
                console.error("Gemini API All Models Failed:", aiError);
                console.error("Gemini API Key Status:", process.env.GEMINI_API_KEY ? "Present" : "Missing");

                // Fallback message
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
        await Message.destroy({
            where: {
                conversationId: req.params.conversationId,
                [Op.or]: [
                    { sender: req.user.id } // Only delete messages sent by user (or we could allow clearing full convo view)
                    // Actually usually "clear chat" means clearing the history for the user. 
                    // Since it's a shared conversation technically (User <-> AI), we can just delete all messages where current user is involved if it were P2P.
                    // But for AI chat, we can just delete all messages with that conversationId for this user.
                    // The previous queries check sender/receiver. For AI chat, sender is user or AI (but AI doesn't have a user ID in the same way, or it does?)
                    // In the post route: sender: req.user.id. What about AI messages?
                    // AI messages: sender: req.user.id (Wait, looked at code: "sender: req.user.id" for AI messages too? 
                    // Line 100: sender: req.user.id. Yes. So all messages in this convo are 'sent' by the user technically or linked to them?
                    // Let's re-read the Post route carefully.

                    // Line 66: sender: req.user.id (User message)
                    // Line 100: sender: req.user.id (AI message)
                    // So YES, all messages in 'ai-chat' conversation for this user have sender = req.user.id.
                    // So we can just delete where conversationId = params and sender = req.user.id.
                ]
            }
        });

        res.json({ message: 'Chat history cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
