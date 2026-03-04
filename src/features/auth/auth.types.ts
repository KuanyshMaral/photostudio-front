export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
  refreshToken?: string;
  user: Profile;
};

// New client registration request according to Swagger
export type ClientRegisterRequest = {
  email: string;
  password: string;
};

// New client registration response according to Swagger  
export type ClientRegisterResponse = {
  data: {
    user: {
      email: string;
      id: number;
      role: string;
      studio_status?: string;
    };
    verification_sent: boolean;
  };
  success: boolean;
};

// Email verification request
export type EmailVerificationRequest = {
  code: string;
  email: string;
};

// Email verification response
export type EmailVerificationResponse = {
  data: {
    status: string;
  };
  success: boolean;
};

// Request email verification
export type RequestVerificationRequest = {
  email: string;
};

export type RequestVerificationResponse = {
  data: {
    status: string;
  };
  success: boolean;
};

// Legacy types for studio registration (keep for now)
export type RegisterRequest = {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'client' | 'studio_owner';
};

export type RegisterResponse = {
  token: string;
  refreshToken?: string;
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