import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStudioById } from '../api/studios';
import { RoomCard } from '../components/RoomCard';
import { ReviewList } from '../../reviews/ReviewList';
import type { Room } from '../../../types/index';

export const StudioDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    
    const { data, isLoading, error } = useQuery({
        queryKey: ['studio', id],
        queryFn: () => getStudioById(Number(id)),
    });
    
    if (isLoading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка загрузки</div>;
    
    return (
        <div className="studio-detail">
            <h1>{data.studio.name}</h1>
            <p>{data.description}</p>
            <p>Адрес: {data.address}</p>
            <p>Рейтинг: {data.rating} ({data.total_reviews} отзывов)</p>
            
            <h2>Комнаты</h2>
            <div className="rooms-grid">
                {data.rooms?.map((room: Room) => (
                    <RoomCard key={room.id} room={room} studioId={data.studio.id} />
                ))}
            </div>
            
            <ReviewList studioId={data.studio.id} />
        </div>
    );
};
