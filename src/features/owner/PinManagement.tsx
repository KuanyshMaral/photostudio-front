import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { hasPin, setPin, verifyPin, type PinStatus } from './owner.api';
import { Lock } from 'lucide-react';
import './OwnerDashboard.css';

export default function PinManagement() {
  const { token } = useAuth();
  const [pinStatus, setPinStatus] = useState<PinStatus | null>(null);
  const [pinForm, setPinForm] = useState({ pin: '', verifyPin: '' });

  // Load PIN status
  useEffect(() => {
    const loadPinStatus = async () => {
      if (!token) return;
      try {
        const data = await hasPin(token);
        console.log('PIN status API response:', data);
        setPinStatus(data);
      } catch (error) {
        console.error('Failed to load PIN status:', error);
      }
    };
    loadPinStatus();
  }, [token]);

  const handleSetPin = async () => {
    if (!token || pinForm.pin.length < 4 || pinForm.pin.length > 6) {
      alert('PIN должен содержать 4-6 цифр');
      return;
    }
    try {
      await setPin(token, pinForm.pin);
      setPinStatus({ data: { has_pin: true }, success: true });
      setPinForm({ pin: '', verifyPin: '' });
      alert('PIN успешно установлен');
    } catch (error) {
      console.error('Failed to set PIN:', error);
      alert('Не удалось установить PIN');
    }
  };

  const handleVerifyPin = async () => {
    if (!token) return;
    try {
      await verifyPin(token, pinForm.verifyPin);
      alert('PIN успешно проверен');
    } catch (error) {
      console.error('Failed to verify PIN:', error);
      alert('Неверный PIN');
    }
  };

  return (
    <div className="tab-content">
      <div className="content-header">
        <h2>PIN-код безопасности</h2>
      </div>
      
      <div className="pin-section">
        <div className="pin-status">
          <Lock size={48} />
          <h3>
            {pinStatus?.data?.has_pin ? 'PIN-код установлен' : 'PIN-код не установлен'}
          </h3>
          <p>
            {pinStatus?.data?.has_pin 
              ? 'Вы можете проверить существующий PIN-код или установить новый' 
              : 'Установите PIN-код для дополнительной безопасности'}
          </p>
        </div>

        {!pinStatus?.data?.has_pin && (
          <div className="pin-setup">
            <h4>Установка PIN-кода</h4>
            <div className="form-group">
              <label>PIN-код (4-6 цифр)</label>
              <input
                type="password"
                value={pinForm.pin}
                onChange={(e) => setPinForm({ ...pinForm, pin: e.target.value.replace(/\D/g, '') })}
                placeholder="Введите PIN-код"
                maxLength={6}
              />
            </div>
            <button className="btn-primary" onClick={handleSetPin}>
              Установить PIN
            </button>
          </div>
        )}

        {pinStatus?.data?.has_pin && (
          <div className="pin-verify">
            <h4>Проверка PIN-кода</h4>
            <div className="form-group">
              <label>Введите PIN-код</label>
              <input
                type="password"
                value={pinForm.verifyPin}
                onChange={(e) => setPinForm({ ...pinForm, verifyPin: e.target.value.replace(/\D/g, '') })}
                placeholder="Введите PIN-код"
                maxLength={6}
              />
            </div>
            <button className="btn-primary" onClick={handleVerifyPin}>
              Проверить PIN
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
