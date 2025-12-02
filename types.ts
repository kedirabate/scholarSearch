export interface User {
  id: string;
  email: string;
  role: 'student' | 'admin';
}

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  country: string;
  budget: number;
  major: string;
  deadline: string; // ISO date string
  url: string;
  organization: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  programs: string[];
  url: string;
  logoUrl: string;
}

export interface Bookmark {
  id: string;
  userId: string;
  entityId: string; // ID of Scholarship or University
  entityType: 'scholarship' | 'university';
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

export interface SearchFilters {
  country: string;
  budget: number | '';
  major: string;
  deadline: string; // ISO date string or empty
  query: string;
}

export interface GeminiResponse {
  text: string;
  loading: boolean;
  error: string | null;
}
