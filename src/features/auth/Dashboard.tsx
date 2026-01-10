import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import { getProfile } from "./auth.api";
import type { Profile } from "./auth.types";

export default function Dashboard() {
  const { token } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      getProfile(token)
        .then(setProfile)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isStudioOwner = profile?.role === 'studio_owner';
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="p-8">
      {/* Welcome Section with User Info */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome back, {profile?.name || 'User'}!
            </h2>
            <p className="text-gray-600 mt-1">
              {isStudioOwner 
                ? 'Manage your photo studio and bookings' 
                : isAdmin 
                ? 'Admin dashboard - Manage all users and studios'
                : 'Manage your photo studio booking experience'
              }
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {profile?.role || 'client'}
              </span>
              {profile?.companyName && (
                <span className="text-sm text-gray-500">
                  {profile.companyName}
                </span>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Logged in as:</p>
            <p className="text-sm font-medium text-gray-900">{profile?.email}</p>
          </div>
        </div>
      </div>

      {/* Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Client Cards */}
        {!isStudioOwner && !isAdmin && (
          <>
            <Link
              to="/studios"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="text-blue-600 mb-3">🏢</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Browse Studios</h3>
              <p className="text-gray-600 text-sm">Explore and discover photo studios in your area</p>
            </Link>

            <Link
              to="/booking"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="text-green-600 mb-3">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Book Studio</h3>
              <p className="text-gray-600 text-sm">Reserve a photo studio for your next shoot</p>
            </Link>

            <Link
              to="/my-bookings"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="text-purple-600 mb-3">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">My Bookings</h3>
              <p className="text-gray-600 text-sm">View and manage your studio reservations</p>
            </Link>
          </>
        )}

        {/* Studio Owner Cards */}
        {isStudioOwner && (
          <>
            <Link
              to="/studio-management"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="text-orange-600 mb-3">🏢</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Studio Management</h3>
              <p className="text-gray-600 text-sm">Manage your studio details and settings</p>
            </Link>

            <Link
              to="/studio-bookings"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="text-blue-600 mb-3">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Studio Bookings</h3>
              <p className="text-gray-600 text-sm">View and manage incoming booking requests</p>
            </Link>

            <Link
              to="/availability"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="text-green-600 mb-3">⏰</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Availability</h3>
              <p className="text-gray-600 text-sm">Set your studio availability calendar</p>
            </Link>
          </>
        )}

        {/* Admin Cards */}
        {isAdmin && (
          <>
            <Link
              to="/admin"
              className="bg-blue-100 p-6 rounded-lg border border-blue-300 hover:border-blue-400 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="text-blue-600 mb-3">🏠</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Admin Dashboard</h3>
              <p className="text-gray-600 text-sm">View statistics and pending requests</p>
            </Link>

            <Link
              to="/admin/users"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="text-red-600 mb-3">👥</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">User Management</h3>
              <p className="text-gray-600 text-sm">Manage all users and permissions</p>
            </Link>

            <Link
              to="/admin/studios"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="text-purple-600 mb-3">🏢</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Studio Management</h3>
              <p className="text-gray-600 text-sm">Approve and manage all studios</p>
            </Link>

            <Link
              to="/admin/analytics"
              className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md"
            >
              <div className="text-indigo-600 mb-3">📊</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Analytics</h3>
              <p className="text-gray-600 text-sm">View platform analytics and reports</p>
            </Link>
          </>
        )}

        {/* Common Cards for All Users */}
        <Link
          to="/availability"
          className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md"
        >
          <div className="text-teal-600 mb-3">📆</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Availability</h3>
          <p className="text-gray-600 text-sm">Check studio availability calendar</p>
        </Link>

        <Link
          to="/write-review"
          className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md"
        >
          <div className="text-yellow-600 mb-3">⭐</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Write Review</h3>
          <p className="text-gray-600 text-sm">Share your experience with studios</p>
        </Link>

        <Link
          to="/reviews"
          className="bg-white p-6 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors shadow-sm hover:shadow-md"
        >
          <div className="text-pink-600 mb-3">💬</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Reviews</h3>
          <p className="text-gray-600 text-sm">Read reviews from other users</p>
        </Link>
      </div>

      {/* Profile Section */}
      <div className="mt-8 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {profile?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900">Your Profile</h3>
              <p className="text-gray-600 text-sm mt-1">Manage your account settings and preferences</p>
              {profile?.phone && (
                <p className="text-gray-500 text-xs mt-1">📞 {profile.phone}</p>
              )}
            </div>
          </div>
          <Link
            to="/profile"
            className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
          >
            Edit Profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
