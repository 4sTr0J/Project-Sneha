const { User } = require('./models');
const { connectDB } = require('./config/db');

async function checkUsers() {
    try {
        await connectDB();
        const users = await User.find({}, 'name email');
        console.log('Users in MongoDB:');
        console.log(JSON.stringify(users, null, 2));
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkUsers();
