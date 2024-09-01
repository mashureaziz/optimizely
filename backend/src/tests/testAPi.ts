import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file in the root project folder
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const BASE_URL = 'http://localhost:4000/api'; // Adjust the base URL if necessary
const USER_ID = process.env.ADMIN_USER_ID; // Read Admin user ID from the .env file

const testApiEndpoints = async () => {
    try {
        // Check if USER_ID is defined
        if (!USER_ID) {
            throw new Error('ADMIN_USER_ID is not defined in the .env file');
        }

        // Test TV Series Endpoints
        console.log('Testing TV Series Endpoints...');
        
        // Create TV Series
        const newSeries = { title: 'Test TV Series', description: 'Test Description' };
        const createSeriesResponse = await axios.post(`${BASE_URL}/tvseries`, newSeries, {
            headers: { 'x-user-id': USER_ID }
        });
        console.log('Create TV Series Response:', createSeriesResponse.data);

        // Get TV Series
        const getSeriesResponse = await axios.get(`${BASE_URL}/tvseries`, {
            headers: { 'x-user-id': USER_ID }
        });
        console.log('Get TV Series Response:', getSeriesResponse.data);

        // Update TV Series
        const updatedSeries = { title: 'Updated TV Series', description: 'Updated Description' };
        const updateSeriesResponse = await axios.put(`${BASE_URL}/tvseries/${createSeriesResponse.data._id}`, updatedSeries, {
            headers: { 'x-user-id': USER_ID }
        });
        console.log('Update TV Series Response:', updateSeriesResponse.data);

        // Delete TV Series
        await axios.delete(`${BASE_URL}/tvseries/${createSeriesResponse.data._id}`, {
            headers: { 'x-user-id': USER_ID }
        });
        console.log('Deleted TV Series');

        // Test Season Endpoints
        console.log('Testing Season Endpoints...');
        
        // Create Season with userIds
        const newSeason = { title: 'Test Season', tvSeries: createSeriesResponse.data._id, userIds: [USER_ID] }; // Associate the admin user
        const createSeasonResponse = await axios.post(`${BASE_URL}/seasons`, newSeason, {
            headers: { 'x-user-id': USER_ID }
        });
        console.log('Create Season Response:', createSeasonResponse.data);

        // Get Seasons
        const getSeasonsResponse = await axios.get(`${BASE_URL}/seasons/${createSeriesResponse.data._id}`, {
            headers: { 'x-user-id': USER_ID }
        });
        console.log('Get Seasons Response:', getSeasonsResponse.data);

        // Update Season
        const updatedSeason = { title: 'Updated Season', userIds: [USER_ID] }; // Update userIds if needed
        const updateSeasonResponse = await axios.put(`${BASE_URL}/seasons/${createSeasonResponse.data._id}`, updatedSeason, {
            headers: { 'x-user-id': USER_ID }
        });
        console.log('Update Season Response:', updateSeasonResponse.data);

        // Delete Season
        await axios.delete(`${BASE_URL}/seasons/${createSeasonResponse.data._id}`, {
            headers: { 'x-user-id': USER_ID }
        });
        console.log('Deleted Season');

        // Test Episode Endpoints
        console.log('Testing Episode Endpoints...');
        
        // Create Episode
        const newEpisode = { title: 'Test Episode', season: createSeasonResponse.data._id };
        const createEpisodeResponse = await axios.post(`${BASE_URL}/episodes`, newEpisode, {
            headers: { 'x-user-id': USER_ID }
        });
        console.log('Create Episode Response:', createEpisodeResponse.data);

        // Get Episodes
        const getEpisodesResponse = await axios.get(`${BASE_URL}/episodes/${createSeasonResponse.data._id}`, {
            headers: { 'x-user-id': USER_ID }
        });
        console.log('Get Episodes Response:', getEpisodesResponse.data);

        // Update Episode
        const updatedEpisode = { title: 'Updated Episode' };
        const updateEpisodeResponse = await axios.put(`${BASE_URL}/episodes/${createEpisodeResponse.data._id}`, updatedEpisode, {
            headers: { 'x-user-id': USER_ID }
        });
        console.log('Update Episode Response:', updateEpisodeResponse.data);

        // Delete Episode
        await axios.delete(`${BASE_URL}/episodes/${createEpisodeResponse.data._id}`, {
            headers: { 'x-user-id': USER_ID }
        });
        console.log('Deleted Episode');

        // Test Payment Endpoints
        console.log('Testing Payment Endpoints...');
        
        // Create Payment
        const newPayment = { userId: USER_ID, season: createSeasonResponse.data._id, amount: 50 };
        const createPaymentResponse = await axios.post(`${BASE_URL}/payments`, newPayment, {
            headers: { 'x-user-id': USER_ID }
        });
        console.log('Create Payment Response:', createPaymentResponse.data);

        // Get Payments
        const getPaymentsResponse = await axios.get(`${BASE_URL}/payments`, {
            headers: { 'x-user-id': USER_ID }
        });
        console.log('Get Payments Response:', getPaymentsResponse.data);

        // Update Payment
        const updatedPayment = { amount: 75 };
        const updatePaymentResponse = await axios.put(`${BASE_URL}/payments/${createPaymentResponse.data._id}`, updatedPayment, {
            headers: { 'x-user-id': USER_ID }
        });
        console.log('Update Payment Response:', updatePaymentResponse.data);

        // Delete Payment
        await axios.delete(`${BASE_URL}/payments/${createPaymentResponse.data._id}`, {
            headers: { 'x-user-id': USER_ID }
        });
        console.log('Deleted Payment');

    } catch (error) {
        console.log(error);
        console.error('Error testing API:', (error as any).response ? (error as any).response.data : (error as any).message);
    }
};

testApiEndpoints();
