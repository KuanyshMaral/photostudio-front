import React, { useEffect, useState } from 'react';
import { getProfile } from './auth.api';
import { useAuth } from '../../context/AuthContext';
import type { Profile } from './auth.types';

const ProfilePage: React.FC = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      getProfile(token)
        .then(setProfile)
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [token]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!profile) return <div>No profile data</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <p className="p-2 border rounded">{profile.name}</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Email</label>
          <p className="p-2 border rounded">{profile.email}</p>
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <p className="p-2 border rounded">{profile.role}</p>
        </div>
        {profile.companyName && (
          <div>
            <label className="block text-sm font-medium">Company Name</label>
            <p className="p-2 border rounded">{profile.companyName}</p>
          </div>
        )}
        {profile.bin && (
          <div>
            <label className="block text-sm font-medium">BIN</label>
            <p className="p-2 border rounded">{profile.bin}</p>
          </div>
        )}
        {profile.address && (
          <div>
            <label className="block text-sm font-medium">Address</label>
            <p className="p-2 border rounded">{profile.address}</p>
          </div>
        )}
        {profile.contactPerson && (
          <div>
            <label className="block text-sm font-medium">Contact Person</label>
            <p className="p-2 border rounded">{profile.contactPerson}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;