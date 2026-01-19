import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getConversations } from './chat.api';
import type { Conversation } from './chat.types';
import './ChatList.css';

interface ChatListProps {
    activeConversationId?: number;
    onSelectConversation: (conversation: Conversation) => void;
}

export default function ChatList({ activeConversationId, onSelectConversation }: ChatListProps) {
    const { token } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchConversations = async () => {
            if (!token) return;
            
            setIsLoading(true);
            try {
                const data = await getConversations(token);
                setConversations(data.conversations || []);
            } catch (err) {
                setError('Failed to load conversations');
                console.error('Failed to fetch conversations:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConversations();
    }, [token]);

    if (isLoading) {
        return (
            <div className="chat-list">
                <div className="chat-list-loading">Loading conversations...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="chat-list">
                <div className="chat-list-error">{error}</div>
            </div>
        );
    }

    return (
        <div className="chat-list">
            <div className="chat-list-header">
                <h2>Messages</h2>
            </div>
            <div className="chat-list-content">
                {conversations.length === 0 ? (
                    <div className="chat-list-empty">
                        <p>No conversations yet</p>
                    </div>
                ) : (
                    conversations.map((conversation) => (
                        <div
                            key={conversation.id}
                            className={`chat-list-item ${
                                activeConversationId === conversation.id ? 'active' : ''
                            }`}
                            onClick={() => onSelectConversation(conversation)}
                        >
                            <div className="chat-list-item-avatar">
                                {conversation.other_user.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="chat-list-item-content">
                                <div className="chat-list-item-header">
                                    <span className="chat-list-item-name">
                                        {conversation.other_user.name}
                                    </span>
                                    <span className="chat-list-item-time">
                                        {new Date(conversation.last_message_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="chat-list-item-preview">
                                    {conversation.last_message?.content || 'No messages yet'}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}