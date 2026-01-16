import { useForm } from 'react-hook-form';

interface Step2CompanyDataProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
  onPrev: () => void;
}

interface Step2Data {
  bin: string;
  address: string;
  contactPerson: string;
}

export default function Step2CompanyData({ data, onUpdate, onNext, onPrev }: Step2CompanyDataProps) {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<Step2Data>({
    defaultValues: {
      bin: data.bin || '',
      address: data.address || '',
      contactPerson: data.contactPerson || ''
    }
  });

  const onSubmit = (formData: Step2Data) => {
    onUpdate(formData);
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="step-title text-lg font-semibold mb-4">Данные компании</h3>
      
      <div>
        <label className="auth-label">
          <span className="visually-hidden">БИН</span>
          <input
            type="text"
            {...register('bin', {
              required: 'БИН обязателен',
              pattern: {
                value: /^\d{12}$/,
                message: 'БИН должен состоять из 12 цифр'
              }
            })}
            className={`auth-input ${errors.bin ? 'border-red-500' : ''}`}
            placeholder="Бизнес идентификационный номер (12 цифр)"
          />
        </label>
        {errors.bin && (
          <p className="text-red-500 text-sm mt-1">{errors.bin.message}</p>
        )}
      </div>

      <div>
        <label className="auth-label">
          <span className="visually-hidden">Адрес</span>
          <textarea
            {...register('address', {
              required: 'Адрес обязателен',
              minLength: {
                value: 10,
                message: 'Минимум 10 символов'
              }
            })}
            className={`auth-input ${errors.address ? 'border-red-500' : ''}`}
            placeholder="Юридический адрес компании"
            rows={3}
          />
        </label>
        {errors.address && (
          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
        )}
      </div>

      <div>
        <label className="auth-label">
          <span className="visually-hidden">Контактное лицо</span>
          <input
            type="text"
            {...register('contactPerson', {
              required: 'Контактное лицо обязательно',
              minLength: {
                value: 3,
                message: 'Минимум 3 символа'
              }
            })}
            className={`auth-input ${errors.contactPerson ? 'border-red-500' : ''}`}
            placeholder="ФИО контактного лица"
          />
        </label>
        {errors.contactPerson && (
          <p className="text-red-500 text-sm mt-1">{errors.contactPerson.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onPrev}
          className="auth-button-secondary flex-1"
        >
          Назад
        </button>
        <button
          type="submit"
          className="auth-button flex-1"
        >
          Далее
        </button>
      </div>
    </form>
  );
}
