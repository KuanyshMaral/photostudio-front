import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudios } from '../api/studios';
import { StudioCard } from '../components/StudioCard';
import { StudioFilters } from '../components/StudioFilters';
import { StudioFilterParams } from '../../../types';

export const StudioList: React.FC = () => {
    const [filters, setFilters] = useState<StudioFilterParams>({
        page: 1,
        limit: 20,
        city: 'Алматы'
    });

    const { data, isLoading } = useQuery({
        queryKey: ['studios', filters],
        queryFn: () => getStudios(filters),
    });

    if (isLoading) return <div className="p-10 text-center">Загрузка каталога...</div>;

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
                            {data?.data.map(studio => (
                                <StudioCard key={studio.id} studio={studio} />
                            ))}
                        </div>
                        {data?.data.length === 0 && (
                            <p className="text-center text-gray-500 mt-10">Студии не найдены</p>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};