import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9090';

// Create axios instance with credentials enabled for cookie-based auth
const api = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // This ensures cookies are sent with every request
    headers: {
        'Content-Type': 'application/json',
    },
});

// Auth API functions
export const authApi = {
    getCurrentUser: () => api.get('/api/v1/auth/me'),
    logout: () => api.post('/api/v1/auth/logout'),
};

// Item API functions
export const itemApi = {
    getById: (itemId: string | number) => api.get(`/api/v1/item/${itemId}`),
    search: (query: string, page = 0, size = 10) =>
        api.get('/api/v1/item/search', { params: { query, page, size } }),
    getAllActive: () => api.get('/api/v1/item/getAllActiveListings'),
    getByCategory: (category: string) =>
        api.get('/api/v1/item/getAllListingsByCategory', { params: { category } }),
    getRecentlyViewed: () => api.get('/api/v1/item/getRecentlyViewed'),
    getHistory: () => api.get('/api/v1/item/getHistory'),
    createListing: (data: unknown) => api.post('/api/v1/item/createListing', data),
    deleteListing: (itemId: number) =>
        api.delete('/api/v1/item/deleteListing', { params: { itemId } }),
    decrementWatchers: (itemId: number) =>
        api.post(`/api/v1/item/decrementWatchers/${itemId}`),
};

// Cart API functions
export const cartApi = {
    add: (itemId: number, quantity: number) =>
        api.post('/api/v1/cart/add', null, { params: { itemId, quantity } }),
    get: () => api.get('/api/v1/cart'),
    remove: (itemId: number) =>
        api.delete('/api/v1/cart/remove', { params: { itemId } }),
    clear: () => api.delete('/api/v1/cart/clear'),
};

// Saved listings API functions
export const savedApi = {
    check: (itemId: number) =>
        api.get('/api/v1/saved/check', { params: { itemId } }),
    save: (itemId: number) =>
        api.post('/api/v1/saved/save', null, { params: { itemId } }),
    unsave: (itemId: number) =>
        api.delete('/api/v1/saved/unsave', { params: { itemId } }),
    getAll: () => api.get('/api/v1/saved'),
};

// User API functions
export const userApi = {
    getDashboardStats: () => api.get('/api/v1/user/dashboardstats'),
};

export default api;
