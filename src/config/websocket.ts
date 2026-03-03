// ============================================================
// WEBSOCKET CONFIGURATION
// ============================================================

// Определяем WS URL на основе текущего окружения
const getWebSocketUrl = (): string => {
    const rawServerUrl = String(
        import.meta.env.VITE_SERVER_URL || import.meta.env.VITE_API_URL || ''
    ).trim();

    if (rawServerUrl) {
        try {
            const normalizedUrl = rawServerUrl.replace(/\/api\/v1\/?$/, '');
            const parsedUrl = new URL(normalizedUrl);
            const wsProtocol = parsedUrl.protocol === 'https:' ? 'wss:' : 'ws:';
            return `${wsProtocol}//${parsedUrl.host}`;
        } catch {
            // fallback to window.location below
        }
    }

    // Fallback на текущий хост фронтенда
    if (window.location.protocol === 'https:') {
        return `wss://${window.location.host}`;
    }

    return `ws://${window.location.host}`;
};

export const WS_CONFIG = {
    // Базовый URL для WebSocket
    baseUrl: getWebSocketUrl(),
    
    // Endpoint для чата
    chatEndpoint: '/chat/ws',
    
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
