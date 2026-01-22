import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Extract the current path and set active tab
    const path = location.pathname.replace('/', '') || 'studios';
    return path;
  });

  const handleLogout = () => {
    console.log("Logout button clicked");
    logout();
    console.log("Logout function called, navigating to /");
    navigate("/");
    console.log("Navigation called");
  };

  const sidebarItems = [
    { id: "studios", label: "Студии" },
    { id: "my-bookings", label: "Мои бронирования" },
    { id: "messages", label: "Сообщения" },
    { id: "profile", label: "Мой профиль" },
  ];

  // Add owner dashboard for studio owners
  if (user?.role === 'studio_owner') {
    sidebarItems.splice(1, 0, { id: "owner", label: "Управление студией" });
    sidebarItems.splice(2, 0, { id: "manager/bookings", label: "Календарь бронирований" });
    sidebarItems.splice(3, 0, { id: "manager/clients", label: "Клиенты" });
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <div className="sidebar-logo flex items-center mb-8">
            <h1 className="text-xl font-semibold text-gray-900">StudioBooking</h1>
          </div>
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === "owner") {
                    navigate("/owner");
                  } else if (item.id.startsWith("manager/")) {
                    navigate(`/${item.id}`);
                  } else {
                    navigate(`/${item.id}`);
                  }
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? "bg-purple-50 text-purple-700 border-l-2 border-purple-600"
                    : "text-gray-600 hover:text-purple-600 hover:bg-purple-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
            >
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
