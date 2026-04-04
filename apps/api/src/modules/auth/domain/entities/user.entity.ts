export interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic {
  id: string;
  email: string;
  createdAt: Date;
}

export interface AuthResult {
  user: UserPublic;
  accessToken: string;
  expiresIn: number;
}
