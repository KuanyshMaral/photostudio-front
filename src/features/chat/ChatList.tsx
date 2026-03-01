import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getConversations } from './chat.api';
import type { Conversation } from './chat.types';
import './ChatList.css';

interface ChatListProps {
    activeConversationId?: string | number;
    onSelectConversation: (conversation: Conversation) => void;
}

export default function ChatList({ activeConversationId, onSelectConversation }: ChatListProps) {
    const { token } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    const fetchConversations = async () => {
        if (!token) {
            setConversations([]);
            setIsLoading(false);
            return;
        }
        
        setIsLoading(true);
        setError(null);
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

    const getConversationName = (conversation: Conversation): string => {
        return conversation.other_user?.name?.trim() || 'Unknown user';
    };

    useEffect(() => {
        fetchConversations();
    }, [token, retryCount]);

    useEffect(() => {
        if (!activeConversationId || conversations.length === 0) {
            return;
        }

        const activeConversation = conversations.find(
            (conversation) => conversation.id === activeConversationId
        );

        if (activeConversation) {
            onSelectConversation(activeConversation);
        }
    }, [activeConversationId, conversations, onSelectConversation]);

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
                <div className="chat-list-error">
                    <p>{error}</p>
                    <button 
                        className="chat-list-retry-btn"
                        onClick={() => setRetryCount(prev => prev + 1)}
                    >
                        Retry
                    </button>
                </div>
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
                                String(activeConversationId) === String(conversation.id) ? 'active' : ''
                            }`}
                            onClick={() => onSelectConversation(conversation)}
                        >
                            <div className="chat-list-item-avatar">
                                {getConversationName(conversation).charAt(0).toUpperCase()}
                            </div>
                            <div className="chat-list-item-content">
                                <div className="chat-list-item-header">
                                    <span className="chat-list-item-name">
                                        {getConversationName(conversation)}
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