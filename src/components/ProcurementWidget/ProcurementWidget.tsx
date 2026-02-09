import React, { useState, useEffect } from 'react';
import { Plus, ShoppingCart, Check, Trash2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ProcurementWidget.css';

interface ProcurementItem {
  id: number;
  title: string;
  description?: string;
  quantity: number;
  est_cost?: number;
  priority: 'low' | 'medium' | 'high';
  is_completed: boolean;
  due_date?: string;
}

interface ProcurementWidgetProps {
  maxItems?: number;
}

export const ProcurementWidget: React.FC<ProcurementWidgetProps> = ({ 
  maxItems = 5 
}) => {
  const { token } = useAuth();
  const [items, setItems] = useState<ProcurementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({ title: '', priority: 'medium' });

  useEffect(() => {
    fetchItems();
  }, [token]);

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/v1/owner/procurement?show_completed=false', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data.data?.items || []);
      }
    } catch (error) {
      console.error('Failed to fetch procurement items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!newItem.title.trim()) return;

    try {
      const response = await fetch('/api/v1/owner/procurement', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newItem)
      });

      if (response.ok) {
        fetchItems();
        setNewItem({ title: '', priority: 'medium' });
        setShowAddForm(false);
      }
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleComplete = async (id: number) => {
    try {
      await fetch(`/api/v1/owner/procurement/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ is_completed: true })
      });
      fetchItems();
    } catch (error) {
      console.error('Failed to complete item:', error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/v1/owner/procurement/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchItems();
    } catch (error) {
      console.error('Failed to delete item:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return '#ff6b6b';
      case 'medium': return '#ffc107';
      case 'low': return '#28a745';
      default: return '#888';
    }
  };

  if (isLoading) {
    return (
      <div className="procurement-widget procurement-widget--loading">
        <div className="procurement-widget__skeleton" />
      </div>
    );
  }

  return (
    <div className="procurement-widget">
      <div className="procurement-widget__header">
        <div className="procurement-widget__title">
          <ShoppingCart size={20} />
          <span>Закупки</span>
        </div>
        <button 
          className="procurement-widget__add-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus size={18} />
        </button>
      </div>

      {showAddForm && (
        <div className="procurement-widget__form">
          <input
            type="text"
            placeholder="Название закупки..."
            value={newItem.title}
            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <select
            value={newItem.priority}
            onChange={e => setNewItem({ ...newItem, priority: e.target.value })}
          >
            <option value="low">Низкий</option>
            <option value="medium">Средний</option>
            <option value="high">Высокий</option>
          </select>
          <button onClick={handleAdd}>Добавить</button>
        </div>
      )}

      {items.length === 0 ? (
        <div className="procurement-widget__empty">
          <AlertCircle size={24} />
          <p>Нет активных закупок</p>
        </div>
      ) : (
        <ul className="procurement-widget__list">
          {items.slice(0, maxItems).map(item => (
            <li key={item.id} className="procurement-widget__item">
              <div 
                className="procurement-widget__priority"
                style={{ background: getPriorityColor(item.priority) }}
              />
              <div className="procurement-widget__content">
                <span className="procurement-widget__name">{item.title}</span>
                {item.quantity > 1 && (
                  <span className="procurement-widget__qty">×{item.quantity}</span>
                )}
              </div>
              <div className="procurement-widget__actions">
                <button 
                  className="procurement-widget__complete"
                  onClick={() => handleComplete(item.id)}
                  title="Выполнено"
                >
                  <Check size={16} />
                </button>
                <button 
                  className="procurement-widget__delete"
                  onClick={() => handleDelete(item.id)}
                  title="Удалить"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {items.length > maxItems && (
        <a href="/owner/procurement" className="procurement-widget__more">
          Показать все ({items.length})
        </a>
      )}
    </div>
  );
};

export default ProcurementWidget;
