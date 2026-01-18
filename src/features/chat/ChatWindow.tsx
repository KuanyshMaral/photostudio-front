import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
    getMessages, 
    sendMessage, 
    uploadImage, 
    markAsRead
} from './chat.api';
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
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

    // Отправка сообщения
    const handleSend = async (content: string) => {
        if (!token || isSending) return;
        
        setIsSending(true);
        try {
            const newMessage = await sendMessage(token, conversation.id, content);
            setMessages(prev => [...prev, newMessage]);
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
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
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <MessageInput
                onSend={handleSend}
                onImageUpload={handleImageUpload}
                disabled={isSending}
            />
        </div>
    );
}
