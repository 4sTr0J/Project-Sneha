const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

mongoose.set('bufferCommands', false);
mongoose.set('bufferTimeoutMS', 3000);

// MongoDB Connection
const connectDB = async () => {
    try {
        if (process.env.MONGODB_URI) {
            const conn = await mongoose.connect(process.env.MONGODB_URI);
            console.log(`MongoDB Connected: ${conn.connection.host}`);
            return conn;
        }
    } catch (error) {
        console.error('CRITICAL ERROR: MongoDB connection failed!');
        console.error('Error name:', error.name);
        console.error('Error message:', error.message);
        if (error.reason) console.error('Error reason:', error.reason);
        // throw error; // Commented out to prevent server crash
    }
};

// Keep Sequelize for now to avoid breaking existing code immediately
const sequelize = process.env.DATABASE_URL
    ? new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        },
        logging: false
    })
    : new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, '..', process.env.DB_FILE || 'database.sqlite'),
        logging: false
    });

module.exports = { sequelize, connectDB };
