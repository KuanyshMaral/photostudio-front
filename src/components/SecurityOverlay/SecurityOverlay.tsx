import React, { useState, useRef, useEffect } from 'react';
import { Lock, Eye, EyeOff, X } from 'lucide-react';
import './SecurityOverlay.css';

interface SecurityOverlayProps {
  onVerify: (pin: string) => Promise<boolean>;
  onClose: () => void;
  isSettingPIN?: boolean;
}

/**
 * SecurityOverlay — модальное окно для ввода/установки PIN.
 * 
 * Два режима:
 * 1. Верификация (isSettingPIN=false) — ввод 4-6 цифр
 * 2. Установка (isSettingPIN=true) — ввод + подтверждение
 */
export const SecurityOverlay: React.FC<SecurityOverlayProps> = ({
  onVerify,
  onClose,
  isSettingPIN = false,
}) => {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [confirmPin, setConfirmPin] = useState(['', '', '', '', '', '']);
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'enter' | 'confirm'>('enter');
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const confirmRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Фокус на первый input при открытии
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  // Обработка ввода цифры
  const handleInput = (
    index: number, 
    value: string, 
    isConfirm: boolean = false
  ) => {
    // Только цифры
    if (value && !/^\d$/.test(value)) return;

    const setter = isConfirm ? setConfirmPin : setPin;
    const refs = isConfirm ? confirmRefs : inputRefs;
    const current = isConfirm ? confirmPin : pin;

    const newPin = [...current];
    newPin[index] = value;
    setter(newPin);

    // Автопереход к следующему полю
    if (value && index < 5) {
      refs.current[index + 1]?.focus();
    }

    // Автоотправка при заполнении 4-6 цифр
    const filledCount = newPin.filter(d => d !== '').length;
    if (filledCount >= 4 && !newPin.slice(0, filledCount).includes('')) {
      if (isSettingPIN && step === 'enter') {
        // Переход к подтверждению
        setTimeout(() => {
          setStep('confirm');
          confirmRefs.current[0]?.focus();
        }, 300);
      } else if (isSettingPIN && step === 'confirm') {
        handleSubmit(newPin.join(''), true);
      } else {
        handleSubmit(newPin.join(''), false);
      }
    }
  };

  // Backspace
  const handleKeyDown = (
    index: number, 
    e: React.KeyboardEvent, 
    isConfirm: boolean = false
  ) => {
    const refs = isConfirm ? confirmRefs : inputRefs;
    const setter = isConfirm ? setConfirmPin : setPin;
    const current = isConfirm ? confirmPin : pin;

    if (e.key === 'Backspace' && !current[index] && index > 0) {
      refs.current[index - 1]?.focus();
      const newPin = [...current];
      newPin[index - 1] = '';
      setter(newPin);
    }
  };

  const handleSubmit = async (pinValue: string, isConfirmStep: boolean) => {
    setError('');
    
    if (isSettingPIN && isConfirmStep) {
      // Проверяем совпадение PIN-ов
      const originalPin = pin.filter(d => d !== '').join('');
      if (pinValue !== originalPin) {
        setError('PIN-коды не совпадают');
        setConfirmPin(['', '', '', '', '', '']);
        confirmRefs.current[0]?.focus();
        return;
      }
    }

    setIsLoading(true);
    try {
      const success = await onVerify(pinValue);
      if (!success) {
        setError('Неверный PIN-код');
        setPin(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError('Ошибка проверки PIN');
    } finally {
      setIsLoading(false);
    }
  };

  const renderPinInputs = (
    values: string[], 
    refs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    isConfirm: boolean = false
  ) => (
    <div className="security-overlay__inputs">
      {values.map((digit, index) => (
        <input
          key={index}
          ref={el => {
            refs.current[index] = el;
          }}
          type={showPin ? 'text' : 'password'}
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={e => handleInput(index, e.target.value, isConfirm)}
          onKeyDown={e => handleKeyDown(index, e, isConfirm)}
          className={`security-overlay__input ${digit ? 'filled' : ''}`}
          disabled={isLoading}
        />
      ))}
    </div>
  );

  return (
    <div className="security-overlay">
      <div className="security-overlay__backdrop" onClick={onClose} />
      
      <div className="security-overlay__modal">
        <button className="security-overlay__close" onClick={onClose}>
          <X size={20} />
        </button>

        <div className="security-overlay__icon">
          <Lock size={48} />
        </div>

        <h2 className="security-overlay__title">
          {isSettingPIN 
            ? (step === 'enter' ? 'Установите PIN-код' : 'Подтвердите PIN-код')
            : 'Введите PIN-код'
          }
        </h2>
        
        <p className="security-overlay__subtitle">
          {isSettingPIN
            ? 'PIN-код защитит доступ к вашей CRM-панели'
            : 'Для доступа к CRM-панели введите ваш PIN'
          }
        </p>

        {step === 'enter' && renderPinInputs(pin, inputRefs)}
        {step === 'confirm' && renderPinInputs(confirmPin, confirmRefs, true)}

        <button
          className="security-overlay__toggle-visibility"
          onClick={() => setShowPin(!showPin)}
          type="button"
        >
          {showPin ? <EyeOff size={18} /> : <Eye size={18} />}
          {showPin ? 'Скрыть' : 'Показать'}
        </button>

        {error && (
          <div className="security-overlay__error">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="security-overlay__loading">
            Проверка...
          </div>
        )}
      </div>
    </div>
  );
};

export default SecurityOverlay;
