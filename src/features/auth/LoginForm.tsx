import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import { login } from "./auth.api";
import { useAuth } from "../../context/AuthContext";
import { Loader2 } from "lucide-react";

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
      authLogin(response.token, response.user);
      toast.success('Вы успешно вошли!');
      
      // Redirect based on user role
      if (response.user?.role === 'admin') {
        navigate('/admin');
      } else if (response.user?.role === 'studio_owner') {
        navigate('/owner');
      } else {
        navigate('/studios');
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
    <div className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-logo">StudioBooking</div>
          <h2 className="auth-title">Добро пожаловать</h2>
          <p className="auth-sub">Войдите в свой аккаунт для продолжения</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form space-y-4">
          {/* Email field */}
          <div>
            <label className="auth-label">
              <span className="visually-hidden">Email</span>
              <input
                type="email"
                {...register('email', {
                  required: 'Email обязателен',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Некорректный email'
                  }
                })}
                className={`auth-input ${
                  errors.email ? 'border-red-500 focus:border-red-500' : ''
                }`}
                placeholder="Электронная почта"
              />
            </label>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password field */}
          <div>
            <label className="auth-label">
              <span className="visually-hidden">Пароль</span>
              <input
                type="password"
                {...register('password', {
                  required: 'Пароль обязателен',
                  minLength: {
                    value: 6,
                    message: 'Минимум 6 символов'
                  }
                })}
                className={`auth-input ${
                  errors.password ? 'border-red-500 focus:border-red-500' : ''
                }`}
                placeholder="Пароль"
              />
            </label>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="auth-button w-full flex items-center justify-center gap-2
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

        <footer className="auth-footer">
          <small>Нет аккаунта? <Link to="/register">Зарегистрироваться</Link></small>
        </footer>
      </div>
    </div>
  );
}
