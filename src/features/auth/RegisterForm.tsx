import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as registerApi, registerStudio } from './auth.api';
import type { RegisterRequest } from './auth.types';
import { Loader2, Camera, User, Mail, Phone, Lock } from 'lucide-react';

export default function RegisterForm() {
  const [searchParams] = useSearchParams();
  const registrationType = searchParams.get('type');
  const navigate = useNavigate();

  // Redirect to studio registration if type=studio_owner
  useEffect(() => {
    if (registrationType === 'studio_owner') {
      navigate('/studio-register', { replace: true });
    }
  }, [registrationType, navigate]);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterRequest>({
    defaultValues: { role: 'client' }
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RegisterRequest) => {
    setLoading(true);
    try {
      await registerApi(data);
      toast.success('Регистрация успешна! Войдите в аккаунт.');
      navigate('/login');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl shadow-lg mb-6">
            <Camera className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">StudioBooking</h1>
          <p className="text-gray-600 font-light">Создайте аккаунт клиента</p>
        </div>

        {/* Register Card */}
        <div className="modern-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Имя
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  {...register('name', { required: 'Имя обязательно' })}
                  className={`modern-input pl-12 ${
                    errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                  placeholder="Ваше имя"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-2 animate-slide-up">{errors.name.message}</p>
              )}
            </div>

            {/* Email field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email обязателен',
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: 'Неверный формат email'
                    }
                  })}
                  className={`modern-input pl-12 ${
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                  placeholder="your@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-2 animate-slide-up">{errors.email.message}</p>
              )}
            </div>

            {/* Phone field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Телефон
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  {...register('phone', { required: 'Телефон обязателен' })}
                  className={`modern-input pl-12 ${
                    errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                  placeholder="+7 (___) ___-__-__"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-2 animate-slide-up">{errors.phone.message}</p>
              )}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  {...register('password', {
                    required: 'Пароль должен содержать минимум 6 символов',
                    minLength: {
                      value: 6,
                      message: 'Пароль должен содержать минимум 6 символов'
                    }
                  })}
                  className={`modern-input pl-12 ${
                    errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-200' : ''
                  }`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-2 animate-slide-up">{errors.password.message}</p>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Регистрация...
                </>
              ) : (
                'Зарегистрироваться'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center space-y-3">
            <p className="text-gray-600">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                Войти
              </Link>
            </p>
            <p className="text-gray-600">
              Владелец студии?{' '}
              <Link to="/studio-register" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                Зарегистрировать студию
              </Link>
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl font-bold gradient-text">250+</div>
            <div className="text-xs text-gray-600">Студий</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl font-bold gradient-text">10K+</div>
            <div className="text-xs text-gray-600">Клиентов</div>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-3">
            <div className="text-2xl font-bold gradient-text">4.9</div>
            <div className="text-xs text-gray-600">Рейтинг</div>
          </div>
        </div>
      </div>
    </div>
  );
}