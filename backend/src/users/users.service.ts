import { Injectable } from '@nestjs/common';
import { PrismaClient, User } from '@prisma/client';

@Injectable()
export class UsersService {
  private prisma = new PrismaClient();

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(params: {
    email: string;
    passwordHash: string;
    name?: string;
  }): Promise<User> {
    const { email, passwordHash, name } = params;
    return this.prisma.user.create({
      data: { email, passwordHash, name },
    });
  }
}

