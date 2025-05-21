import axios from 'axios';
import { authService } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const userService = {
    async getAllUsers(page = 1, limit = 10) {
        const response = await axios.get(`${API_URL}/users?page=${page}&limit=${limit}`);
        return response.data;
    },

    async getUserById(id) {
        const response = await axios.get(`${API_URL}/users/${id}`);
        return response.data;
    },

    async updateUser(id, userData) {
        const response = await axios.put(`${API_URL}/users/${id}`, userData);
        return response.data;
    },

    async deleteUser(id) {
        const response = await axios.delete(`${API_URL}/users/${id}`);
        return response.data;
    },

    updateProfile: async (data) => {
        const response = await axios.put(
            `${API_URL}/users/profile`,
            data,
            { headers: authService.getAuthHeader() }
        );
        return response;
    },

    changePassword: async (data) => {
        const response = await axios.put(
            `${API_URL}/users/change-password`,
            data,
            { headers: authService.getAuthHeader() }
        );
        return response;
    },

    getProfile: async () => {
        const response = await axios.get(
            `${API_URL}/users/profile`,
            { headers: authService.getAuthHeader() }
        );
        return response;
    }
};

export { userService }; 