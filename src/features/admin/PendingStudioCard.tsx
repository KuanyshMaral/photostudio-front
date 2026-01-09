import React, { useState } from 'react';
import { verifyStudio, rejectStudio } from '../../api/adminApi';
import { useAuth } from '../../context/AuthContext.tsx';
import { toast } from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

interface PendingStudioCardProps {
    studio: {
        id: number;
        name: string;
        description: string;
        address: string;
        owner_name?: string;
        created_at: string;
    };
}

export const PendingStudioCard: React.FC<PendingStudioCardProps> = ({ studio }) => {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const [isProcessing, setIsProcessing] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectInput, setShowRejectInput] = useState(false);

    const handleVerify = async () => {
        if (!token) return;
        if (!confirm('Подтвердить студию?')) return;
        
        setIsProcessing(true);
        try {
            await verifyStudio(token, studio.id);
            toast.success('Студия верифицирована');
            queryClient.invalidateQueries({ queryKey: ['pending-studios'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        } catch (error) {
            toast.error('Ошибка верификации');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!token || !rejectReason) return;

        setIsProcessing(true);
        try {
            await rejectStudio(token, studio.id, rejectReason);
            toast.success('Студия отклонена');
            queryClient.invalidateQueries({ queryKey: ['pending-studios'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
            setShowRejectInput(false);
        } catch (error) {
            toast.error('Ошибка отклонения');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow mb-4 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-bold">{studio.name}</h3>
                    <p className="text-gray-600 text-sm">Владелец: {studio.owner_name || 'Неизвестно'}</p>
                    <p className="text-gray-500 text-xs">Создано: {new Date(studio.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                    {!showRejectInput && (
                        <>
                            <button
                                onClick={handleVerify}
                                disabled={isProcessing}
                                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
                            >
                                Принять
                            </button>
                            <button
                                onClick={() => setShowRejectInput(true)}
                                disabled={isProcessing}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                            >
                                Отклонить
                            </button>
                        </>
                    )}
                </div>
            </div>
            
            <p className="text-gray-700 mb-2"><strong>Адрес:</strong> {studio.address}</p>
            <p className="text-gray-700 mb-4">{studio.description}</p>

            {showRejectInput && (
                <div className="mt-4 p-4 bg-gray-50 rounded">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Причина отказа</label>
                    <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        rows={3}
                        placeholder="Укажите причину..."
                    />
                    <div className="flex justify-end gap-2">
                         <button
                            onClick={() => setShowRejectInput(false)}
                            className="text-gray-600 px-3 py-1 text-sm hover:underline"
                        >
                            Отмена
                        </button>
                        <button
                            onClick={handleReject}
                            disabled={!rejectReason || isProcessing}
                            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
                        >
                            Подтвердить отказ
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};