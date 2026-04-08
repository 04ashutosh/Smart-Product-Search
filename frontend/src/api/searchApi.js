import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {'Content-Type':'application/json'}
});

export const searchProducts = async (query, categories = [], maxPrice = null, page = 0, size = 20) => {
    const params = { q: query, page, size };
    if (categories && categories.length > 0) {
        params.categories = categories.join(',');
    }
    if (maxPrice !== null && maxPrice > 0) {
        params.maxPrice = maxPrice;
    }
    const response = await apiClient.get('/search', { params });
    return response.data;
};

export const getAutoCompleteSuggestions = async (query) => {
    if (!query) return [];
    const response = await apiClient.get('/search/autocomplete', {params: {q: query}});
    return response.data;
};