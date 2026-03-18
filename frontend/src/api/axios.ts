import axios from 'axios';

export const apiClient = axios.create({
    baseURL: '/api', // <-- غيره من http://localhost:2999 لـ /api
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptors زي ما هي...
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            const loginPage = localStorage.getItem('loginPage') || '/login';
            window.location.href = loginPage;
        }
        return Promise.reject(error);
    }
);