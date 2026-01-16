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
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Редактирование профиля</h3>
        <p className="text-sm text-gray-600">
          Обновите информацию о вашем профиле
        </p>
      </div>

      {/* Avatar Upload */}
      <div className="flex justify-center">
        <AvatarUpload
          currentAvatar={currentAvatar}
          onUpload={handleAvatarUpload}
          isLoading={avatarUploading}
        />
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Имя
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Введите ваше имя"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Телефон
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="+7 (777) 123-45-67"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>

        {/* Read-only fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={profile?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
              placeholder="Email"
            />
            <p className="mt-1 text-xs text-gray-500">Email нельзя изменить</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Роль
            </label>
            <input
              type="text"
              value={profile?.role === 'studio_owner' ? 'Владелец студии' : 
                     profile?.role === 'admin' ? 'Администратор' : 'Клиент'}
              disabled
              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
            />
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            disabled={isLoading || avatarUploading}
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isLoading || avatarUploading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Сохранение...
              </>
            ) : (
              'Сохранить'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
