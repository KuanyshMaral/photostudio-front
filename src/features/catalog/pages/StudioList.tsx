import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getStudioById } from '../api/studios';
import { RoomCard } from '../components/RoomCard';
import { LoadingSpinner } from '../../../components/LoadingSpinner'; // Assuming this exists or use plain div

export const StudioDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();

    const { data, isLoading, error } = useQuery({
        queryKey: ['studio', id],
        queryFn: () => getStudioById(Number(id)),
        enabled: !!id,
    });

    if (isLoading) return <div className="p-8 text-center">Загрузка...</div>;
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
            <div className="rooms-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.rooms?.map(room => (
                    <RoomCard 
                        key={room.id} 
                        room={room} 
                        studioId={data.studio.id}
                        studioName={data.studio.name}
                    />
                ))}
            </div>
        </div>
    );
};