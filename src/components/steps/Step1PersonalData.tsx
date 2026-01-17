import { useForm } from 'react-hook-form';

interface Step1PersonalDataProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

interface Step1Data {
  name: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
}

export default function Step1PersonalData({ data, onUpdate, onNext }: Step1PersonalDataProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<Step1Data>({
    defaultValues: {
      name: data.name || '',
      email: data.email || '',
      password: data.password || '',
      phone: data.phone || '',
      companyName: data.companyName || ''
    }
  });

  const onSubmit = (formData: Step1Data) => {
    onUpdate(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="step-title text-lg font-semibold mb-4">Личные данные</h3>
      
      <div>
        <label className="auth-label">
          <span className="visually-hidden">Имя</span>
          <input
            type="text"
            {...register('name', {
              required: 'Имя обязательно',
              minLength: {
                value: 2,
                message: 'Минимум 2 символа'
              }
            })}
            className={`auth-input ${errors.name ? 'border-red-500' : ''}`}
            placeholder="Ваше имя"
          />
        </label>
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

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
            className={`auth-input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="Электронная почта"
          />
        </label>
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

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
            className={`auth-input ${errors.password ? 'border-red-500' : ''}`}
            placeholder="Пароль"
          />
        </label>
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="auth-label">
          <span className="visually-hidden">Телефон</span>
          <input
            type="tel"
            {...register('phone', {
              required: 'Телефон обязателен',
              pattern: {
                value: /^\+?[\d\s\-\(\)]+$/,
                message: 'Некорректный номер телефона'
              }
            })}
            className={`auth-input ${errors.phone ? 'border-red-500' : ''}`}
            placeholder="+7 (777) 123-45-67"
          />
        </label>
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="auth-label">
          <span className="visually-hidden">Название компании</span>
          <input
            type="text"
            {...register('companyName', {
              required: 'Название компании обязательно',
              minLength: {
                value: 2,
                message: 'Минимум 2 символа'
              }
            })}
            className={`auth-input ${errors.companyName ? 'border-red-500' : ''}`}
            placeholder="Название компании"
          />
        </label>
        {errors.companyName && (
          <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
        )}
      </div>

      <button
        type="submit"
        className="auth-button w-full flex items-center justify-center gap-2"
      >
        Далее
      </button>
    </form>
  );
}
