// ============================================================
// WEBSOCKET CONFIGURATION
// ============================================================

// Определяем WS URL на основе текущего окружения
const getWebSocketUrl = (): string => {
    // В production используем wss://
    if (window.location.protocol === 'https:') {
        return `wss://${window.location.host}`;
    }
    
    // В development — ws:// на тот же порт что API
    // Vite proxy перенаправит на backend
    return `ws://${window.location.host}`;
};

export const WS_CONFIG = {
    // Базовый URL для WebSocket
    baseUrl: getWebSocketUrl(),
    
    // Endpoint для чата
    chatEndpoint: '/ws/chat',
    
    // Интервал переподключения (ms)
    reconnectInterval: 3000,
    
    // Максимум попыток переподключения
    maxReconnectAttempts: 10,
    
    // Интервал ping (ms)
    pingInterval: 30000,
};

// Полный URL для подключения
export const getChatWebSocketUrl = (token: string): string => {
    return `${WS_CONFIG.baseUrl}${WS_CONFIG.chatEndpoint}?token=${token}`;
};
