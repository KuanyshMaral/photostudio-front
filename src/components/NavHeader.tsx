import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getConversations } from '../features/chat/chat.api';
import NotificationBell from './NotificationBell';
import './NavHeader.css';

export default function NavHeader() {
    const { token, logout } = useAuth();
    const location = useLocation();
    const [unreadCount, setUnreadCount] = useState(0);
    
    // Загрузка unread count
    useEffect(() => {
        const fetchUnread = async () => {
            if (!token) return;
            
            try {
                const data = await getConversations(token);
                const total = data.conversations.reduce(
                    (sum, conv) => sum + conv.unread_count, 
                    0
                );
                setUnreadCount(total);
            } catch (error) {
                console.error('Failed to fetch unread:', error);
            }
        };
        
        fetchUnread();
        const interval = setInterval(fetchUnread, 30000);
        return () => clearInterval(interval);
    }, [token]);
    
    if (!token) return null;
    
    return (
        <header className="nav-header">
            <div className="nav-container">
                <Link to="/" className="nav-logo">StudioBooking</Link>
                <nav className="nav-links">
                    <Link to="/">Каталог</Link>
                    <Link to="/my-bookings">Мои бронирования</Link>
                    <Link 
                        to="/messages" 
                        className={`nav-link ${location.pathname.startsWith('/messages') ? 'active' : ''}`}
                    >
                        💬 Сообщения
                        {unreadCount > 0 && (
                            <span className="nav-badge">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                    </Link>
                    <Link to="/profile">Профиль</Link>
                </nav>
                <div className="nav-actions">
                    <NotificationBell />
                    <button onClick={logout}>Выйти</button>
                </div>
            </div>
        </header>
    );
}
