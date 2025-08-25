import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    sub: number;
    email: string;
    role: string;
    refreshToken?: string;
  };
}

export interface AuthenticatedUser {
  sub: number;
  email: string;
  role: 'BUYER' | 'SELLER' | 'ADMIN';
  refreshToken?: string;
}
