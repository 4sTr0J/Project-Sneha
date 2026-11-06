const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Community = sequelize.define('Community', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    illnessType: {
        type: DataTypes.STRING,
        allowNull: false
    },
    memberCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    imageUrl: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    isPrivate: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    timestamps: true
});

module.exports = Community;
