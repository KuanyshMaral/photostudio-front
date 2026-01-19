import { useEffect, useRef, useState, useCallback } from 'react';
import { getChatWebSocketUrl, WS_CONFIG } from '../../config/websocket';
import type { 
    Message, 
    WSServerMessage, 
    WSNewMessageEvent,
    WSTypingEvent,
    WSReadEvent,
} from './chat.types';

// ============================================================
// TYPES
// ============================================================

export interface UseChatOptions {
    token: string | null;
    onNewMessage?: (conversationId: number, message: Message) => void;
    onTyping?: (conversationId: number, userId: number, isTyping: boolean) => void;
    onRead?: (conversationId: number, userId: number) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
}

export interface UseChatReturn {
    isConnected: boolean;
    sendMessage: (conversationId: number, content: string) => void;
    sendTyping: (conversationId: number, isTyping: boolean) => void;
    markAsRead: (conversationId: number) => void;
}

// ============================================================
// HOOK
// ============================================================

export function useChat(options: UseChatOptions): UseChatReturn {
    const {
        token,
        onNewMessage,
        onTyping,
        onRead,
        onConnect,
        onDisconnect,
    } = options;
    
    // State
    const [isConnected, setIsConnected] = useState(false);
    
    // Refs
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<number | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const pingIntervalRef = useRef<number | null>(null);
    
    // ========================================================
    // CONNECT
    // ========================================================
    
    const connect = useCallback(() => {
        if (!token) return;
        
        // Закрываем существующее соединение
        if (wsRef.current) {
            wsRef.current.close();
        }
        
        const url = getChatWebSocketUrl(token);
        console.log('[WS] Connecting to:', url);
        
        const ws = new WebSocket(url);
        wsRef.current = ws;
        
        // =====================
        // ON OPEN
        // =====================
        ws.onopen = () => {
            console.log('[WS] Connected');
            setIsConnected(true);
            reconnectAttemptsRef.current = 0;
            onConnect?.();
            
            // Запускаем ping
            pingIntervalRef.current = window.setInterval(() => {
                if (ws.readyState === WebSocket.OPEN) {
                    ws.send(JSON.stringify({ type: 'ping' }));
                }
            }, WS_CONFIG.pingInterval);
        };
        
        // =====================
        // ON MESSAGE
        // =====================
        ws.onmessage = (event) => {
            try {
                const data: WSServerMessage = JSON.parse(event.data);
                handleMessage(data);
            } catch (error) {
                console.error('[WS] Failed to parse message:', error);
            }
        };
        
        // =====================
        // ON CLOSE
        // =====================
        ws.onclose = (event) => {
            console.log('[WS] Disconnected:', event.code, event.reason);
            setIsConnected(false);
            onDisconnect?.();
            
            // Останавливаем ping
            if (pingIntervalRef.current) {
                window.clearInterval(pingIntervalRef.current);
            }
            
            // Переподключаемся если это не намеренное закрытие
            if (event.code !== 1000 && event.code !== 1001) {
                scheduleReconnect();
            }
        };
        
        // =====================
        // ON ERROR
        // =====================
        ws.onerror = (error) => {
            console.error('[WS] Error:', error);
        };
        
    }, [token, onConnect, onDisconnect]);
    
    // ========================================================
    // MESSAGE HANDLER
    // ========================================================
    
    const handleMessage = useCallback((data: WSServerMessage) => {
        switch (data.type) {
            case 'new_message': {
                const event = data as WSNewMessageEvent;
                console.log('[WS] New message:', event.message.id);
                onNewMessage?.(event.conversation_id, event.message);
                break;
            }
            
            case 'typing': {
                const event = data as WSTypingEvent;
                onTyping?.(event.conversation_id, event.user_id, event.is_typing);
                break;
            }
            
            case 'read': {
                const event = data as WSReadEvent;
                onRead?.(event.conversation_id, event.user_id);
                break;
            }
            
            case 'pong':
                // Keep-alive response, ignore
                break;
            
            case 'error':
                console.error('[WS] Server error:', data);
                break;
            
            default:
                console.warn('[WS] Unknown message type:', data);
        }
    }, [onNewMessage, onTyping, onRead]);
    
    // ========================================================
    // RECONNECT
    // ========================================================
    
    const scheduleReconnect = useCallback(() => {
        if (reconnectAttemptsRef.current >= WS_CONFIG.maxReconnectAttempts) {
            console.error('[WS] Max reconnect attempts reached');
            return;
        }
        
        reconnectAttemptsRef.current += 1;
        console.log(`[WS] Reconnecting in ${WS_CONFIG.reconnectInterval}ms (attempt ${reconnectAttemptsRef.current})`);
        
        reconnectTimeoutRef.current = window.setTimeout(() => {
            connect();
        }, WS_CONFIG.reconnectInterval);
    }, [connect]);
    
    // ========================================================
    // SEND METHODS
    // ========================================================
    
    const sendMessage = useCallback((conversationId: number, content: string) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            console.error('[WS] Not connected');
            return;
        }
        
        wsRef.current.send(JSON.stringify({
            type: 'message',
            conversation_id: conversationId,
            content,
        }));
    }, []);
    
    const sendTyping = useCallback((conversationId: number, isTyping: boolean) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            return;
        }
        
        wsRef.current.send(JSON.stringify({
            type: 'typing',
            conversation_id: conversationId,
            is_typing: isTyping,
        }));
    }, []);
    
    const markAsRead = useCallback((conversationId: number) => {
        if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            return;
        }
        
        wsRef.current.send(JSON.stringify({
            type: 'read',
            conversation_id: conversationId,
        }));
    }, []);
    
    // ========================================================
    // LIFECYCLE
    // ========================================================
    
    useEffect(() => {
        if (token) {
            connect();
        }
        
        return () => {
            // Cleanup
            if (wsRef.current) {
                wsRef.current.close(1000, 'Component unmounted');
            }
            if (reconnectTimeoutRef.current) {
                window.clearTimeout(reconnectTimeoutRef.current);
            }
            if (pingIntervalRef.current) {
                window.clearInterval(pingIntervalRef.current);
            }
        };
    }, [token, connect]);
    
    return {
        isConnected,
        sendMessage,
        sendTyping,
        markAsRead,
    };
}
