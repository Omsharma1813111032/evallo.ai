import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

export const fetchLogs = async (filters) => {
    const params = new URLSearchParams(filters);
    const response = await axios.get(`${BASE_URL}/logs?${params.toString()}`);
    return response.data;
};
