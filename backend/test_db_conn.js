const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function testConn() {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected successfully');
        process.exit(0);
    } catch (err) {
        console.error('Connection failed:');
        console.error(err);
        process.exit(1);
    }
}

testConn();
