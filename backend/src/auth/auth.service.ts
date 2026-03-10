import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { UsersService } from '../users/users.service';
import { LoginDto, RegisterDto } from './dto';

type JwtPayload = {
  sub: string;
  email: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) {
      throw new UnauthorizedException('邮箱已被注册');
    }

    const passwordHash = await argon2.hash(dto.password);
    const user = await this.usersService.createUser({
      email: dto.email,
      passwordHash,
      name: dto.name,
    });

    const tokens = this.signTokens(user.id, user.email);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const ok = await argon2.verify(user.passwordHash, dto.password);
    if (!ok) {
      throw new UnauthorizedException('邮箱或密码错误');
    }

    const tokens = this.signTokens(user.id, user.email);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      ...tokens,
    };
  }

  private signTokens(userId: string, email: string) {
    const payload: JwtPayload = {
      sub: userId,
      email,
    };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: '15m',
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}

