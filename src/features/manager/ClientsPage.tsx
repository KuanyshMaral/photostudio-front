import React, { useState, useEffect } from 'react';
import { Search, Users, Phone, Mail, Calendar, DollarSign } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './ClientsPage.css';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  total_bookings?: number;
  total_spent?: number;
  last_booking_at?: string;
  role?: string;
}

export const ClientsPage: React.FC = () => {
  const { token } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const perPage = 20;

  useEffect(() => {
    fetchClients();
  }, [token, page, search]);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        per_page: String(perPage)
      });
      if (search) params.append('search', search);

      console.log('Fetching clients with params:', params.toString());

      // Используем правильный эндпоинт для владельцев студий
      const response = await fetch(`/api/v1/manager/clients?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log(`/api/v1/manager/clients?${params} response:`, response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Clients data:', data);
        
        // Данные уже в правильном формате от API
        const clientsData = data.data?.clients || data.clients || [];
        console.log('Clients from API:', clientsData);
        
        // Если есть поиск, дополнительно фильтруем по имени/email/телефону
        let filteredClients = clientsData;
        if (search) {
          const searchLower = search.toLowerCase();
          filteredClients = clientsData.filter((client: any) => 
            client.name.toLowerCase().includes(searchLower) ||
            client.email.toLowerCase().includes(searchLower) ||
            (client.phone && client.phone.toLowerCase().includes(searchLower))
          );
        }
        
        setClients(filteredClients);
        setTotal(data.total || filteredClients.length);
      } else {
        console.log('Failed to load users, trying empty clients array');
        setClients([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      setClients([]);
      setTotal(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchClients();
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('ru-RU');
  };

  const totalPages = Math.ceil(total / perPage);

  return (
    <div className="clients-page">
      <div className="clients-page__header">
        <h1>
          <Users size={24} />
          Клиенты
        </h1>
        <div className="clients-page__stats">
          <span>Всего: {total}</span>
        </div>
      </div>

      <form className="clients-page__search" onSubmit={handleSearch}>
        <div className="search-input-group">
          <Search size={18} />
          <input
            type="text"
            placeholder="Поиск по имени, email или телефону..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button type="submit">Найти</button>
      </form>

      {isLoading ? (
        <div className="clients-page__loading">Загрузка...</div>
      ) : clients.length === 0 ? (
        <div className="clients-page__empty">
          <Users size={48} />
          <p>Клиенты не найдены</p>
        </div>
      ) : (
        <>
          <table className="clients-table">
            <thead>
              <tr>
                <th>Клиент</th>
                <th>Контакты</th>
                <th>Бронирований</th>
                <th>Потрачено</th>
                <th>Последнее</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td>
                    <div className="client-name">
                      <div className="client-avatar">
                        {client.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{client.name}</span>
                    </div>
                  </td>
                  <td>
                    <div className="client-contacts">
                      <a href={`tel:${client.phone}`} className="contact-link">
                        <Phone size={14} />
                        {client.phone}
                      </a>
                      <a href={`mailto:${client.email}`} className="contact-link">
                        <Mail size={14} />
                        {client.email}
                      </a>
                    </div>
                  </td>
                  <td>
                    <div className="stat-cell">
                      <Calendar size={14} />
                      {client.total_bookings || 0}
                    </div>
                  </td>
                  <td>
                    <div className="stat-cell stat-cell--money">
                      <DollarSign size={14} />
                      ₸{(client.total_spent || 0).toLocaleString()}
                    </div>
                  </td>
                  <td>
                    <span className="date-cell">
                      {formatDate(client.last_booking_at)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div className="clients-page__pagination">
              <button 
                disabled={page === 1}
                onClick={() => setPage(p => p - 1)}
              >
                Назад
              </button>
              <span>Страница {page} из {totalPages}</span>
              <button 
                disabled={page >= totalPages}
                onClick={() => setPage(p => p + 1)}
              >
                Далее
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientsPage;
