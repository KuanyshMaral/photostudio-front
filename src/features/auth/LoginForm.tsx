import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { login } from "./auth.api";
import { useAuth } from "../../context/AuthContext";
import { Loader2, Camera, Mail, Lock } from "lucide-react";

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const response = await login(data);
      console.log('Login response:', response); // Отладка
      authLogin(response.token, response.user);
      toast.success('Вы успешно вошли!');
      
      // Redirect based on user role
      const userRole = response.user?.role;
      console.log('User role:', userRole); // Отладка
      
      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'studio_owner') {
        navigate('/owner');
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      // Показываем ошибку от API
      const message = error.response?.data?.error?.message || error.message || 'Ошибка входа';
      toast.error(message);
    } finally {
      setIsLoading(false);
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
          <p className="text-gray-600 font-light">Добро пожаловать обратно</p>
        </div>

        {/* Login Card */}
        <div className="modern-card p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Некорректный email'
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
                    required: 'Пароль обязателен',
                    minLength: {
                      value: 6,
                      message: 'Минимум 6 символов'
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
              disabled={isLoading}
              className="btn-primary w-full flex items-center justify-center gap-3 py-4 text-lg
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Вход...
                </>
              ) : (
                'Войти'
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Нет аккаунта?{' '}
              <Link to="/register" className="text-primary-600 hover:text-primary-700 font-semibold transition-colors">
                Зарегистрироваться
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
