import { useForm } from 'react-hook-form';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface PasswordChangeFormProps {
  onSubmit: (data: { currentPassword: string; newPassword: string }) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

interface PasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function PasswordChangeForm({ onSubmit, onCancel, isLoading }: PasswordChangeFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<PasswordFormData>();

  const newPasswordValue = watch('newPassword');

  const onFormSubmit = async (data: PasswordFormData) => {
    await onSubmit({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div>
        <p className="text-sm text-gray-500 mb-6">
          Для обеспечения безопасности вашего аккаунта мы рекомендуем использовать сложный пароль, состоящий из букв, цифр и специальных символов.
        </p>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-5">
        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Текущий пароль <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                {...register('currentPassword', {
                  required: 'Текущий пароль обязателен',
                })}
                className={`w-full px-4 py-2.5 bg-white border ${errors.currentPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
                placeholder="Введите текущий пароль"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.currentPassword.message}</p>
            )}
          </div>
        </div>

        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Новый пароль <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                {...register('newPassword', {
                  required: 'Новый пароль обязателен',
                  minLength: {
                    value: 6,
                    message: 'Минимум 6 символов',
                  },
                })}
                className={`w-full px-4 py-2.5 bg-white border ${errors.newPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
                placeholder="Введите новый пароль"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Подтвердите новый пароль <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                {...register('confirmPassword', {
                  required: 'Подтверждение пароля обязательно',
                  validate: (value) =>
                    value === newPasswordValue || 'Пароли не совпадают',
                })}
                className={`w-full px-4 py-2.5 bg-white border ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-200 focus:ring-indigo-500'} rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-shadow`}
                placeholder="Подтвердите новый пароль"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1.5 text-sm text-red-600 font-medium">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-all active:scale-[0.98]"
            disabled={isLoading}
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Смена пароля...
              </>
            ) : (
              'Сменить пароль'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
