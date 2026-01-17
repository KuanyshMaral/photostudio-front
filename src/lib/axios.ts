<<<<<<< HEAD
import axios from 'axios';
import { toast } from 'react-hot-toast';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;

        if (!error.response) {
            // Ошибка сети
            toast.error('Ошибка подключения к серверу. Проверьте интернет.');
        } else if (status === 401) {
            // Unauthorized
            toast.error('Сессия истекла. Пожалуйста, войдите снова.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Опционально: window.location.href = '/login';
        } else if (status === 403) {
            toast.error('Доступ запрещён.');
        } else if (status >= 500) {
            toast.error('Что-то пошло не так на сервере.');
        }

        return Promise.reject(error);
    }
);
=======
import axios from 'axios';

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
