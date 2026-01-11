import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudios } from '../api/studios';
// Убедись, что путь к StudioCard правильный. 
// Если ты сохранил код выше в src/components/StudioCard.tsx, то путь такой:
import { StudioCard } from '../../../components/StudioCard'; 
import { StudioFilters } from '../components/StudioFilters';
import LoadingSpinner from '../../../components/LoadingSpinner';
// StudioFilterParams берем из types.ts, так как в index.ts его нет
import { StudioFilterParams } from '../../../types/types'; 

export const StudioList: React.FC = () => {
    const [filters, setFilters] = useState<StudioFilterParams>({
        page: 1,
        limit: 20,
        city: 'Алматы'
    });

    const { data, isLoading, isError } = useQuery({
        queryKey: ['studios', filters],
        queryFn: () => getStudios(filters),
    });

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <LoadingSpinner size="lg" text="Загрузка каталога..." />
            </div>
        );
    }

    if (isError) {
         return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <p className="text-red-500">Ошибка загрузки данных</p>
            </div>
        );
    }

    // data прилетает как StudiosResponse, внутри есть data.studios
    const studiosList = data?.data?.studios || [];

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold mb-8">Каталог фотостудий</h1>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <aside className="md:col-span-1">
                        <StudioFilters filters={filters} onFilterChange={setFilters} />
                    </aside>
                    <main className="md:col-span-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {studiosList.map((studio) => (
                                <StudioCard key={studio.id} studio={studio} />
                            ))}
                        </div>
                        {studiosList.length === 0 && (
                            <p className="text-center text-gray-500 mt-10">Студии не найдены</p>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};