import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { updateProfile } from './auth.api';
import { useAuth } from '../../context/AuthContext';
import type { Profile } from './auth.types';

interface EditProfileFormData {
  name: string;
  phone: string;
}

interface EditProfileFormProps {
  profile: Profile;
  onUpdate: (updatedProfile: Profile) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ profile, onUpdate }) => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditProfileFormData>({
    defaultValues: {
      name: profile.name,
      phone: profile.phone,
    },
  });

  useEffect(() => {
    reset({
      name: profile.name,
      phone: profile.phone,
    });
  }, [profile, reset]);

  const onSubmit = async (data: EditProfileFormData) => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const updatedProfile = await updateProfile(token, data);
      onUpdate(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const validatePhone = (value: string) => {
    const phoneRegex = /^\+?[\d\s\-()]+$/;
    return phoneRegex.test(value) || 'Please enter a valid phone number';
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name', { required: 'Name is required' })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone
        </label>
        <input
          id="phone"
          type="tel"
          {...register('phone', {
            required: 'Phone is required',
            validate: validatePhone,
          })}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
};

export default EditProfileForm;