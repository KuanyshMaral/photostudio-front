import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyStudios } from './owner.api';
import './Owner.css';

export default function MyStudios() {
    const { token } = useAuth();
    const [studios, setStudios] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (!token) return;
            try {
                const data = await getMyStudios(token);
                setStudios(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [token]);

    if (loading) return <p>Загрузка...</p>;

    return (
        <div className="owner-page">
            <h1>Мои студии</h1>

            {studios.length === 0 ? (
                <p>У вас пока нет студий</p>
            ) : (
                <div className="studios-list">
                    {studios.map(studio => (
                        <div key={studio.id} className="studio-item">
                            <div className="studio-info">
                                <h3>{studio.name}</h3>
                                <p>{studio.address}</p>
                                <p>Рейтинг: {studio.rating} ({studio.total_reviews} отзывов)</p>
                            </div>
                            <div className="studio-actions">
                                <Link to={`/owner/studios/${studio.id}/bookings`} className="btn-primary">
                                    Бронирования
                                </Link>
                                <Link to={`/studios/${studio.id}`} className="btn-secondary">
                                    Просмотр
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}