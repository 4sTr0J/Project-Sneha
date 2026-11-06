const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    supportType: {
        type: DataTypes.ENUM('Cancer Support', 'Chronic Illness', 'Caregiver Support'),
        allowNull: true
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    bio: {
        type: DataTypes.STRING,
        defaultValue: ''
    },
    illnessType: {
        type: DataTypes.STRING,
        defaultValue: ''
    }
}, {
    timestamps: true
});

module.exports = User;
