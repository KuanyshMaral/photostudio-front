import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Building, 
  TrendingUp, 
  Wrench, 
  ShoppingCart, 
  Camera, 
  Lock,
  Calendar,
  Users,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Import components
import CompanyProfile from './CompanyProfile';
import Analytics from './Analytics';
import Maintenance from './Maintenance';
import Procurement from './Procurement';
import PinManagement from './PinManagement';
import StudioManagement from './StudioManagement';

import './OwnerDashboard.css';

export default function OwnerDashboard() {
  const { token } = useAuth();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'profile' | 'analytics' | 'maintenance' | 'procurement' | 'studios' | 'bookings' | 'clients' | 'messages' | 'pin'>('profile');

  // Update active tab based on URL hash or query param
  useEffect(() => {
    const path = location.pathname;
    const hash = location.hash;
    
    // Check for hash like #analytics, #maintenance, etc.
    if (hash.includes('analytics')) {
      setActiveTab('analytics');
    } else if (hash.includes('maintenance')) {
      setActiveTab('maintenance');
    } else if (hash.includes('procurement')) {
      setActiveTab('procurement');
    } else if (hash.includes('studios')) {
      setActiveTab('studios');
    } else if (hash.includes('bookings')) {
      setActiveTab('bookings');
    } else if (hash.includes('clients')) {
      setActiveTab('clients');
    } else if (hash.includes('messages')) {
      setActiveTab('messages');
    } else if (hash.includes('pin')) {
      setActiveTab('pin');
    } else {
      setActiveTab('profile');
    }
  }, [location]);

  const handleTabChange = (tab: typeof activeTab) => {
    setActiveTab(tab);
    // Update URL hash without navigation
    window.history.pushState(null, '', `#${tab}`);
  };

  const tabs = [
    { id: 'profile', label: 'Профиль компании', icon: Building },
    { id: 'analytics', label: 'Аналитика', icon: TrendingUp },
    { id: 'maintenance', label: 'Обслуживание', icon: Wrench },
    { id: 'procurement', label: 'Закупки', icon: ShoppingCart },
    { id: 'studios', label: 'Мои студии', icon: Camera },
    { id: 'bookings', label: 'Бронирования', icon: Calendar },
    { id: 'clients', label: 'Клиенты', icon: Users },
    { id: 'messages', label: 'Сообщения', icon: MessageSquare },
    { id: 'pin', label: 'PIN-код', icon: Lock }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <CompanyProfile />;
      case 'analytics':
        return <Analytics />;
      case 'maintenance':
        return <Maintenance />;
      case 'procurement':
        return <Procurement />;
      case 'studios':
        return <StudioManagement />;
      case 'bookings':
        return <div>Бронирования (в разработке)</div>;
      case 'clients':
        return <div>Клиенты (в разработке)</div>;
      case 'messages':
        return <div>Сообщения (в разработке)</div>;
      case 'pin':
        return <PinManagement />;
      default:
        return <CompanyProfile />;
    }
  };

  return (
    <div className="owner-dashboard">
      <div className="dashboard-header">
        <h1>
          <Building size={24} />
          Панель владельца
        </h1>
        <div className="header-info">
          <span>
            {token ? 'Авторизован' : 'Не авторизован'}
          </span>
        </div>
      </div>

      <div className="dashboard-content">
        {renderTabContent()}
      </div>
    </div>
  );
}
