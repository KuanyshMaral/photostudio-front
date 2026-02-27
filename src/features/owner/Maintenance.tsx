import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getMaintenanceRecords,
  createMaintenanceRecord,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  type MaintenanceRecord,
  type MaintenanceListResponse
} from './owner.api';
import { Plus, Edit, Trash2, Check, Clock } from 'lucide-react';
import './OwnerDashboard.css';

export default function Maintenance() {
  const { token } = useAuth();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    assigned_to: '',
    due_date: ''
  });

  // Load records
  useEffect(() => {
    const loadRecords = async () => {
      if (!token) return;
      try {
        setLoading(true);
        setError(null);
        const data = await getMaintenanceRecords(token);
        console.log('API response:', data);
        // API returns {data: {items: [...]}} but we expect {records: [...]}
        setRecords(data.data?.items || []);
      } catch (error) {
        console.error('Failed to load maintenance records:', error);
        setError('Не удалось загрузить записи об обслуживании');
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };
    loadRecords();
  }, [token]);

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
      case 'in_progress': return '#3b82f6';
      case 'pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  // Handlers
  const handleCreate = async () => {
    if (!token) return;
    try {
      const record = await createMaintenanceRecord(token, {
        ...form,
        status: 'pending'
      });
      setRecords([record, ...(records || [])]);
      setForm({
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: '',
        due_date: ''
      });
      setShowForm(false);
      alert('Запись об обслуживании создана');
    } catch (error) {
      console.error('Failed to create maintenance record:', error);
      alert('Не удалось создать запись');
    }
  };

  const handleUpdate = async (id: number, updates: Partial<MaintenanceRecord>) => {
    if (!token) return;
    try {
      const updated = await updateMaintenanceRecord(token, id, updates);
      setRecords((records || []).map(r => r.id === id ? updated : r));
    } catch (error) {
      console.error('Failed to update maintenance record:', error);
      alert('Не удалось обновить запись');
    }
  };

  const handleDelete = async (id: number) => {
    if (!token) return;
    if (!confirm('Удалить эту запись?')) return;
    try {
      await deleteMaintenanceRecord(token, id);
      setRecords((records || []).filter(r => r.id !== id));
    } catch (error) {
      console.error('Failed to delete maintenance record:', error);
      alert('Не удалось удалить запись');
    }
  };

  // Filter records based on selected filter
  const filteredRecords = records.filter(record => {
    if (filter === 'all') return true;
    return record.status === filter;
  });

  console.log('Current records:', records);
  console.log('Filtered records:', filteredRecords, 'Filter:', filter);

  if (loading) {
    return <div className="tab-content">Загрузка записей об обслуживании...</div>;
  }

  if (error) {
    return <div className="tab-content">
      <h2>Обслуживание</h2>
      <div style={{ color: 'red', padding: '20px' }}>{error}</div>
    </div>;
  }

  return (
    <div className="tab-content">
      <div className="content-header">
        <h2>Обслуживание</h2>
        <div className="header-actions">
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value as any)}
            className="filter-select"
          >
            <option value="all">Все</option>
            <option value="pending">Ожидают</option>
            <option value="in_progress">В процессе</option>
            <option value="completed">Завершены</option>
          </select>
          <button className="btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={16} /> Добавить
          </button>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Новая запись об обслуживании</h3>
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
                  <label>Ответственный</label>
                  <input
                    type="text"
                    value={form.assigned_to}
                    onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Срок</label>
                <input
                  type="date"
                  value={form.due_date}
                  onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                />
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
        {filteredRecords.length > 0 ? (
          filteredRecords.map(record => (
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
                    style={{ backgroundColor: getStatusColor(record.status) }}
                  >
                    {record.status === 'pending' ? 'Ожидает' : 
                     record.status === 'in_progress' ? 'В процессе' : 'Завершено'}
                  </span>
                </div>
              </div>
              <p>{record.description}</p>
              {record.assigned_to && (
                <p><strong>Ответственный:</strong> {record.assigned_to}</p>
              )}
              <p><strong>Срок:</strong> {record.due_date ? new Date(record.due_date).toLocaleDateString('ru-RU') : 'Не указан'}</p>
              <div className="record-actions">
                {record.status !== 'completed' && (
                  <button 
                    className="btn-small btn-success"
                    onClick={() => handleUpdate(record.id, { status: 'completed' })}
                  >
                    <Check size={14} /> Завершить
                  </button>
                )}
                {record.status === 'pending' && (
                  <button 
                    className="btn-small btn-primary"
                    onClick={() => handleUpdate(record.id, { status: 'in_progress' })}
                  >
                    <Clock size={14} /> В работу
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
          <p>
            {filter === 'all' 
              ? 'Нет записей об обслуживании' 
              : `Нет записей со статусом "${filter === 'pending' ? 'Ожидают' : filter === 'in_progress' ? 'В процессе' : 'Завершено'}"`
            }
          </p>
        )}
      </div>
    </div>
  );
}
