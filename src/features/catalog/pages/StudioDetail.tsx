<<<<<<< HEAD
import React from 'react';
=======
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStudioById } from '../api/studios';
import { RoomCard } from '../components/RoomCard';
import { ReviewList } from '../../reviews/ReviewList';
<<<<<<< HEAD
import LoadingSpinner from '../../../components/LoadingSpinner';

export const StudioDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, error } = useQuery({
        queryKey: ['studio', id],
        queryFn: () => getStudioById(Number(id)),
        enabled: !!id,
    });

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[50vh]">
            <LoadingSpinner size="lg" text="Загрузка..." />
        </div>
    );

    if (error) return <div className="p-8 text-center text-red-500">Ошибка загрузки</div>;
    if (!data) return null;

    return (
        <div className="studio-detail container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-4">{data.studio.name}</h1>
                <p className="text-lg text-gray-700 mb-4">{data.studio.description}</p>
                <div className="flex flex-wrap gap-4 text-gray-600">
                    <p>📍 {data.studio.address}</p>
                    <p>⭐ {data.studio.rating} ({data.studio.total_reviews} отзывов)</p>
                </div>
            </div>

            <h2 className="text-2xl font-semibold mb-6">Комнаты</h2>
            <div className="rooms-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {data.rooms?.map(room => (
                    <RoomCard 
                        key={room.id} 
                        room={room} 
                        studioId={data.studio.id}
                        studioName={data.studio.name}
                    />
                ))}
            </div>

            <ReviewList studioId={data.studio.id} />
        </div>
    );
};
=======
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
>>>>>>> 2bd5a701eab2089c20aafe7f2ec441f3cf22f410
