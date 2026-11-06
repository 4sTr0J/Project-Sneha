const sequelize = require('./config/db');
const models = require('./models');

async function syncDB() {
    try {
        console.log('Starting sync...');
        await sequelize.sync({ alter: true });
        console.log('Sync successful');
    } catch (error) {
        console.error('FULL ERROR:', error);
        if (error.errors) {
            console.error('DETAILED ERRORS:', error.errors);
        }
    } finally {
        await sequelize.close();
    }
}

syncDB();
