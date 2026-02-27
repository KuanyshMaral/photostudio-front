import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getProcurementRecords,
  createProcurementRecord,
  updateProcurementRecord,
  deleteProcurementRecord,
  type ProcurementRecord,
  type ProcurementListResponse
} from './owner.api';
import { Plus, Edit, Trash2, Check } from 'lucide-react';
import './OwnerDashboard.css';

export default function Procurement() {
  const { token } = useAuth();
  const [records, setRecords] = useState<ProcurementRecord[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    quantity: 1,
    est_cost: 0,
    priority: 'medium' as 'low' | 'medium' | 'high',
    due_date: ''
  });

  // Load records
  useEffect(() => {
    const loadRecords = async () => {
      if (!token) return;
      try {
        const data: ProcurementListResponse = await getProcurementRecords(token, showCompleted);
        console.log('Procurement API response:', data);
        // API returns {data: {items: [...]}, success: true}
        setRecords(data.data?.items || []);
      } catch (error) {
        console.error('Failed to load procurement records:', error);
        setRecords([]);
      }
    };
    loadRecords();
  }, [token, showCompleted]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'delivered': return '#3b82f6';
      case 'ordered': return '#f59e0b';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  // Handlers
  const handleCreate = async () => {
    if (!token) return;
    try {
      const record = await createProcurementRecord(token, form);
      setRecords([record, ...(records || [])]);
      setForm({
        title: '',
        description: '',
        quantity: 1,
        est_cost: 0,
        priority: 'medium',
        due_date: ''
      });
      setShowForm(false);
      alert('Закупка создана');
    } catch (error) {
      console.error('Failed to create procurement record:', error);
      alert('Не удалось создать закупку');
    }
  };

  const handleUpdate = async (id: number, updates: Partial<ProcurementRecord>) => {
    if (!token) return;
    try {
      const updated = await updateProcurementRecord(token, id, updates);
      setRecords((records || []).map(r => r.id === id ? updated : r));
    } catch (error) {
      console.error('Failed to update procurement record:', error);
      alert('Не удалось обновить закупку');
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm('Удалить эту закупку?')) return;
    try {
      await deleteProcurementRecord(token, id);
      setRecords((records || []).filter(r => r.id !== id));
    } catch (error) {
      console.error('Failed to delete procurement record:', error);
      alert('Не удалось удалить закупку');
    }
  };

  return (
    <div className="tab-content">
      <div className="content-header">
        <h2>Закупки</h2>
        <div className="header-actions">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={showCompleted}
              onChange={(e) => setShowCompleted(e.target.checked)}
            />
            Показать завершенные
          </label>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} /> Добавить
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Новая закупка</h3>
              <button onClick={() => setShowForm(false)} className="close-button">×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Название</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Описание</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Количество</label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="form-group">
                  <label>Стоимость</label>
                  <input
                    type="number"
                    value={form.est_cost}
                    onChange={(e) => setForm({ ...form, est_cost: parseFloat(e.target.value) || 0 })}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Приоритет</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                  >
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Срок поставки</label>
                  <input
                    type="date"
                    value={form.due_date}
                    onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-secondary" onClick={() => setShowForm(false)}>
                Отмена
              </button>
              <button className="btn-primary" onClick={handleCreate}>
                Создать
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="records-list">
        {(records || []).length > 0 ? (
          (records || []).map(record => (
            <div key={record.id} className="record-card">
              <div className="record-header">
                <h4>{record.title}</h4>
                <div className="record-badges">
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getPriorityColor(record.priority) }}
                  >
                    {record.priority === 'high' ? 'Высокий' : record.priority === 'medium' ? 'Средний' : 'Низкий'}
                  </span>
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(record.is_completed ? 'completed' : 'pending') }}
                  >
                    {record.is_completed ? 'Завершено' : 'Ожидает'}
                  </span>
                </div>
              </div>
              <p>{record.description}</p>
              <div className="record-details">
                <span><strong>Количество:</strong> {record.quantity}</span>
                <span><strong>Стоимость:</strong> {record.est_cost?.toLocaleString() || 0} ₸</span>
                <span><strong>Срок:</strong> {record.due_date ? new Date(record.due_date).toLocaleDateString('ru-RU') : 'Не указан'}</span>
              </div>
              <div className="record-actions">
                {!record.is_completed && (
                  <button 
                    className="btn-small btn-primary"
                    onClick={() => handleUpdate(record.id, { is_completed: true })}
                  >
                    <Check size={14} /> Завершить
                  </button>
                )}
                <button 
                  className="btn-small btn-danger"
                  onClick={() => handleDelete(record.id)}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Нет закупок</p>
        )}
      </div>
    </div>
  );
}
