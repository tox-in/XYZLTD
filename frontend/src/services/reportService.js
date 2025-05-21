import api from './api';

export const reportService = {
    async getOutgoingCarsReport(startDate, endDate, page = 1, limit = 10) {
        const response = await api.get('/reports/outgoing-cars', {
            params: { startDate, endDate, page, limit }
        });
        return response.data;
    },

    async getEnteredCarsReport(startDate, endDate, page = 1, limit = 10) {
        const response = await api.get('/reports/entered-cars', {
            params: { startDate, endDate, page, limit }
        });
        return response.data;
    },

    async getParkingStatistics(parkingId, startDate, endDate) {
        const response = await api.get(`/reports/parking-statistics/${parkingId}`, {
            params: { startDate, endDate }
        });
        return response.data;
    }
}; 