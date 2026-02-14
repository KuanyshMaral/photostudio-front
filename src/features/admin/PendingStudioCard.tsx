import React, { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { verifyStudio, rejectStudio } from '../../api/adminApi';
import toast from 'react-hot-toast';

interface PendingStudioCardProps {
    studio: {
        id: number;
        name: string;
        email: string;
        phone: string;
        address: string;
        bin: string;
        contact_person: string;
        created_at: string;
        documents?: string[];
    };
}

export const PendingStudioCard: React.FC<PendingStudioCardProps> = ({ studio }) => {
    const { token } = useAuth();
    const queryClient = useQueryClient();
    const [adminNotes, setAdminNotes] = useState('');
    const [rejectReason, setRejectReason] = useState('');
    const [showRejectForm, setShowRejectForm] = useState(false);
    
    const verifyMutation = useMutation({
        mutationFn: (notes?: string) => verifyStudio(token!, studio.id, notes),
        onSuccess: () => {
            toast.success('Студия успешно верифицирована');
            queryClient.invalidateQueries({ queryKey: ['pending-studios'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to verify studio');
        }
    });
    
    const rejectMutation = useMutation({
        mutationFn: (reason: string) => rejectStudio(token!, studio.id, reason),
        onSuccess: () => {
            toast.success('Студия отклонена');
            queryClient.invalidateQueries({ queryKey: ['pending-studios'] });
            queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
            setShowRejectForm(false);
            setRejectReason('');
        },
        onError: (error) => {
            toast.error(error.message || 'Failed to reject studio');
        }
    });
    
    const handleVerify = () => {
        verifyMutation.mutate(adminNotes);
    };
    
    const handleReject = () => {
        if (!rejectReason.trim()) {
            toast.error('Пожалуйста, укажите причину отклонения');
            return;
        }
        rejectMutation.mutate(rejectReason);
    };
    
    return (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900">{studio.name}</h3>
                    <p className="text-sm text-gray-500">Заявка от {new Date(studio.created_at).toLocaleDateString('ru-RU')}</p>
                </div>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                    Ожидает верификации
                </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <p className="text-sm text-gray-600"><strong>Email:</strong> {studio.email}</p>
                    <p className="text-sm text-gray-600"><strong>Телефон:</strong> {studio.phone}</p>
                    <p className="text-sm text-gray-600"><strong>Адрес:</strong> {studio.address}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600"><strong>БИН:</strong> {studio.bin}</p>
                    <p className="text-sm text-gray-600"><strong>Контактное лицо:</strong> {studio.contact_person}</p>
                </div>
            </div>
            
            {studio.documents && studio.documents.length > 0 && (
                <div className="mb-6">
                    <p className="text-sm font-medium text-gray-700 mb-2">Документы:</p>
                    <div className="flex flex-wrap gap-2">
                        {studio.documents.map((_doc, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                                Документ {index + 1}
                            </span>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Заметки администратора (опционально)
                </label>
                <textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Добавьте заметки о верификации..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                />
            </div>
            
            <div className="flex gap-3">
                <button
                    onClick={handleVerify}
                    disabled={verifyMutation.isPending}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {verifyMutation.isPending ? 'Верификация...' : 'Верифицировать'}
                </button>
                
                {!showRejectForm ? (
                    <button
                        onClick={() => setShowRejectForm(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Отклонить
                    </button>
                ) : (
                    <div className="flex-1 space-y-2">
                        <textarea
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Причина отклонения..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            rows={2}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleReject}
                                disabled={rejectMutation.isPending}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                {rejectMutation.isPending ? 'Отклонение...' : 'Подтвердить'}
                            </button>
                            <button
                                onClick={() => {
                                    setShowRejectForm(false);
                                    setRejectReason('');
                                }}
                                className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 text-sm"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
