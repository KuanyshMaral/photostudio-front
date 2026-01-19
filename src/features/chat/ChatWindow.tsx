import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
    getMessages, 
    sendMessage, 
    uploadImage, 
    markAsRead
} from './chat.api';
import { useChat } from './useChat';
import type { 
    Conversation, 
    Message 
} from './chat.api';
import MessageBubble from './components/MessageBubble';
import MessageInput from './components/MessageInput';
import './ChatWindow.css';

interface ChatWindowProps {
    conversation: Conversation;
    onBack?: () => void;
}

export default function ChatWindow({ conversation, onBack }: ChatWindowProps) {
    const { token, user } = useAuth();
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const [isTyping, setIsTyping] = useState(false);  // NEW
    const messagesEndRef = useRef<HTMLDivElement>(null);
    
    // WebSocket hook
    const { isConnected, sendMessage: wsSendMessage, sendTyping } = useChat({
        token,
        onNewMessage: (convId, message) => {
            // Добавляем новое сообщение если это наш диалог
            if (convId === conversation.id) {
                setMessages(prev => [...prev, message]);
            }
        },
        onTyping: (convId, userId, typing) => {
            // Показываем индикатор если это наш диалог и не мы
            if (convId === conversation.id && userId !== user?.id) {
                setIsTyping(typing);
            }
        },
    });

    // Загрузка сообщений
    useEffect(() => {
        const fetchMessages = async () => {
            if (!token) return;
            
            setIsLoading(true);
            try {
                const data = await getMessages(token, conversation.id);
                setMessages(data.messages || []);
                
                // Помечаем как прочитанные
                await markAsRead(token, conversation.id);
            } catch (error) {
                console.error('Failed to fetch messages:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages();
    }, [token, conversation.id]);

    // Scroll to bottom при новых сообщениях
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Отправка через WebSocket или REST fallback
    const handleSend = async (content: string) => {
        if (isConnected) {
            // Через WebSocket
            wsSendMessage(conversation.id, content);
        } else {
            // Fallback на REST
            setIsSending(true);
            try {
                const newMessage = await sendMessage(token!, conversation.id, content);
                setMessages(prev => [...prev, newMessage]);
            } catch (error) {
                console.error('Failed to send:', error);
            } finally {
                setIsSending(false);
            }
        }
    };

    // Загрузка изображения
    const handleImageUpload = async (file: File) => {
        if (!token) return;
        
        try {
            const newMessage = await uploadImage(token, conversation.id, file);
            setMessages(prev => [...prev, newMessage]);
        } catch (error) {
            console.error('Failed to upload image:', error);
        }
    };
    
    // Typing indicator
    const handleTypingStart = () => {
        sendTyping(conversation.id, true);
    };
    
    const handleTypingStop = () => {
        sendTyping(conversation.id, false);
    };

    return (
        <div className="chat-window">
            {/* Header */}
            <div className="chat-window-header">
                {onBack && (
                    <button className="back-btn" onClick={onBack}>
                        ←
                    </button>
                )}
                
                <div className="header-info">
                    <h3>{conversation.other_user.name}</h3>
                    {conversation.studio && (
                        <span className="header-context">
                            {conversation.studio.name}
                        </span>
                    )}
                </div>
            </div>

            {/* Messages */}
            <div className="chat-window-messages">
                {isLoading ? (
                    <div className="messages-loading">Загрузка...</div>
                ) : messages.length === 0 ? (
                    <div className="messages-empty">
                        <p>Начните диалог</p>
                    </div>
                ) : (
                    messages.map((msg, index) => (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isMine={msg.sender_id === user?.id}
                            showAvatar={
                                index === 0 || 
                                messages[index - 1].sender_id !== msg.sender_id
                            }
                        />
                    ))
                )}
                {isTyping && (
                    <div className="typing-indicator">
                        <span>{conversation.other_user.name} печатает</span>
                        <div className="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <MessageInput
                onSend={handleSend}
                onImageUpload={handleImageUpload}
                onTypingStart={handleTypingStart}  // NEW
                onTypingStop={handleTypingStop}    // NEW
                disabled={isSending}
            />
        </div>
    );
}
