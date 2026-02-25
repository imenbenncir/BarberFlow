const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/barberflow';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('--- DATABASE DIAGNOSTIC ---');
        const db = mongoose.connection.db;
        const users = await db.collection('users').find({}).toArray();
        console.log(`Found ${users.length} users:`);
        users.forEach(u => {
            console.log(`- Email: "${u.email}" (ID: ${u._id})`);
        });
        console.log('---------------------------');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
