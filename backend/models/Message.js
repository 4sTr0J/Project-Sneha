const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    conversationId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    isRead: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    isAI: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

module.exports = Message;
