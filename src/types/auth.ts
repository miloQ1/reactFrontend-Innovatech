// ===== Auth Types =====

export interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  enabled: boolean;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}
