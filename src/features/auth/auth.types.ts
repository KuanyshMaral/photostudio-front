export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  user: Profile;
};

export type RegisterRequest = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'client' | 'studio_owner';
};

export type RegisterResponse = {
  token: string;
  user: Profile;
  message?: string;
};

export type StudioRegisterRequest = {
  email: string;
  password: string;
  phone: string;
  companyName: string;
  bin: string;
  address: string;
  contactPerson: string;
  documents: File[];
};

export type Profile = {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'client' | 'studio_owner' | 'admin';
  companyName?: string;
  bin?: string;
  address?: string;
  contactPerson?: string;
  studio_status?: string;
  avatar?: string;
  avatar_url?: string;
  created_at?: string;
  stats?: {
    total_bookings: number;
    upcoming_bookings: number;
    completed_bookings: number;
    cancelled_bookings: number;
  };
  recent_bookings?: Array<{
    id: number;
    studio_name: string;
    room_name: string;
    date: string;
    status: 'completed' | 'cancelled' | 'pending' | 'confirmed';
  }>;
};

export type ApiError = {
  message: string;
};