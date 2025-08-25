import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser } from '../types/auth-request.type';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  handleRequest<TUser = AuthenticatedUser>(
    err: unknown,
    user: TUser | false,
    info: unknown,
    context: ExecutionContext,
    status?: unknown,
  ): TUser | false {
    // Optional debug
    // console.log('JwtRefreshGuard fired', { err, user, info });

    return super.handleRequest(err, user, info, context, status);
  }
}
