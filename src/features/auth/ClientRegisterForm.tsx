import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerClient, confirmEmailVerification, requestEmailVerification } from './auth.api';
import type { ClientRegisterRequest, EmailVerificationRequest } from './auth.types';
import { Loader2, Camera, Mail, Lock, Shield } from 'lucide-react';

export default function ClientRegisterForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  const registerForm = useForm<ClientRegisterRequest>();
  const verifyForm = useForm<EmailVerificationRequest>();

  const onRegisterSubmit = async (data: ClientRegisterRequest) => {
    setLoading(true);
    try {
      const result = await registerClient(data);
      setEmail(data.email);
      
      if (result.success && result.data.verification_sent) {
        toast.success('Регистрация успешна! Проверьте email для подтверждения.');
        setStep('verify');
      } else {
        toast.success('Регистрация успешна! Войдите в аккаунт.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка регистрации');
    } finally {
      setLoading(false);
    }
  };

  const onVerifySubmit = async (data: EmailVerificationRequest) => {
    setLoading(true);
    try {
      const result = await confirmEmailVerification({
        code: data.code,
        email: email
      });
      
      if (result.success) {
        toast.success('Email подтвержден! Теперь можно войти в аккаунт.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка подтверждения');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      await requestEmailVerification({ email });
      toast.success('Код подтверждения отправлен повторно!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Ошибка отправки кода');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl shadow-lg mb-6">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">StudioBooking</h1>
            <p className="text-gray-600 font-light">Подтвердите email</p>
          </div>

          {/* Verification Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-4">
                Мы отправили код подтверждения на email: <strong>{email}</strong>
              </p>
            </div>

            <form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Код подтверждения
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Введите код из email"
                    {...verifyForm.register('code', { 
                      required: 'Код обязателен',
                      minLength: { value: 4, message: 'Минимум 4 символа' }
                    })}
                    className="w-full pl-4 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                {verifyForm.formState.errors.code && (
                  <p className="mt-1 text-sm text-red-500">{verifyForm.formState.errors.code.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    Подтверждение...
                  </div>
                ) : (
                  'Подтвердить email'
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={loading}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors disabled:opacity-50"
                >
                  Отправить код повторно
                </button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <Link to="/login" className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                Вернуться к входу
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Registration Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-8">
          <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="your@email.com"
                  {...registerForm.register('email', { 
                    required: 'Email обязателен',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Неверный формат email'
                    }
                  })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              {registerForm.formState.errors.email && (
                <p className="mt-1 text-sm text-red-500">{registerForm.formState.errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  placeholder="Минимум 6 символов"
                  {...registerForm.register('password', { 
                    required: 'Пароль обязателен',
                    minLength: { value: 6, message: 'Минимум 6 символов' }
                  })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              {registerForm.formState.errors.password && (
                <p className="mt-1 text-sm text-red-500">{registerForm.formState.errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary-500 to-secondary-500 text-white py-3 rounded-xl font-medium hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Регистрация...
                </div>
              ) : (
                'Зарегистрироваться'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                Войдите
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link 
              to="/studio-register" 
              className="text-sm text-gray-600 hover:text-primary-600 transition-colors"
            >
              Зарегистрировать студию →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
