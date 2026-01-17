import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
<<<<<<< HEAD
import { getNotifications, markAsRead, markAllAsRead, Notification } from '../api/notificationApi';
=======
import { getNotifications, markAsRead, markAllAsRead, type Notification } from '../api/notificationApi';
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
import './NotificationBell.css';

export default function NotificationBell() {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const data = await getNotifications(token);
            setNotifications(data.notifications);
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error('Failed to fetch notifications');
        }
    };

    useEffect(() => {
        fetchNotifications();
<<<<<<< HEAD
        // Polling every 30 seconds
=======
        // Polling каждые 30 секунд
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [token]);

<<<<<<< HEAD
    // Close on click outside
=======
    // Закрытие при клике вне
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id: number) => {
        if (!token) return;
        await markAsRead(token, id);
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleMarkAllAsRead = async () => {
        if (!token) return;
        await markAllAsRead(token);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);
    };

    const formatTime = (date: string) => {
        const d = new Date(date);
        const now = new Date();
        const diff = now.getTime() - d.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return 'Только что';
        if (hours < 24) return `${hours}ч назад`;
        return d.toLocaleDateString();
    };

    return (
        <div className="notification-bell" ref={dropdownRef}>
            <button className="bell-button" onClick={() => setIsOpen(!isOpen)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="dropdown-header">
                        <span>Уведомления</span>
                        {unreadCount > 0 && (
                            <button onClick={handleMarkAllAsRead} className="mark-all">
                                Прочитать все
                            </button>
                        )}
                    </div>
                    <div className="dropdown-list">
                        {notifications.length === 0 ? (
                            <p className="empty">Нет уведомлений</p>
                        ) : (
                            notifications.map(notif => (
                                <div
                                    key={notif.id}
                                    className={`notification-item ${!notif.is_read ? 'unread' : ''}`}
                                    onClick={() => !notif.is_read && handleMarkAsRead(notif.id)}
                                >
                                    <div className="notif-title">{notif.title}</div>
                                    <div className="notif-message">{notif.message}</div>
                                    <div className="notif-time">{formatTime(notif.created_at)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
<<<<<<< HEAD
}
=======
}
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
