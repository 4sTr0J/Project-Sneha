import api from './api';

export const authService = {
    async register(userData) {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    async verifyToken() {
        const token = localStorage.getItem('token');
        if (token === 'demo-token') {
            const saved = localStorage.getItem('user');
            try {
                return saved ? JSON.parse(saved) : { id: 'demo-user', name: 'Guest User', email: 'guest@example.com' };
            } catch {
                return { id: 'demo-user', name: 'Guest User', email: 'guest@example.com' };
            }
        }
        const response = await api.get('/auth/me');
        return response.data;
    },

    async updateProfile(userData) {
        const response = await api.put('/auth/profile', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};
