import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { register as registerApi, registerStudio } from './auth.api';
import type { RegisterRequest } from './auth.types';

export default function RegisterForm() {
  const [searchParams] = useSearchParams();
  const registrationType = searchParams.get('type');
  const navigate = useNavigate();

  // Redirect to studio registration if type=employer
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
    <div className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-logo">StudioBooking</div>
          <h2 className="auth-title">Создать аккаунт клиента</h2>
          <p className="auth-sub">Зарегистрируйтесь для начала работы</p>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <label className="auth-label">
            <span className="visually-hidden">Имя</span>
            <input
              className="auth-input"
              type="text"
              placeholder="Имя"
              {...register('name', { required: 'Имя обязательно' })}
            />
            {errors.name && <p className="auth-error">{errors.name.message}</p>}
          </label>

          <label className="auth-label">
            <span className="visually-hidden">Электронная почта</span>
            <input
              className="auth-input"
              type="email"
              placeholder="Электронная почта"
              {...register('email', {
                required: 'Email обязателен',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Неверный формат email'
                }
              })}
            />
            {errors.email && <p className="auth-error">{errors.email.message}</p>}
          </label>

          <label className="auth-label">
            <span className="visually-hidden">Телефон</span>
            <input
              className="auth-input"
              type="tel"
              placeholder="Телефон"
              {...register('phone', { required: 'Телефон обязателен' })}
            />
            {errors.phone && <p className="auth-error">{errors.phone.message}</p>}
          </label>

          <label className="auth-label">
            <span className="visually-hidden">Пароль</span>
            <input
              className="auth-input"
              type="password"
              placeholder="Пароль"
              {...register('password', {
                required: 'Пароль должен содержать минимум 6 символов',
                minLength: {
                  value: 6,
                  message: 'Пароль должен содержать минимум 6 символов'
                }
              })}
            />
            {errors.password && <p className="auth-error">{errors.password.message}</p>}
          </label>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <footer className="auth-footer">
          <div className="auth-footer-links">
            <small>Уже есть аккаунт? <Link to="/login">Войти</Link></small>
            <small>Вы владелец студии? <Link to="/studio-register">Зарегистрировать студию</Link></small>
          </div>
        </footer>
      </div>
    </div>
  );
}