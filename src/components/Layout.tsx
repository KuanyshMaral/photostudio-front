import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Building2, Calendar, MessageSquare, User, 
  Settings, BarChart2, Users, LogOut, Camera
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Определяем меню в зависимости от роли
  const getSidebarItems = () => {
    const role = user?.role;

    // Для владельца студии — все вкладки в основной панели
    if (role === 'studio_owner') {
      return [
        { id: "studios", label: "Студии", icon: Building2 },
        { id: "manager/bookings", label: "Бронирования", icon: Calendar },
        { id: "manager/clients", label: "Клиенты", icon: Users },
        { id: "messages", label: "Сообщения", icon: MessageSquare },
        { id: "owner/profile", label: "Профиль компании", icon: Settings },
        { id: "owner/analytics", label: "Аналитика", icon: BarChart2 },
        { id: "owner/maintenance", label: "Обслуживание", icon: Settings },
        { id: "owner/procurement", label: "Закупки", icon: Settings },
        { id: "owner/pin", label: "PIN-код", icon: Settings }
      ];
    }

    // Для админа
    if (role === 'admin') {
      return [
        { id: "admin/dashboard", label: "Дашборд", icon: BarChart2 },
        { id: "admin/studios", label: "Студии", icon: Building2 },
        { id: "admin/users", label: "Пользователи", icon: Users },
        { id: "admin/analytics", label: "Аналитика", icon: BarChart2 },
        { id: "admin/ads", label: "Реклама", icon: Settings },
      ];
    }

    // Для клиента — стандартное меню
    return [
      { id: "studios", label: "Студии", icon: Building2 },
      { id: "my-bookings", label: "Мои бронирования", icon: Calendar },
      { id: "messages", label: "Сообщения", icon: MessageSquare },
      { id: "profile", label: "Мой профиль", icon: User },
    ];
  };

  const sidebarItems = getSidebarItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      {/* Left Sidebar */}
      <aside className="w-72 glass border-r border-gray-200/50">
        <div className="p-6">
          <div className="sidebar-logo flex items-center mb-8">
            <div className="p-2 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-xl mr-3">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold gradient-text">StudioBooking</h1>
          </div>
          
          {/* Роль пользователя */}
          {user && (
            <div className="mb-8 p-4 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl border border-primary-100">
              <div className="flex items-center mb-2">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-primary-600 uppercase tracking-wide">
                    {user.role === 'studio_owner' && 'Владелец студии'}
                    {user.role === 'admin' && 'Администратор'}
                    {user.role === 'client' && 'Клиент'}
                  </p>
                  <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                </div>
              </div>
            </div>
          )}
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.includes(item.id);
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    // Все owner вкладки ведут на /owner с нужным hash
                    if (item.id.startsWith('owner/')) {
                      const tab = item.id.replace('owner/', '');
                      navigate(`/owner#${tab}`);
                    } else {
                      navigate(`/${item.id}`);
                    }
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-3 group ${
                    isActive
                      ? "bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-lg scale-[1.02]"
                      : "text-gray-600 hover:text-primary-600 hover:bg-primary-50 hover:scale-[1.01]"
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive 
                      ? "bg-white/20" 
                      : "bg-gray-100 group-hover:bg-primary-100"
                  }`}>
                    <Icon size={16} className={isActive ? "text-white" : "text-gray-600 group-hover:text-primary-600"} />
                  </div>
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 flex items-center gap-3 group"
            >
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                <LogOut size={16} />
              </div>
              Выйти
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-visible">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
