import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users') // this defines the route: /users
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get() // responds to GET requests at /users
  async getUsers() {
    return this.usersService.findAll();
  }
}
