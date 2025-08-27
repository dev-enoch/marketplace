import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import type { Request } from 'express';
import { AuthenticatedUser } from '../types/auth-request.type';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<User extends AuthenticatedUser = AuthenticatedUser>(
    err: Error | null,
    user: User | false,
  ): User {
    if (err) {
      throw err;
    }
    if (!user) {
      // Passport will normally throw UnauthorizedException, but can customize here
      throw new Error('Unauthorized');
    }
    return user;
  }

  getRequest<T extends Request = Request>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest<T>();
  }
}
