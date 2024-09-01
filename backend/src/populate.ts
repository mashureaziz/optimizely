import mongoose from 'mongoose';
import { TVSeries } from './models/TVSeries';
import { Season } from './models/Season';
import { Episode } from './models/Episode';
import { Payment } from './models/Payment';
import { User } from './models/User';
import fs from 'fs';
import path from 'path';

const populateDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/tvshows', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Clear existing data
        await TVSeries.deleteMany({});
        await Season.deleteMany({});
        await Episode.deleteMany({});
        await Payment.deleteMany({});
        await User.deleteMany({});

        // Create dummy users
        const users = await User.insertMany([
            { username: 'user1', password: 'password1', role: 'user' },
            { username: 'user2', password: 'password2', role: 'user' },
            { username: 'admin', password: 'adminpass', role: 'admin' },
        ]);

        // Create dummy TV series
        const tvSeries = await TVSeries.insertMany([
            { title: 'TV Series 1', description: 'Description for TV Series 1' },
            { title: 'TV Series 2', description: 'Description for TV Series 2' },
            { title: 'TV Series 3', description: 'Description for TV Series 3' },
            { title: 'TV Series 4', description: 'Description for TV Series 4' },
            { title: 'TV Series 5', description: 'Description for TV Series 5' },
        ]);

        // Create dummy seasons with associated user IDs
        const seasons = await Season.insertMany([
            { title: 'Season 1', tvSeries: tvSeries[0]._id, userIds: [users[0]._id, users[1]._id] }, // user1 and user2 have access
            { title: 'Season 2', tvSeries: tvSeries[0]._id, userIds: [users[1]._id] }, // user2 has access
            { title: 'Season 3', tvSeries: tvSeries[1]._id, userIds: [users[0]._id] }, // user1 has access
            { title: 'Season 4', tvSeries: tvSeries[2]._id, userIds: [users[0]._id, users[2]._id] }, // user1 and admin have access
            { title: 'Season 5', tvSeries: tvSeries[3]._id, userIds: [users[1]._id] }, // user2 has access
            { title: 'Season 6', tvSeries: tvSeries[4]._id, userIds: [users[0]._id, users[1]._id, users[2]._id] }, // all users have access
        ]);

        // Create dummy episodes
        const episodes = await Episode.insertMany([
            { title: 'Episode 1', season: seasons[0]._id },
            { title: 'Episode 2', season: seasons[0]._id },
            { title: 'Episode 1', season: seasons[1]._id },
            { title: 'Episode 1', season: seasons[2]._id },
            { title: 'Episode 1', season: seasons[3]._id },
            { title: 'Episode 1', season: seasons[4]._id },
            { title: 'Episode 2', season: seasons[4]._id },
            { title: 'Episode 3', season: seasons[4]._id },
        ]);

        // Create dummy payments
        await Payment.insertMany([
            { userId: users[0]._id.toString(), season: seasons[0]._id, amount: 10, date: new Date() },
            { userId: users[1]._id.toString(), season: seasons[1]._id, amount: 15, date: new Date() },
            { userId: users[0]._id.toString(), season: seasons[2]._id, amount: 20, date: new Date() },
            { userId: users[1]._id.toString(), season: seasons[3]._id, amount: 25, date: new Date() },
            { userId: users[2]._id.toString(), season: seasons[4]._id, amount: 30, date: new Date() },
        ]);

        console.log('Database populated with dummy data successfully!');

        // Find the admin user
        const adminUser = users.find(user => user.role === 'admin');

        if (adminUser) {
            // Prepare the user ID for the .env file
            const adminUserId = `ADMIN_USER_ID=${adminUser._id}`;

            // Write the admin user ID to the .env file in root folder
            const envFilePath = path.join(__dirname, '../../.env');
            fs.writeFileSync(envFilePath, adminUserId, { flag: 'w' });

            console.log('Admin user ID written to .env file successfully!');
        } else {
            console.log('Admin user not found.');
        }

    } catch (error) {
        console.error('Error populating database:', error);
    } finally {
        // Close the connection
        await mongoose.connection.close();
    }
};

populateDatabase();
