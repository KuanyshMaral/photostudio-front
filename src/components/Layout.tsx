import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  Building2, Calendar, MessageSquare, User, 
  Settings, BarChart2, Users, LogOut 
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

    // Для владельца студии — CRM-ориентированное меню
    if (role === 'studio_owner') {
      return [
        { id: "owner", label: "Дашборд", icon: BarChart2 },
        { id: "manager/bookings", label: "Бронирования", icon: Calendar },
        { id: "manager/clients", label: "Клиенты", icon: Users },
        { id: "studio-management", label: "Мои студии", icon: Building2 },
        { id: "messages", label: "Сообщения", icon: MessageSquare },
        { id: "company/profile", label: "Профиль компании", icon: Settings },
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="sidebar-logo flex items-center mb-8">
            <h1 className="text-xl font-semibold text-gray-900">StudioBooking</h1>
          </div>
          
          {/* Роль пользователя */}
          {user && (
            <div className="mb-6 px-3 py-2 bg-purple-50 rounded-lg">
              <p className="text-xs text-purple-600 font-medium">
                {user.role === 'studio_owner' && '👑 Владелец студии'}
                {user.role === 'admin' && '🛡️ Администратор'}
                {user.role === 'client' && '👤 Клиент'}
              </p>
              <p className="text-sm text-gray-700 truncate">{user.name}</p>
            </div>
          )}
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname.includes(item.id);
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(`/${item.id}`);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-3 ${
                    isActive
                      ? "bg-purple-50 text-purple-700 border-l-2 border-purple-600"
                      : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center gap-3"
            >
              <LogOut size={18} />
              Выйти
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
