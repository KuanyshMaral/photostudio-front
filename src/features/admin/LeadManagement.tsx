import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Users, Search, Phone, Mail, Calendar, CheckCircle, XCircle, Clock, UserCheck, Building, ArrowRight } from 'lucide-react';
import { 
  getAllLeads, 
  getLeadStats, 
  getLeadById, 
  assignLead, 
  markLeadAsContacted, 
  convertLead, 
  rejectLead, 
  updateLeadStatus,
  type Lead, 
  type LeadListResponse, 
  type LeadStats 
} from './leads.api';
import './LeadManagement.css';

export default function LeadManagement() {
  const { token } = useAuth();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const limit = 20;

  useEffect(() => {
    const fetchLeads = async () => {
      if (!token) {
        console.log('LeadManagement: No token, skipping fetch');
        return;
      }
      
      try {
        setLoading(true);
        const data = await getAllLeads(
          token, 
          statusFilter !== 'all' ? statusFilter : undefined,
          limit,
          currentPage * limit
        );
        console.log('LeadManagement: Received data:', data);
        setLeads(data.leads || []);
        setTotal(data.total || 0);
      } catch (error) {
        console.error('Failed to fetch leads:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, [token, statusFilter, currentPage]);

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) {
        console.log('LeadManagement: No token, skipping stats fetch');
        return;
      }
      
      try {
        const statsData = await getLeadStats(token);
        console.log('LeadManagement: Stats data:', statsData);
        setStats(statsData);
      } catch (error) {
        console.error('Failed to fetch lead stats:', error);
      }
    };

    fetchStats();
  }, [token]);

  const filteredLeads = leads.filter(lead => 
    lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusChange = async (leadId: number, newStatus: string) => {
    if (!token) {
      console.error('No token available');
      return;
    }
    
    try {
      await updateLeadStatus(token, leadId, newStatus);
      // Refetch leads
      const data = await getAllLeads(
        token,
        statusFilter !== 'all' ? statusFilter : undefined,
        limit,
        currentPage * limit
      );
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Failed to update lead status:', error);
      alert('Не удалось обновить статус лида');
    }
  };

  const handleMarkContacted = async (leadId: number) => {
    if (!token) {
      console.error('No token available');
      return;
    }
    
    try {
      await markLeadAsContacted(token, leadId);
      // Refetch leads
      const data = await getAllLeads(
        token,
        statusFilter !== 'all' ? statusFilter : undefined,
        limit,
        currentPage * limit
      );
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Failed to mark lead as contacted:', error);
      alert('Не удалось отметить лид как связанный');
    }
  };

  const handleConvert = async (lead: Lead) => {
    if (!token) {
      console.error('No token available');
      return;
    }
    
    try {
      // Ensure bin is a string, extract from object if needed
      let binValue = '';
      if (lead.bin) {
        if (typeof lead.bin === 'string') {
          binValue = lead.bin;
        } else if (typeof lead.bin === 'object' && lead.bin !== null && 'String' in lead.bin) {
          // Handle protobuf-like object structure
          binValue = (lead.bin as any).String;
        } else {
          // Extract string value from object or convert to string
          const objStr = JSON.stringify(lead.bin);
          if (objStr === '{}') {
            binValue = ''; // Empty object becomes empty string
          } else if (objStr.startsWith('"') && objStr.endsWith('"')) {
            binValue = objStr.slice(1, -1); // Remove quotes if it's already a string
          } else {
            binValue = objStr; // Use whole string representation
          }
        }
      }
      
      const conversionData = {
        bin: binValue,
        legal_address: lead.legal_address || '',
        legal_name: lead.company_name || '',
        org_type: 'ip',
        password: Math.random().toString(36).substring(2, 10), // Generate random password
      };
      
      // Validate required fields
      if (!conversionData.legal_name.trim()) {
        alert('Название компании обязательно');
        return;
      }
      
      if (!conversionData.password || conversionData.password.length < 8) {
        alert('Пароль должен содержать минимум 8 символов');
        return;
      }
      
      console.log('LeadManagement: Conversion data:', conversionData);
      
      await convertLead(token, lead.id, conversionData);
      alert('Лид успешно конвертирован в студию!');
      
      // Refetch leads
      const data = await getAllLeads(
        token,
        statusFilter !== 'all' ? statusFilter : undefined,
        limit,
        currentPage * limit
      );
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Failed to convert lead:', error);
      alert('Не удалось конвертировать лид');
    }
  };

  const handleReject = async (leadId: number) => {
    if (!token) {
      console.error('No token available');
      return;
    }
    
    const reason = prompt('Причина отказа:');
    if (!reason) return;
    
    try {
      await rejectLead(token, leadId, reason);
      alert('Лид отклонен');
      
      // Refetch leads
      const data = await getAllLeads(
        token,
        statusFilter !== 'all' ? statusFilter : undefined,
        limit,
        currentPage * limit
      );
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Failed to reject lead:', error);
      alert('Не удалось отклонить лид');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return '#6366f1';
      case 'contacted': return '#3b82f6';
      case 'qualified': return '#8b5cf6';
      case 'converted': return '#10b981';
      case 'rejected': return '#ef4444';
      case 'lost': return '#6b7280';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'new': return 'Новый';
      case 'contacted': return 'Связались';
      case 'qualified': return 'Квалифицирован';
      case 'converted': return 'Конвертирован';
      case 'rejected': return 'Отклонен';
      case 'lost': return 'Потерян';
      default: return status;
    }
  };

  const totalPages = Math.ceil(total / limit);

  // Show loading state if no token
  if (!token) {
    return (
      <div className="lead-management--loading">
        <p>Требуется авторизация для доступа к управлению лидами</p>
      </div>
    );
  }

  if (loading) {
    return <div className="lead-management--loading">Загрузка лидов...</div>;
  }

  return (
    <div className="lead-management">
      <div className="lead-management__header">
        <h1>
          <Users size={28} />
          Управление лидами
        </h1>
        
        {/* Statistics Cards */}
        {stats && (
          <div className="stats-cards">
            <div className="stat-card new">
              <div className="stat-icon"><Users size={24} /></div>
              <div className="stat-content">
                <div className="stat-number">{stats.new}</div>
                <div className="stat-label">Новые</div>
              </div>
            </div>
            <div className="stat-card contacted">
              <div className="stat-icon"><Phone size={24} /></div>
              <div className="stat-content">
                <div className="stat-number">{stats.contacted}</div>
                <div className="stat-label">Связались</div>
              </div>
            </div>
            <div className="stat-card qualified">
              <div className="stat-icon"><CheckCircle size={24} /></div>
              <div className="stat-content">
                <div className="stat-number">{stats.qualified}</div>
                <div className="stat-label">Квалифицированы</div>
              </div>
            </div>
            <div className="stat-card converted">
              <div className="stat-icon"><Building size={24} /></div>
              <div className="stat-content">
                <div className="stat-number">{stats.converted}</div>
                <div className="stat-label">Конвертированы</div>
              </div>
            </div>
            <div className="stat-card rejected">
              <div className="stat-icon"><XCircle size={24} /></div>
              <div className="stat-content">
                <div className="stat-number">{stats.rejected}</div>
                <div className="stat-label">Отклонены</div>
              </div>
            </div>
            <div className="stat-card lost">
              <div className="stat-icon"><Clock size={24} /></div>
              <div className="stat-content">
                <div className="stat-number">{stats.lost}</div>
                <div className="stat-label">Потеряны</div>
              </div>
            </div>
          </div>
        )}

        <div className="lead-management__filters">
          <div className="filter-group">
            <Search size={16} />
            <input 
              type="text" 
              placeholder="Поиск по компании, имени или email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Все статусы</option>
            <option value="new">Новые</option>
            <option value="contacted">Связались</option>
            <option value="qualified">Квалифицированы</option>
            <option value="converted">Конвертированы</option>
            <option value="rejected">Отклонены</option>
            <option value="lost">Потеряны</option>
          </select>
        </div>
      </div>
      
      <div className="leads-table-wrapper">
        <table className="leads-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Компания</th>
              <th>Контактное лицо</th>
              <th>Email</th>
              <th>Телефон</th>
              <th>Статус</th>
              <th>Создан</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id} className="lead-row">
                <td>{lead.id}</td>
                <td>
                  <div className="company-info">
                    <strong>{lead.company_name}</strong>
                    {lead.bin && (
                      <span className="bin">
                        БИН: {typeof lead.bin === 'string' ? lead.bin : JSON.stringify(lead.bin)}
                      </span>
                    )}
                  </div>
                </td>
                <td>{lead.contact_name}</td>
                <td>
                  <div className="contact-info">
                    <Mail size={14} />
                    <span>{lead.contact_email}</span>
                  </div>
                </td>
                <td>
                  <div className="contact-info">
                    <Phone size={14} />
                    <span>{lead.contact_phone}</span>
                  </div>
                </td>
                <td>
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(lead.status) }}
                  >
                    {getStatusText(lead.status)}
                  </span>
                </td>
                <td>{new Date(lead.created_at).toLocaleDateString('ru-RU')}</td>
                <td>
                  <div className="action-buttons">
                    {lead.status === 'new' && (
                      <button 
                        className="action-button contact"
                        onClick={() => handleMarkContacted(lead.id)}
                        title="Отметить как связанный"
                      >
                        <Phone size={14} />
                      </button>
                    )}
                    
                    {lead.status === 'contacted' && (
                      <button 
                        className="action-button convert"
                        onClick={() => handleConvert(lead)}
                        title="Конвертировать в студию"
                      >
                        <Building size={14} />
                      </button>
                    )}
                    
                    <button 
                      className="action-button reject"
                      onClick={() => handleReject(lead.id)}
                      title="Отклонить лид"
                    >
                      <XCircle size={14} />
                    </button>
                    
                    <button 
                      className="action-button details"
                      onClick={() => setSelectedLead(lead)}
                      title="Подробнее"
                    >
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredLeads.length === 0 && (
          <div className="no-leads">
            <Users size={48} />
            <p>Лиды не найдены</p>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button 
              disabled={currentPage === 0}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Назад
            </button>
            <span className="page-info">
              Страница {currentPage + 1} из {totalPages}
            </span>
            <button 
              disabled={currentPage >= totalPages - 1}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Вперед
            </button>
          </div>
        )}
      </div>
      
      {/* Lead Details Modal */}
      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Детали лида #{selectedLead.id}</h3>
              <button className="close-button" onClick={() => setSelectedLead(null)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="lead-details">
                <div className="detail-row">
                  <strong>Компания:</strong> {selectedLead.company_name}
                </div>
                <div className="detail-row">
                  <strong>БИН:</strong> {selectedLead.bin ? (typeof selectedLead.bin === 'string' ? selectedLead.bin : JSON.stringify(selectedLead.bin)) : 'Не указан'}
                </div>
                <div className="detail-row">
                  <strong>Контактное лицо:</strong> {selectedLead.contact_name}
                </div>
                <div className="detail-row">
                  <strong>Email:</strong> {selectedLead.contact_email}
                </div>
                <div className="detail-row">
                  <strong>Телефон:</strong> {selectedLead.contact_phone}
                </div>
                <div className="detail-row">
                  <strong>Юридический адрес:</strong> {selectedLead.legal_address}
                </div>
                <div className="detail-row">
                  <strong>Статус:</strong> 
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(selectedLead.status) }}
                  >
                    {getStatusText(selectedLead.status)}
                  </span>
                </div>
                <div className="detail-row">
                  <strong>Источник:</strong> {selectedLead.source || 'Не указан'}
                </div>
                <div className="detail-row">
                  <strong>Как нашли:</strong> {selectedLead.how_found_us || 'Не указано'}
                </div>
                <div className="detail-row">
                  <strong>Заметки:</strong> {selectedLead.notes || 'Нет заметок'}
                </div>
                <div className="detail-row">
                  <strong>Кол-во контактов:</strong> {selectedLead.follow_up_count}
                </div>
                {selectedLead.last_contacted_at && (
                  <div className="detail-row">
                    <strong>Последний контакт:</strong> {new Date(selectedLead.last_contacted_at).toLocaleString('ru-RU')}
                  </div>
                )}
                {selectedLead.next_follow_up_at && (
                  <div className="detail-row">
                    <strong>След. контакт:</strong> {new Date(selectedLead.next_follow_up_at).toLocaleString('ru-RU')}
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button onClick={() => setSelectedLead(null)} className="btn-secondary">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
