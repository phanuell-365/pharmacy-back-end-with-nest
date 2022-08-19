import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { userProviders } from '../users/users.provider';
import { JwtStrategy } from './strategy';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import * as fs from 'fs';
import * as path from 'path';
import { EXPIRES_IN } from './constants';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: () => {
        const options: JwtModuleOptions = {
          privateKey: fs.readFileSync(
            path.join(__dirname, '../../src/auth', '/keys/private.pem'),
            'utf8',
          ),
          publicKey: fs.readFileSync(
            path.join(__dirname, '../../src/auth', '/keys/public.pem'),
            'utf8',
          ),
          signOptions: {
            algorithm: 'RS256',
            expiresIn: EXPIRES_IN,
          },
        };
        return options;
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, ...userProviders, JwtStrategy],
})
export class AuthModule {}
