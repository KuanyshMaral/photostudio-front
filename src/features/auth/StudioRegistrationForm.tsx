import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerStudio } from './auth.api';
import toast from 'react-hot-toast';

const StudioRegistrationForm: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '', // Added phone field
    companyName: '',
    bin: '',
    address: '',
    contactPerson: '',
    documents: [] as File[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateStep = (currentStep: number): boolean => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.email) newErrors.email = 'Email обязателен';
      if (!formData.password) newErrors.password = 'Пароль обязателен';
      if (!formData.phone) newErrors.phone = 'Телефон обязателен';
      if (!formData.companyName) newErrors.companyName = 'Название компании обязательно';
    } else if (currentStep === 2) {
      if (!formData.bin) newErrors.bin = 'БИН обязателен';
      if (!formData.address) newErrors.address = 'Адрес обязателен';
      if (!formData.contactPerson) newErrors.contactPerson = 'Контактное лицо обязательно';
    } else if (currentStep === 3) {
      if (formData.documents.length === 0) newErrors.documents = 'Требуется хотя бы один документ';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    if (validateStep(step)) {
      setError(null);
      setLoading(true);
      try {
        await registerStudio(formData);
        toast.success('Регистрация студии отправлена! Мы проверим ваши документы.');
        navigate('/login');
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ошибка регистрации студии';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData({ ...formData, documents: files });
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <header className="auth-header">
          <div className="auth-logo">StudioBooking</div>
          <h2 className="auth-title">Регистрация студии</h2>
          <p className="auth-sub">Создайте аккаунт студии</p>
        </header>

        {/* Step Indicators */}
        <div className="step-indicators">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`step-indicator ${step >= s ? 'active' : ''}`}>
              {s}
            </div>
          ))}
        </div>

        <form className="auth-form" onSubmit={(e) => e.preventDefault()}>
          {step === 1 && (
            <>
              <h3 className="step-title">Детали аккаунта</h3>
              <label className="auth-label">
                <span className="visually-hidden">Электронная почта</span>
                <input
                  className="auth-input"
                  type="email"
                  name="email"
                  placeholder="Электронная почта"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <p className="auth-error">{errors.email}</p>}
              </label>
              <label className="auth-label">
                <span className="visually-hidden">Пароль</span>
                <input
                  className="auth-input"
                  type="password"
                  name="password"
                  placeholder="Пароль"
                  value={formData.password}
                  onChange={handleChange}
                />
                {errors.password && <p className="auth-error">{errors.password}</p>}
              </label>
              <label className="auth-label">
                <span className="visually-hidden">Телефон</span>
                <input
                  className="auth-input"
                  type="tel"
                  name="phone"
                  placeholder="Телефон"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <p className="auth-error">{errors.phone}</p>}
              </label>
              <label className="auth-label">
                <span className="visually-hidden">Название компании</span>
                <input
                  className="auth-input"
                  type="text"
                  name="companyName"
                  placeholder="Название компании"
                  value={formData.companyName}
                  onChange={handleChange}
                />
                {errors.companyName && <p className="auth-error">{errors.companyName}</p>}
              </label>
            </>
          )}

          {step === 2 && (
            <>
              <h3 className="step-title">Детали бизнеса</h3>
              <label className="auth-label">
                <span className="visually-hidden">БИН</span>
                <input
                  className="auth-input"
                  type="text"
                  name="bin"
                  placeholder="Бизнес идентификационный номер"
                  value={formData.bin}
                  onChange={handleChange}
                />
                {errors.bin && <p className="auth-error">{errors.bin}</p>}
              </label>
              <label className="auth-label">
                <span className="visually-hidden">Адрес</span>
                <textarea
                  className="auth-input"
                  name="address"
                  placeholder="Адрес"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                />
                {errors.address && <p className="auth-error">{errors.address}</p>}
              </label>
              <label className="auth-label">
                <span className="visually-hidden">Контактное лицо</span>
                <input
                  className="auth-input"
                  type="text"
                  name="contactPerson"
                  placeholder="Контактное лицо"
                  value={formData.contactPerson}
                  onChange={handleChange}
                />
                {errors.contactPerson && <p className="auth-error">{errors.contactPerson}</p>}
              </label>
            </>
          )}

          {step === 3 && (
            <>
              <h3 className="step-title">Загрузка документов</h3>
              <label className="auth-label">
                <span className="visually-hidden">Документы</span>
                <input
                  className="auth-input"
                  type="file"
                  multiple
                  onChange={handleFileChange}
                />
                {errors.documents && <p className="auth-error">{errors.documents}</p>}
              </label>
              {formData.documents.length > 0 && (
                <div className="document-list">
                  <h4>Выбранные документы:</h4>
                  <ul>
                    {formData.documents.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {error && <p className="auth-error">{error}</p>}

          <div className="step-buttons">
            {step > 1 && (
              <button type="button" onClick={handleBack} className="auth-button-secondary">
                Назад
              </button>
            )}
            {step < 3 ? (
              <button type="button" onClick={handleNext} className="auth-button">
                Далее
              </button>
            ) : (
              <button type="button" onClick={handleSubmit} className="auth-button" disabled={loading}>
                {loading ? 'Регистрация...' : 'Зарегистрировать'}
              </button>
            )}
          </div>
        </form>

        <footer className="auth-footer">
          <div className="auth-footer-links">
            <small>Уже есть аккаунт? <Link to="/login">Войти</Link></small>
            <small>Регистрация как клиент? <Link to="/register">Регистрация клиента</Link></small>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default StudioRegistrationForm;