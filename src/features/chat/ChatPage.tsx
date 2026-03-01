import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { getConversations } from './chat.api';
import type { Conversation } from './chat.types';
import './ChatPage.css';

export default function ChatPage() {
    const { conversationId } = useParams<{ conversationId?: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [isHydratingConversation, setIsHydratingConversation] = useState(false);
    const [hydrateError, setHydrateError] = useState<string | null>(null);

    const activeConversationId = useMemo(() => {
        if (!conversationId) {
            return undefined;
        }

        const parsed = Number.parseInt(conversationId, 10);
        return Number.isFinite(parsed) ? parsed : undefined;
    }, [conversationId]);
    
    // Mobile: показываем либо список, либо окно
    const isMobile = window.innerWidth < 768;
    const showList = !isMobile || !activeConversationId;

    useEffect(() => {
        if (!token || !activeConversationId || selectedConversation?.id === activeConversationId) {
            return;
        }

        const hydrateConversation = async () => {
            setIsHydratingConversation(true);
            setHydrateError(null);

            try {
                const response = await getConversations(token, 100, 0);
                const found = response.conversations.find((conversation) => conversation.id === activeConversationId);

                if (!found) {
                    setHydrateError('Диалог не найден');
                    return;
                }

                setSelectedConversation(found);
            } catch (error) {
                console.error('Failed to load conversation by id:', error);
                setHydrateError('Не удалось загрузить диалог');
            } finally {
                setIsHydratingConversation(false);
            }
        };

        hydrateConversation();
    }, [token, activeConversationId, selectedConversation?.id]);
    
    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
        navigate(`/messages/${conversation.id}`);
    };
    
    const handleBack = () => {
        setSelectedConversation(null);
        navigate('/messages');
    };
    
    return (
        <Layout>
            <div className="chat-page">
                {/* Sidebar со списком диалогов */}
                {showList && (
                    <aside className="chat-sidebar">
                        <ChatList
<<<<<<< HEAD
                            activeConversationId={activeConversationId}
=======
                            activeConversationId={conversationId}
>>>>>>> main
                            onSelectConversation={handleSelectConversation}
                        />
                    </aside>
                )}
                
                {/* Основное окно чата */}
                <main className="chat-main">
                    {isHydratingConversation ? (
                        <div className="chat-empty-state">
                            <h3>Загрузка диалога...</h3>
                        </div>
                    ) : selectedConversation ? (
                        <ChatWindow
                            conversation={selectedConversation}
                            onBack={isMobile ? handleBack : undefined}
                        />
                    ) : hydrateError ? (
                        <div className="chat-empty-state">
                            <h3>{hydrateError}</h3>
                            <p>Вернитесь к списку диалогов и попробуйте снова</p>
                        </div>
                    ) : (
                        <div className="chat-empty-state">
                            <div className="empty-icon">💬</div>
                            <h3>Выберите диалог</h3>
                            <p>Выберите диалог из списка слева или начните новый</p>
                        </div>
                    )}
                </main>
            </div>
        </Layout>
    );
}
