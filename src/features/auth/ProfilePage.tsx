import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProfile, updateProfile, changePassword } from './auth.api';
import { useAuth } from '../../context/AuthContext';
import type { Profile } from './auth.types';
import ProfileView from '../../components/ProfileView';
import ProfileEditForm from '../../components/ProfileEditForm';
import PasswordChangeForm from '../../components/PasswordChangeForm';
import { Loader2 } from 'lucide-react';

type ViewMode = 'view' | 'edit' | 'password';

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('view');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    if (!token) return;
    
    try {
      const data = await getProfile(token);
      setProfile(data);
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || 'Ошибка загрузки профиля';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async (data: Partial<Profile>) => {
    if (!token) return;
    
    setIsSubmitting(true);
    try {
      const updatedProfile = await updateProfile(token, data);
      setProfile(updatedProfile);
      setViewMode('view');
      toast.success('Профиль обновлён');
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || 'Ошибка сохранения';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePassword = async (passwordData: { currentPassword: string; newPassword: string }) => {
    if (!token) return;
    
    setIsSubmitting(true);
    try {
      await changePassword(token, passwordData.currentPassword, passwordData.newPassword);
      setViewMode('view');
      toast.success('Пароль успешно изменён');
    } catch (error: any) {
      const message = error.response?.data?.error?.message || error.message || 'Ошибка смены пароля';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Не удалось загрузить профиль</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Вернуться на главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 lg:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {viewMode === 'view' && (
          <ProfileView
            profile={profile}
            onEdit={() => setViewMode('edit')}
          />
        )}

        {viewMode === 'edit' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-5 flex items-center justify-between bg-white">
              <h1 className="text-xl font-bold text-gray-900">Редактирование профиля</h1>
              <button
                onClick={() => setViewMode('view')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 lg:p-8">
              <ProfileEditForm
                profile={profile}
                onSave={handleSaveProfile}
                onCancel={() => setViewMode('view')}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        )}

        {viewMode === 'password' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="border-b border-gray-100 px-6 py-5 flex items-center justify-between bg-white">
              <h1 className="text-xl font-bold text-gray-900">Смена пароля</h1>
              <button
                onClick={() => setViewMode('view')}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 lg:p-8">
              <PasswordChangeForm
                onSubmit={handleChangePassword}
                onCancel={() => setViewMode('view')}
                isLoading={isSubmitting}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}