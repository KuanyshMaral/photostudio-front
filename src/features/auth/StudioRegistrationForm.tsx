import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import StepIndicator from '../../components/StepIndicator';
import Step1PersonalData from '../../components/steps/Step1PersonalData';
import Step2CompanyData from '../../components/steps/Step2CompanyData';
import Step3Documents from '../../components/steps/Step3Documents';
import { registerStudioOwner } from './auth.api';

type Step = 1 | 2 | 3;

interface FormData {
  // Step 1
  name: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  // Step 2
  bin: string;
  address: string;
  contactPerson: string;
  // Step 3
  documents: File[];
}

export default function StudioRegistrationForm() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Обновление данных формы
  const updateFormData = (data: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  // Возврат к предыдущему шагу
  const prevStep = () => {
    if (step > 1) setStep((step - 1) as Step);
  };

  // Переход к следующему шагу
  const nextStep = () => {
    if (step < 3) setStep((step + 1) as Step);
  };
  // Финальная отправка
  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Отправляем все данные за один раз как ожидает бэкенд
      await registerStudioOwner({
        name: formData.name || formData.contactPerson || '',
        email: formData.email!,
        phone: formData.phone!,
        password: formData.password!,
        company_name: formData.companyName!,
        bin: formData.bin!,
        legal_address: formData.address!,
        contact_person: formData.contactPerson!
      });

      // Загружаем документы если есть
      if (formData.documents?.length) {
        // Note: We need the token for authentication, but we don't have it here
        // This would need to be passed from AuthContext or handled differently
        console.log('Documents need to be uploaded with authentication token');
        // await uploadVerificationDocs(response.user.token, formData.documents);
      }

      toast.success('Заявка отправлена! Ожидайте верификации.');
      navigate('/login');
    } catch (error: any) {
      // Показываем ошибку от API
      const message = error.response?.data?.error?.message || error.message || 'Ошибка регистрации';
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
          <h2 className="auth-title">Регистрация студии</h2>
          <p className="auth-sub">Создайте аккаунт студии</p>
        </header>

        {/* Progress indicator */}
        <StepIndicator currentStep={step} totalSteps={3} />

        {/* Step content */}
        <div className="auth-form">
          {step === 1 && (
            <Step1PersonalData 
              data={formData} 
              onUpdate={updateFormData} 
              onNext={nextStep} 
            />
          )}
          {step === 2 && (
            <Step2CompanyData 
              data={formData} 
              onUpdate={updateFormData} 
              onNext={nextStep}
              onPrev={prevStep}
            />
          )}
          {step === 3 && (
            <Step3Documents 
              data={formData} 
              onUpdate={updateFormData} 
              onSubmit={handleSubmit}
              onPrev={prevStep}
              isLoading={isLoading}
            />
          )}
        </div>

        <footer className="auth-footer">
          <div className="auth-footer-links">
            <small>Уже есть аккаунт? <Link to="/login">Войти</Link></small>
            <small>Регистрация как клиент? <Link to="/register">Регистрация клиента</Link></small>
          </div>
        </footer>
      </div>
    </div>
  );
}