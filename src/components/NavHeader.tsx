import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import NotificationBell from './NotificationBell';

export default function NavHeader() {
    const { token, logout } = useAuth();
    
    if (!token) return null;
    
    return (
        <header className="nav-header">
            <div className="nav-container">
                <Link to="/" className="nav-logo">StudioBooking</Link>
                <nav className="nav-links">
                    <Link to="/">Каталог</Link>
                    <Link to="/my-bookings">Мои бронирования</Link>
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
