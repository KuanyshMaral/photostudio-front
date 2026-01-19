import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import type { Conversation } from './chat.types';
import './ChatPage.css';

export default function ChatPage() {
    const { conversationId } = useParams<{ conversationId?: string }>();
    const navigate = useNavigate();
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    
    // Mobile: показываем либо список, либо окно
    const isMobile = window.innerWidth < 768;
    const showList = !isMobile || !conversationId;
    
    const handleSelectConversation = (conversation: Conversation) => {
        setSelectedConversation(conversation);
        navigate(`/messages/${conversation.id}`);
    };
    
    const handleBack = () => {
        setSelectedConversation(null);
        navigate('/messages');
    };
    
    return (
        <div className="chat-page">
            {/* Sidebar со списком диалогов */}
            {showList && (
                <aside className="chat-sidebar">
                    <ChatList
                        activeConversationId={conversationId ? parseInt(conversationId) : undefined}
                        onSelectConversation={handleSelectConversation}
                    />
                </aside>
            )}
            
            {/* Основное окно чата */}
            <main className="chat-main">
                {selectedConversation ? (
                    <ChatWindow
                        conversation={selectedConversation}
                        onBack={isMobile ? handleBack : undefined}
                    />
                ) : (
                    <div className="chat-empty-state">
                        <div className="empty-icon">💬</div>
                        <h3>Выберите диалог</h3>
                        <p>Выберите диалог из списка слева или начните новый</p>
                    </div>
                )}
            </main>
        </div>
    );
}
