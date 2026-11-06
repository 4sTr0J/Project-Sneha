const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Music = sequelize.define('Music', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    artist: {
        type: DataTypes.STRING,
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    url: {
        type: DataTypes.STRING,
        allowNull: false
    },
    duration: {
        type: DataTypes.STRING,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true
});

module.exports = Music;
