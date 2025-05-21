import axios from 'axios';
import { authService } from './authService';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

const carEntryService = {
    getAllEntries: async (page = 1, limit = 10) => {
        return axios.get(`${API_URL}/car-entries`, {
            headers: authService.getAuthHeader(),
            params: { page, limit }
        });
    },

    getEntryById: async (id) => {
        return axios.get(`${API_URL}/car-entries/${id}`, {
            headers: authService.getAuthHeader()
        });
    },

    createEntry: async (entryData) => {
        return axios.post(`${API_URL}/car-entries`, entryData, {
            headers: authService.getAuthHeader()
        });
    },

    processExit: async (id, exitData) => {
        return axios.put(`${API_URL}/car-entries/${id}/exit`, exitData, {
            headers: authService.getAuthHeader()
        });
    },

    getActiveEntries: async (page = 1, limit = 10) => {
        return axios.get(`${API_URL}/car-entries/active`, {
            headers: authService.getAuthHeader(),
            params: { page, limit }
        });
    },

    getEntriesByDateRange: async (startDate, endDate, page = 1, limit = 10) => {
        return axios.get(`${API_URL}/car-entries/report`, {
            headers: authService.getAuthHeader(),
            params: { startDate, endDate, page, limit }
        });
    },

    generateTicket: async (id) => {
        return axios.get(`${API_URL}/car-entries/${id}/ticket`, {
            headers: authService.getAuthHeader(),
            responseType: 'blob'
        });
    },

    generateBill: async (id) => {
        return axios.get(`${API_URL}/car-entries/${id}/bill`, {
            headers: authService.getAuthHeader(),
            responseType: 'blob'
        });
    }
};

export { carEntryService }; 