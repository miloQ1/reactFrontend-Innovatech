// ===== Auth Service (Mock Implementation) =====
// Replace this implementation with real API calls when backend is ready.

import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/auth';
import { mockUsers } from '../mocks/users';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Simulate a mutable users list
const users = [...mockUsers];

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    await delay(600);
    const user = users.find((u) => u.email === data.email && u.password === data.password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const { password: _, ...safeUser } = user;
    return {
      user: safeUser,
      accessToken: `mock-access-token-${user.id}`,
      refreshToken: `mock-refresh-token-${user.id}`,
    };
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    await delay(800);
    const exists = users.find((u) => u.email === data.email || u.userName === data.userName);
    if (exists) {
      throw new Error('User with this email or username already exists');
    }
    const newUser = {
      id: `u${Date.now()}`,
      userName: data.userName,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
    };
    users.push(newUser);
    const { password: _, ...safeUser } = newUser;
    return {
      user: safeUser,
      accessToken: `mock-access-token-${newUser.id}`,
      refreshToken: `mock-refresh-token-${newUser.id}`,
    };
  },

  async me(token: string): Promise<User> {
    await delay(300);
    const userId = token.replace('mock-access-token-', '');
    const user = users.find((u) => u.id === userId);
    if (!user) {
      throw new Error('Invalid token');
    }
    const { password: _, ...safeUser } = user;
    return safeUser;
  },

  async logout(): Promise<void> {
    await delay(200);
  },
};
