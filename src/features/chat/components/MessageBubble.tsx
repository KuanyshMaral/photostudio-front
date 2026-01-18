import type { Message } from '../chat.types';
import './MessageBubble.css';

interface MessageBubbleProps {
    message: Message;
    isMine: boolean;
    showAvatar?: boolean;
}

export default function MessageBubble({ 
    message, 
    isMine, 
    showAvatar = true 
}: MessageBubbleProps) {
    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(part => part[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className={`message-bubble ${isMine ? 'mine' : 'theirs'}`}>
            {/* Аватар (только для чужих сообщений) */}
            {!isMine && showAvatar && (
                <div className="message-avatar">
                    {message.sender?.avatar ? (
                        <img src={message.sender.avatar} alt="" />
                    ) : (
                        <div className="avatar-placeholder">
                            {getInitials(message.sender?.name || '?')}
                        </div>
                    )}
                </div>
            )}

            <div className="message-content-wrapper">
                {/* Имя отправителя (только для чужих) */}
                {!isMine && showAvatar && message.sender && (
                    <div className="message-sender-name">
                        {message.sender.name}
                    </div>
                )}

                {/* Контент сообщения */}
                <div className="message-content">
                    {message.message_type === 'image' && message.attachment_url ? (
                        <img 
                            src={message.attachment_url} 
                            alt="Изображение"
                            className="message-image"
                            onClick={() => window.open(message.attachment_url, '_blank')}
                        />
                    ) : (
                        <p className="message-text">{message.content}</p>
                    )}
                    
                    <div className="message-meta">
                        <span className="message-time">
                            {formatTime(message.created_at)}
                        </span>
                        {isMine && (
                            <span className={`message-status ${message.is_read ? 'read' : ''}`}>
                                {message.is_read ? '✓✓' : '✓'}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
