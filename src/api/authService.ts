import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';
import { apiClient } from './apiClient';

export const authService = {
  login(data: LoginRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/auth/login', data);
  },

  register(data: RegisterRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>('/api/auth/register', data);
  },

  me(): Promise<User> {
    return apiClient.get<User>('/api/auth/me', true);
  },

  logout(refreshToken: string): Promise<void> {
    return apiClient.post<void>('/api/auth/logout', { refreshToken });
  },
  
  getUserByUsername(userName: string): Promise<User> {
  return apiClient.get<User>(`/api/users/username/${userName}`);
},
};