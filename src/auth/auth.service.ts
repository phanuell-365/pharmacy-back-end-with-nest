import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { User } from '../users/entities/user.entity';
import { USER_REPOSITORY } from '../users/constants';
import { AuthDto } from './dto';
import * as bcrypt from 'bcrypt';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { EXPIRES_IN } from './constants';
import { CreateUserDto } from '../users/dto';
import { Role } from '../users/enums';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
    private readonly jwtService: JwtService,
  ) {}

  async createDefaultAdmin() {
    const user = await this.userRepository.findOne({
      where: {
        username: 'Administrator',
      },
    });

    if (user) {
      return;
    }

    const admin: CreateUserDto = {
      username: 'Administrator',
      email: 'administrator@localhost.com',
      password: 'password_admin',
      phone: '0712345678',
      role: Role.ADMIN,
    };

    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);

    await this.userRepository.create({
      ...admin,
    });
  }

  async login(user: AuthDto): Promise<{
    access_token: string;
    expires_in: string;
    role: string;
  }> {
    // create a default admin if there is none
    await this.createDefaultAdmin();

    const userFound = await this.userRepository.findOne({
      where: {
        username: user.username,
      },
    });

    if (!userFound) {
      throw new ForbiddenException('Invalid credentials');
    }

    const isPasswordMatching = await bcrypt.compare(
      user.password,
      userFound.password,
    );

    if (!isPasswordMatching) {
      throw new ForbiddenException('Invalid credentials');
    }

    return {
      access_token: this.signToken(userFound.id, userFound.username),
      role: userFound.role,
      expires_in: EXPIRES_IN,
    };
  }

  signToken(userId: string, username: string) {
    const payload = {
      sub: userId,
      username,
    };

    const options: JwtSignOptions = {
      expiresIn: EXPIRES_IN,
      algorithm: 'RS256',
    };

    return this.jwtService.sign(payload, options);
  }
}
