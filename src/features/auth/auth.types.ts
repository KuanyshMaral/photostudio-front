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
  message: string;
  // Assuming success response has a message
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
};

export type ApiError = {
  message: string;
};