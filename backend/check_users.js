const { User } = require('./models');
const sequelize = require('./config/db');

async function checkUsers() {
    try {
        await sequelize.authenticate();
        const users = await User.findAll({ attributes: ['id', 'name', 'email'] });
        console.log('Users in database:');
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUsers();
