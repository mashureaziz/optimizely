import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

const API_URL = 'http://localhost:4000/api'; // Adjust the base URL if necessary
const USER_ID = '66d35bdf839e4ea7537f99dc'

// Create an axios instance with default headers
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'x-user-id': USER_ID || '', // Set the x-user-id header
  },
});

export const fetchTVSeries = () => apiClient.get('/tvseries');
export const fetchSeasons = (tvSeriesId: string) => apiClient.get(`/seasons/${tvSeriesId}`);
export const fetchEpisodes = (seasonId: string) => apiClient.get(`/episodes/${seasonId}`);
export const fetchPayments = () => apiClient.get('/payments');

export const createTVSeries = (data: any) => apiClient.post('/tvseries', data);
export const updateTVSeries = (id: string, data: any) => apiClient.put(`/tvseries/${id}`, data);
export const deleteTVSeries = (id: string) => apiClient.delete(`/tvseries/${id}`);

export const createSeason = (data: any) => apiClient.post('/seasons', data);
export const updateSeason = (id: string, data: any) => apiClient.put(`/seasons/${id}`, data);
export const deleteSeason = (id: string) => apiClient.delete(`/seasons/${id}`);

export const createEpisode = (data: any) => apiClient.post('/episodes', data);
export const updateEpisode = (id: string, data: any) => apiClient.put(`/episodes/${id}`, data);
export const deleteEpisode = (id: string) => apiClient.delete(`/episodes/${id}`);

export const createPayment = (data: any) => apiClient.post('/payments', data);
export const updatePayment = (id: string, data: any) => apiClient.put(`/payments/${id}`, data);
export const deletePayment = (id: string) => apiClient.delete(`/payments/${id}`);
