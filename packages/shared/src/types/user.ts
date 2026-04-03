export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface UserPublic {
  id: string;
  email: string;
  createdAt: Date;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}
