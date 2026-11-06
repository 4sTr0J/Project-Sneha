const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const WellnessContent = sequelize.define('WellnessContent', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('meditation', 'music', 'breathing', 'affirmation', 'video'),
        allowNull: false
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: true
    },
    audioUrl: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    imageUrl: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    category: {
        type: DataTypes.STRING,
        defaultValue: 'general'
    },
    tags: {
        type: DataTypes.TEXT, // Store as JSON string in SQLite
        defaultValue: '[]'
    }
}, {
    timestamps: true
});

module.exports = WellnessContent;
