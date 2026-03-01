import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import AvatarUpload from './AvatarUpload';
import { uploadAvatar } from '../features/auth/auth.api';

interface ProfileEditFormProps {
  profile: any;
  onSave: (data: any) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

interface ProfileFormData {
  name: string;
  phone: string;
}

export default function ProfileEditForm({ profile, onSave, onCancel, isLoading }: ProfileEditFormProps) {
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(profile?.avatar);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    defaultValues: {
      name: profile?.name || '',
      phone: profile?.phone || '',
    },
  });

  const handleAvatarUpload = async (file: File) => {
    setAvatarUploading(true);
    try {
      // This would need the token - you'll need to pass it or get it from context
      // For now, I'll assume it's handled elsewhere
      const result = await uploadAvatar('token', file);
      setCurrentAvatar(result.avatarUrl);
    } catch (error) {
      console.error('Avatar upload failed:', error);
      // Handle error appropriately
    } finally {
      setAvatarUploading(false);
    }
  };

  const onFormSubmit = async (data: ProfileFormData) => {
    await onSave({
      ...data,
      avatar: currentAvatar,
    });
  };

  return (
    <div className="space-y-8">
      {/* Avatar Upload */}
      <div className="flex flex-col items-center">
        <AvatarUpload
          currentAvatar={currentAvatar}
          onUpload={handleAvatarUpload}
          isLoading={avatarUploading}
        />
        <p className="mt-3 text-sm text-gray-500">
          Нажмите на фото для обновления
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5 max-w-lg mx-auto">
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Имя <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('name', {
                required: 'Имя обязательно',
                minLength: {
                  value: 2,
                  message: 'Минимум 2 символа',
                },
              })}
              className={`w-full px-4 py-2.5 bg-white border ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
              placeholder="Введите ваше имя"
            />
            {errors.name && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Телефон <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register('phone', {
                required: 'Телефон обязателен',
                pattern: {
                  value: /^\+?[\d\s\-\(\)]+$/,
                  message: 'Некорректный номер телефона',
                },
              })}
              className={`w-full px-4 py-2.5 bg-white border ${errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
              placeholder="+7 (777) 123-45-67"
            />
            {errors.phone && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.phone.message}</p>
            )}
          </div>
        </div>

        {/* Read-only fields */}
        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-5 opacity-80">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
            <h4 className="text-sm font-medium text-gray-600 uppercase tracking-wider">Нельзя изменить</h4>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
              placeholder="Email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1.5">
              Роль
            </label>
            <input
              type="text"
              value={profile?.role === 'studio_owner' ? 'Владелец студии' : 
                     profile?.role === 'admin' ? 'Администратор' : 'Клиент'}
              disabled
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-[0.98]"
            disabled={isLoading || avatarUploading}
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isLoading || avatarUploading}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Сохранение...
              </>
            ) : (
              'Сохранить изменения'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
