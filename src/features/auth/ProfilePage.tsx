import React, { useEffect, useState } from 'react';
import { getProfile, uploadFiles } from './auth.api';
import { useAuth } from '../../context/AuthContext';
import type { Profile } from './auth.types';
import EditProfileForm from './EditProfileForm';
import FileUpload from '../../components/FileUpload';

const ProfilePage: React.FC = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (token) {
      getProfile(token)
        .then(setProfile)
        .catch((err) => setError(err.message))
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
    setUploadError(null);

    try {
      await uploadFiles(token, files);
      // Optionally refresh profile or show success
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Ошибка загрузки');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!profile) return <div>Нет данных профиля</div>;

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-6">Профиль</h2>

      {isEditing ? (
        <EditProfileForm profile={profile} onUpdate={handleProfileUpdate} />
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Имя</label>
            <p className="p-2 border rounded">{profile.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Электронная почта</label>
            <p className="p-2 border rounded">{profile.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Телефон</label>
            <p className="p-2 border rounded">{profile.phone}</p>
          </div>
          <div>
            <label className="block text-sm font-medium">Роль</label>
            <p className="p-2 border rounded">{profile.role}</p>
          </div>
          {profile.companyName && (
            <div>
              <label className="block text-sm font-medium">Название компании</label>
              <p className="p-2 border rounded">{profile.companyName}</p>
            </div>
          )}
          {profile.bin && (
            <div>
              <label className="block text-sm font-medium">БИН</label>
              <p className="p-2 border rounded">{profile.bin}</p>
            </div>
          )}
          {profile.address && (
            <div>
              <label className="block text-sm font-medium">Адрес</label>
              <p className="p-2 border rounded">{profile.address}</p>
            </div>
          )}
          {profile.contactPerson && (
            <div>
              <label className="block text-sm font-medium">Контактное лицо</label>
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
          {isEditing ? 'Отмена' : 'Редактировать профиль'}
        </button>

        <div>
          <h3 className="text-lg font-medium mb-2">Загрузить файлы</h3>
          <FileUpload onFilesSelected={handleFilesSelected} isUploading={uploading} />
          {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;