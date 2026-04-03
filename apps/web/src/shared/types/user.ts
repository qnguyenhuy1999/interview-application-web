export interface User {
  id: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
  message?: string;
}

export interface ApiError {
  message: string;
}
