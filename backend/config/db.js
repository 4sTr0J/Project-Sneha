const { Sequelize } = require('sequelize');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

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

module.exports = sequelize;
