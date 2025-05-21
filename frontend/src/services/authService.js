import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const authService = {
    login: async (email, password) => {
        return axios.post(`${API_URL}/auth/login`, { email, password });
    },

    signup: async (userData) => {
        return axios.post(`${API_URL}/auth/signup`, userData);
    },

    verifyToken: async (token) => {
        return axios.get(`${API_URL}/auth/verify`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    },

    getAuthHeader: () => {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    }
};

export { authService }; 