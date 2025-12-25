export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  token: string;
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

export type ApiError = {
  message: string;
};