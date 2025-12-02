import { User } from '../types';

// Mock user database
const mockUsers: User[] = [
  { id: '1', email: 'student@example.com', role: 'student' },
  { id: '2', email: 'admin@example.com', role: 'admin' },
];

export const authService = {
  login: async (email: string, password: string): Promise<User | null> => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        if (email === 'student@example.com' && password === 'password') {
          resolve(mockUsers[0]);
        } else if (email === 'admin@example.com' && password === 'password') {
          resolve(mockUsers[1]);
        } else {
          resolve(null);
        }
      }, 500);
    });
  },

  signup: async (email: string, password: string): Promise<User | null> => {
    // Simulate API call for new user registration
    return new Promise((resolve) => {
      setTimeout(() => {
        if (!mockUsers.some(user => user.email === email)) {
          const newUser: User = { id: `user-${Date.now()}`, email, role: 'student' };
          mockUsers.push(newUser);
          resolve(newUser);
        } else {
          resolve(null); // User already exists
        }
      }, 500);
    });
  },

  loginWithGoogle: async (): Promise<User | null> => {
    // Simulate Google login process
    return new Promise((resolve) => {
      setTimeout(() => {
        // For simplicity, always return a student user for Google login mock
        resolve(mockUsers[0]);
      }, 700);
    });
  },

  logout: async (): Promise<void> => {
    // Simulate API call for logout
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
  },
};
