import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, Mail, Phone, Calendar, 
  CheckCircle, XCircle, Clock, UserPlus, Eye,
  Filter, Search, AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getLeads,
  getLeadStats,
  rejectLead,
  convertLead,
  type OwnerLead,
  type LeadStats
} from './admin.api';

interface ConvertLeadModalProps {
  lead: OwnerLead | null;
  isOpen: boolean;
  onClose: () => void;
  onConvert: (leadId: number, legalName: string, legalAddress: string, password: string, bin?: string) => void;
}

const ConvertLeadModal: React.FC<ConvertLeadModalProps> = ({ lead, isOpen, onClose, onConvert }) => {
  const [legalName, setLegalName] = useState(lead?.company_name || '');
  const [legalAddress, setLegalAddress] = useState(lead?.legal_address || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bin, setBin] = useState(lead?.bin || '');
  const [isLoading, setIsLoading] = useState(false);

  // Update form when lead changes
  useEffect(() => {
    if (lead) {
      setLegalName(lead.company_name);
      setLegalAddress(typeof lead.legal_address === 'string' ? lead.legal_address : '');
      setBin(typeof lead.bin === 'string' ? lead.bin : '');
    }
  }, [lead]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!lead) return;
    
    if (password !== confirmPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    if (password.length < 8) {
      toast.error('Пароль должен содержать минимум 8 символов');
      return;
    }

    setIsLoading(true);
    try {
      await onConvert(lead.id, legalName, legalAddress || '', password, bin);
      onClose();
      setLegalName('');
      setLegalAddress('');
      setPassword('');
      setConfirmPassword('');
      setBin('');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !lead) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Преобразование лида в пользователя</h3>
          <button onClick={onClose} className="modal-close">&times;</button>
        </div>
        
        <div className="modal-body">
          <div className="lead-summary">
            <h4>Информация о лиде</h4>
            <p><strong>Компания:</strong> {lead.company_name}</p>
            <p><strong>Контактное лицо:</strong> {lead.contact_name}</p>
            <p><strong>Email:</strong> {lead.contact_email}</p>
            <p><strong>Телефон:</strong> {lead.contact_phone}</p>
          </div>

          <form onSubmit={handleSubmit} className="convert-form">
            <div className="form-group">
              <label>Юридическое название компании *</label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Юридический адрес *</label>
              <textarea
                value={legalAddress}
                onChange={(e) => setLegalAddress(e.target.value)}
                required
                rows={3}
              />
            </div>

            <div className="form-group">
              <label>БИН (Бизнес идентификационный номер) *</label>
              <input
                type="text"
                value={bin}
                onChange={(e) => setBin(e.target.value)}
                placeholder="Введите 12-значный БИН компании"
                required
                minLength={12}
                maxLength={12}
                pattern="[0-9]{12}"
                title="БИН должен состоять из 12 цифр"
              />
              {lead?.bin && typeof lead.bin === 'string' && (
                <small>Исходный БИН из заявки: {lead.bin}</small>
              )}
              <small>БИН обязателен для создания юридического лица</small>
            </div>

            <div className="form-group">
              <label>Организационная форма *</label>
              <select
                value="ip"
                disabled
                className="form-select"
              >
                <option value="ip">ИП (Индивидуальный предприниматель)</option>
                <option value="llp">ТОО (Товарищество с ограниченной ответственностью)</option>
              </select>
            </div>

            <div className="form-group">
              <label>Пароль для нового пользователя *</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
              <small>Минимум 8 символов</small>
            </div>

            <div className="form-group">
              <label>Подтверждение пароля *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button 
            type="button" 
            onClick={onClose} 
            className="btn-secondary"
            disabled={isLoading}
          >
            Отмена
          </button>
          <button 
            type="submit" 
            onClick={handleSubmit}
            className="btn-primary"
            disabled={isLoading}
          >
            {isLoading ? 'Создание...' : 'Создать пользователя'}
          </button>
        </div>
      </div>
    </div>
  );
};

export const LeadManagement: React.FC = () => {
  const { token } = useAuth();
  const [leads, setLeads] = useState<OwnerLead[]>([]);
  const [stats, setStats] = useState<LeadStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<OwnerLead | null>(null);
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalLeads, setTotalLeads] = useState(0);

  const leadsPerPage = 20;

  useEffect(() => {
    if (token) {
      fetchLeads();
      fetchStats();
    }
  }, [token, statusFilter, currentPage]);

  const fetchLeads = async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const offset = (currentPage - 1) * leadsPerPage;
      const response = await getLeads(token, statusFilter, leadsPerPage, offset);
      setLeads(response.leads);
      setTotalLeads(response.total);
    } catch (error) {
      toast.error('Ошибка при загрузке лидов');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!token) return;
    
    try {
      const statsData = await getLeadStats(token);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to fetch lead stats:', error);
    }
  };

  const handleReject = async (leadId: number, reason: string) => {
    if (!token) return;
    
    try {
      await rejectLead(token, leadId, reason);
      toast.success('Лид отклонен');
      fetchLeads();
      fetchStats();
    } catch (error) {
      toast.error('Ошибка при отклонении лида');
      console.error(error);
    }
  };

  const handleConvert = async (leadId: number, legalName: string, legalAddress: string, password: string, bin?: string) => {
    if (!token) return;
    
    try {
      await convertLead(token, leadId, legalName, legalAddress, password, bin);
      toast.success('Лид успешно преобразован в пользователя');
      fetchLeads();
      fetchStats();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка при преобразовании лида';
      // Ensure we're passing a string to toast.error
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'Ошибка при преобразовании лида');
      console.error(error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'status-new';
      case 'contacted': return 'status-contacted';
      case 'qualified': return 'status-qualified';
      case 'converted': return 'status-converted';
      case 'rejected': return 'status-rejected';
      case 'lost': return 'status-lost';
      default: return 'status-default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'new': return <AlertCircle size={16} />;
      case 'contacted': return <Phone size={16} />;
      case 'qualified': return <CheckCircle size={16} />;
      case 'converted': return <UserPlus size={16} />;
      case 'rejected': return <XCircle size={16} />;
      case 'lost': return <XCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const filteredLeads = leads.filter(lead =>
    lead.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(totalLeads / leadsPerPage);

  return (
    <div className="lead-management">
      <div className="lead-management__header">
        <h1>Управление лидами</h1>
        <p>Обработка заявок от потенциальных владельцев студий</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="lead-stats">
          <div className="stat-card stat-new">
            <div className="stat-icon">{getStatusIcon('new')}</div>
            <div className="stat-content">
              <div className="stat-number">{typeof stats.new === 'number' ? stats.new : 0}</div>
              <div className="stat-label">Новые</div>
            </div>
          </div>
          <div className="stat-card stat-contacted">
            <div className="stat-icon">{getStatusIcon('contacted')}</div>
            <div className="stat-content">
              <div className="stat-number">{typeof stats.contacted === 'number' ? stats.contacted : 0}</div>
              <div className="stat-label">Связались</div>
            </div>
          </div>
          <div className="stat-card stat-qualified">
            <div className="stat-icon">{getStatusIcon('qualified')}</div>
            <div className="stat-content">
              <div className="stat-number">{typeof stats.qualified === 'number' ? stats.qualified : 0}</div>
              <div className="stat-label">Квалифицированы</div>
            </div>
          </div>
          <div className="stat-card stat-converted">
            <div className="stat-icon">{getStatusIcon('converted')}</div>
            <div className="stat-content">
              <div className="stat-number">{typeof stats.converted === 'number' ? stats.converted : 0}</div>
              <div className="stat-label">Преобразованы</div>
            </div>
          </div>
          <div className="stat-card stat-rejected">
            <div className="stat-icon">{getStatusIcon('rejected')}</div>
            <div className="stat-content">
              <div className="stat-number">{typeof stats.rejected === 'number' ? stats.rejected : 0}</div>
              <div className="stat-label">Отклонены</div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="lead-filters">
        <div className="filter-group">
          <Search size={20} />
          <input
            type="text"
            placeholder="Поиск по компании, имени или email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-group">
          <Filter size={20} />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">Все статусы</option>
            <option value="new">Новые</option>
            <option value="contacted">Связались</option>
            <option value="qualified">Квалифицированы</option>
            <option value="converted">Преобразованы</option>
            <option value="rejected">Отклонены</option>
            <option value="lost">Потеряны</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="leads-table-container">
        {isLoading ? (
          <div className="loading">Загрузка...</div>
        ) : (
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
                <tr key={lead.id}>
                  <td>#{lead.id}</td>
                  <td>
                    <div className="company-info">
                      <Building2 size={16} />
                      <span>{lead.company_name}</span>
                    </div>
                  </td>
                  <td>{lead.contact_name}</td>
                  <td>
                    <div className="email-info">
                      <Mail size={16} />
                      <span>{lead.contact_email}</span>
                    </div>
                  </td>
                  <td>
                    <div className="phone-info">
                      <Phone size={16} />
                      <span>{lead.contact_phone}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusColor(lead.status)}`}>
                      {getStatusIcon(lead.status)}
                      {lead.status}
                    </span>
                  </td>
                  <td>
                    <div className="date-info">
                      <Calendar size={16} />
                      <span>{new Date(lead.created_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                  </td>
                  <td>
                    <div className="lead-actions">
                      <button
                        className="btn-icon"
                        onClick={() => setSelectedLead(lead)}
                        title="Просмотр деталей"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {lead.status === 'new' && (
                        <button
                          className="btn-icon"
                          onClick={() => {
                            // Mark as contacted functionality can be added later
                            toast('Функция "Отметить как связанный" будет доступна в следующем обновлении');
                          }}
                          title="Отметить как связанный"
                        >
                          <Phone size={16} />
                        </button>
                      )}
                      
                      {(lead.status === 'new' || lead.status === 'contacted' || lead.status === 'qualified') && (
                        <>
                          <button
                            className="btn-icon btn-success"
                            onClick={() => {
                              setSelectedLead(lead);
                              setShowConvertModal(true);
                            }}
                            title="Преобразовать в пользователя"
                          >
                            <UserPlus size={16} />
                          </button>
                          
                          <button
                            className="btn-icon btn-danger"
                            onClick={() => {
                              const reason = prompt('Причина отклонения:');
                              if (reason) handleReject(lead.id, reason);
                            }}
                            title="Отклонить"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="btn-pagination"
          >
            Назад
          </button>
          
          <span className="page-info">
            Страница {currentPage} из {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="btn-pagination"
          >
            Вперед
          </button>
        </div>
      )}

      {/* Convert Lead Modal */}
      <ConvertLeadModal
        lead={selectedLead!}
        isOpen={showConvertModal && !!selectedLead}
        onClose={() => {
          setShowConvertModal(false);
          setSelectedLead(null);
        }}
        onConvert={handleConvert}
      />

      {/* Lead Details Modal */}
      {selectedLead && !showConvertModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-large">
            <div className="modal-header">
              <h3>Детали лида #{selectedLead.id}</h3>
              <button onClick={() => setSelectedLead(null)} className="modal-close">&times;</button>
            </div>
            
            <div className="modal-body">
              <div className="lead-details">
                <div className="detail-section">
                  <h4>Информация о компании</h4>
                  <p><strong>Название:</strong> {selectedLead.company_name}</p>
                  {selectedLead.bin && <p><strong>БИН:</strong> {selectedLead.bin}</p>}
                  {selectedLead.legal_address && <p><strong>Юридический адрес:</strong> {selectedLead.legal_address}</p>}
                  {selectedLead.website && <p><strong>Сайт:</strong> {selectedLead.website}</p>}
                </div>
                
                <div className="detail-section">
                  <h4>Контактная информация</h4>
                  <p><strong>Имя:</strong> {selectedLead.contact_name}</p>
                  {selectedLead.contact_position && <p><strong>Должность:</strong> {selectedLead.contact_position}</p>}
                  <p><strong>Email:</strong> {selectedLead.contact_email}</p>
                  <p><strong>Телефон:</strong> {selectedLead.contact_phone}</p>
                </div>
                
                <div className="detail-section">
                  <h4>Системная информация</h4>
                  <p><strong>Статус:</strong> <span className={`status-badge ${getStatusColor(selectedLead.status)}`}>{selectedLead.status}</span></p>
                  <p><strong>Приоритет:</strong> {selectedLead.priority}</p>
                  <p><strong>Создан:</strong> {new Date(selectedLead.created_at).toLocaleString('ru-RU')}</p>
                  {selectedLead.last_contacted_at && (
                    <p><strong>Последний контакт:</strong> {new Date(selectedLead.last_contacted_at).toLocaleString('ru-RU')}</p>
                  )}
                  {selectedLead.notes && <p><strong>Заметки:</strong> {selectedLead.notes}</p>}
                </div>
                
                {selectedLead.ip_address && (
                  <div className="detail-section">
                    <h4>Метаданные</h4>
                    <p><strong>IP адрес:</strong> {selectedLead.ip_address}</p>
                    {selectedLead.utm_source && <p><strong>UTM Source:</strong> {selectedLead.utm_source}</p>}
                    {selectedLead.referrer_url && <p><strong>Referrer:</strong> {selectedLead.referrer_url}</p>}
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

      <style>{`
        .lead-management {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .lead-management__header {
          margin-bottom: 32px;
        }

        .lead-management__header h1 {
          font-size: 28px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #1f2937;
        }

        .lead-management__header p {
          color: #6b7280;
          font-size: 16px;
        }

        .lead-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
          margin-bottom: 32px;
        }

        .stat-card {
          display: flex;
          align-items: center;
          padding: 20px;
          border-radius: 12px;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border-left: 4px solid;
        }

        .stat-new { border-left-color: #3b82f6; }
        .stat-contacted { border-left-color: #f59e0b; }
        .stat-qualified { border-left-color: #8b5cf6; }
        .stat-converted { border-left-color: #10b981; }
        .stat-rejected { border-left-color: #ef4444; }

        .stat-icon {
          margin-right: 12px;
          padding: 8px;
          border-radius: 8px;
          background: rgba(0, 0, 0, 0.05);
        }

        .stat-number {
          font-size: 24px;
          font-weight: 700;
          color: #1f2937;
        }

        .stat-label {
          font-size: 14px;
          color: #6b7280;
        }

        .lead-filters {
          display: flex;
          gap: 16px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background: white;
          flex: 1;
          min-width: 250px;
        }

        .filter-group input,
        .filter-group select {
          border: none;
          outline: none;
          flex: 1;
          font-size: 14px;
        }

        .leads-table-container {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .leads-table {
          width: 100%;
          border-collapse: collapse;
        }

        .leads-table th {
          background: #f9fafb;
          padding: 16px;
          text-align: left;
          font-weight: 600;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }

        .leads-table td {
          padding: 16px;
          border-bottom: 1px solid #f3f4f6;
        }

        .leads-table tr:hover {
          background: #f9fafb;
        }

        .company-info,
        .email-info,
        .phone-info,
        .date-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
        }

        .status-new { background: #dbeafe; color: #1e40af; }
        .status-contacted { background: #fef3c7; color: #92400e; }
        .status-qualified { background: #ede9fe; color: #5b21b6; }
        .status-converted { background: #d1fae5; color: #065f46; }
        .status-rejected { background: #fee2e2; color: #991b1b; }
        .status-lost { background: #f3f4f6; color: #374151; }

        .lead-actions {
          display: flex;
          gap: 8px;
        }

        .btn-icon {
          padding: 8px;
          border: none;
          border-radius: 6px;
          background: #f3f4f6;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-icon:hover {
          background: #e5e7eb;
        }

        .btn-success {
          background: #d1fae5;
          color: #065f46;
        }

        .btn-success:hover {
          background: #a7f3d0;
        }

        .btn-danger {
          background: #fee2e2;
          color: #991b1b;
        }

        .btn-danger:hover {
          background: #fecaca;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          margin-top: 24px;
        }

        .btn-pagination {
          padding: 8px 16px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          background: white;
          cursor: pointer;
        }

        .btn-pagination:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-info {
          color: #6b7280;
          font-size: 14px;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal-large {
          max-width: 800px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
        }

        .modal-body {
          padding: 24px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .lead-summary {
          background: #f9fafb;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
        }

        .lead-summary h4 {
          margin-bottom: 12px;
          color: #374151;
        }

        .lead-summary p {
          margin: 4px 0;
          font-size: 14px;
        }

        .convert-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-weight: 500;
          color: #374151;
        }

        .form-group input,
        .form-group textarea,
        .form-group select {
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 14px;
        }

        .form-group select {
          background: white;
          cursor: not-allowed;
        }

        .form-group small {
          font-size: 12px;
          color: #6b7280;
          margin-top: 4px;
        }

        .btn-primary,
        .btn-secondary {
          padding: 12px 24px;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          border: none;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
        }

        .btn-primary:hover {
          background: #2563eb;
        }

        .btn-secondary {
          background: #f3f4f6;
          color: #374151;
        }

        .btn-secondary:hover {
          background: #e5e7eb;
        }

        .lead-details {
          display: grid;
          gap: 24px;
        }

        .detail-section h4 {
          margin-bottom: 12px;
          color: #374151;
          font-weight: 600;
        }

        .detail-section p {
          margin: 4px 0;
          font-size: 14px;
        }

        .loading {
          text-align: center;
          padding: 48px;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default LeadManagement;
