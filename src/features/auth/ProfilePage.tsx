import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { getProfile, uploadFiles } from './auth.api';
import { useAuth } from '../../context/AuthContext.tsx';
import type { Profile } from './auth.types';
import EditProfileForm from './EditProfileForm';
import FileUpload from '../../components/FileUpload';

const ProfilePage: React.FC = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (token) {
      getProfile(token)
        .then(setProfile)
        .catch((err) => {
          toast.error('Failed to load profile: ' + err.message);
        })
        .finally(() => setLoading(false));
    }
  }, [token]);

  const handleProfileUpdate = (updatedProfile: Profile) => {
    setProfile(updatedProfile);
    setIsEditing(false);
  };

  const handleFilesSelected = async (files: File[]) => {
    if (!token || files.length === 0) return;

    setUploading(true);

    try {
      await uploadFiles(token, files);
      toast.success('Files uploaded successfully!');
      // Optionally refresh profile
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="skeleton skeleton-title"></div>
          <div className="skeleton skeleton-text"></div>
          <div className="skeleton skeleton-text"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-container">
        <p>No profile data available</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Profile</h2>

      {isEditing ? (
        <EditProfileForm profile={profile} onUpdate={handleProfileUpdate} />
      ) : (
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
            <label className="block text-sm font-medium">Phone</label>
            <p className="p-2 border rounded">{profile.phone}</p>
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
      )}

      <div className="mt-6 space-y-4">
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>

        <div>
          <h3 className="text-lg font-medium mb-2">Upload Files</h3>
          <FileUpload onFilesSelected={handleFilesSelected} isUploading={uploading} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;