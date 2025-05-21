import axios from 'axios';
import { authService } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const parkingService = {
    getAllParkings: async (page = 1, limit = 10) => {
        return axios.get(`${API_URL}/parkings`, {
            headers: authService.getAuthHeader(),
            params: { page, limit }
        });
    },

    getParkingById: async (id) => {
        return axios.get(`${API_URL}/parkings/${id}`, {
            headers: authService.getAuthHeader()
        });
    },

    createParking: async (parkingData) => {
        return axios.post(`${API_URL}/parkings`, parkingData, {
            headers: authService.getAuthHeader()
        });
    },

    updateParking: async (id, parkingData) => {
        return axios.put(`${API_URL}/parkings/${id}`, parkingData, {
            headers: authService.getAuthHeader()
        });
    },

    deleteParking: async (id) => {
        return axios.delete(`${API_URL}/parkings/${id}`, {
            headers: authService.getAuthHeader()
        });
    },

    getAvailableSpaces: async (id) => {
        return axios.get(`${API_URL}/parkings/${id}/spaces`, {
            headers: authService.getAuthHeader()
        });
    },

    updateAvailableSpaces: async (id, spaces) => {
        return axios.put(`${API_URL}/parkings/${id}/spaces`, { spaces }, {
            headers: authService.getAuthHeader()
        });
    }
};

export { parkingService }; 