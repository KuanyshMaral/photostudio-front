import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Extract the current path and set active tab
    const path = location.pathname.replace('/', '') || 'dashboard';
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
    { id: "dashboard", label: "Dashboard" },
    { id: "studios", label: "Browse Studios" },
    { id: "booking", label: "Book Studio" },
    { id: "my-bookings", label: "My Bookings" },
    { id: "availability", label: "Availability" },
    { id: "write-review", label: "Write Review" },
    { id: "reviews", label: "Reviews" },
    { id: "profile", label: "Your Profile" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="p-6">
          <h1 className="text-xl font-semibold text-gray-900 mb-8">PhotoStudio Hub</h1>
          
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === "dashboard") {
                    navigate("/dashboard");
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
              Sign out
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
