// src/services/api.ts

import axios from 'axios';
import type { Studio, Room, StudiosResponse, StudioDetailResponse, Filters } from '../types';

// Базовый URL API (замените на свой)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

// Создаем экземпляр axios с базовой конфигурацией
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем interceptor для добавления токена авторизации
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Добавляем interceptor для обработки ошибок
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login или обновить токен
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API методы для каталога студий
export const catalogAPI = {
  // Получить список студий с фильтрами
  getStudios: async (filters: Filters, page: number = 1, limit: number = 20): Promise<StudiosResponse> => {
    const params = new URLSearchParams();
    
    if (filters.city) params.append('city', filters.city);
    if (filters.min_price) params.append('min_price', filters.min_price);
    if (filters.max_price) params.append('max_price', filters.max_price);
    if (filters.room_type) params.append('room_type', filters.room_type);
    if (filters.search) params.append('search', filters.search);
    params.append('page', page.toString());
    params.append('limit', limit.toString());

    const response = await api.get<StudiosResponse>(`/studios?${params.toString()}`);
    return response.data;
  },

  // Получить детали студии
  getStudioById: async (id: number): Promise<StudioDetailResponse> => {
    const response = await api.get<StudioDetailResponse>(`/studios/${id}`);
    return response.data;
  },

  // Создать студию (только для владельцев)
  createStudio: async (studioData: Partial<Studio>): Promise<Studio> => {
    const response = await api.post<{ success: boolean; data: { studio: Studio } }>('/studios', studioData);
    return response.data.data.studio;
  },

  // Обновить студию
  updateStudio: async (id: number, studioData: Partial<Studio>): Promise<Studio> => {
    const response = await api.put<{ success: boolean; data: { studio: Studio } }>(`/studios/${id}`, studioData);
    return response.data.data.studio;
  },

  // Удалить студию (soft delete)
  deleteStudio: async (id: number): Promise<void> => {
    await api.delete(`/studios/${id}`);
  },

  // Добавить зал к студии
  addRoom: async (studioId: number, roomData: Partial<Room>): Promise<Room> => {
    const response = await api.post<{ success: boolean; data: { room: Room } }>(`/studios/${studioId}/rooms`, roomData);
    return response.data.data.room;
  },

  // Обновить зал
  updateRoom: async (roomId: number, roomData: Partial<Room>): Promise<Room> => {
    const response = await api.put<{ success: boolean; data: { room: Room } }>(`/rooms/${roomId}`, roomData);
    return response.data.data.room;
  },

  // Добавить оборудование к залу
  addEquipment: async (roomId: number, equipmentData: any): Promise<any> => {
    const response = await api.post(`/rooms/${roomId}/equipment`, equipmentData);
    return response.data.data;
  },
};

// Экспортируем инстанс axios для дополнительных запросов
export default api;