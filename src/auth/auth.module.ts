import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {JwtModule} from '@nestjs/jwt'
import { jwtSecret } from './jwtSecret';


@Module({
  imports : [
    JwtModule.register({
      global: true,
      secret: jwtSecret.secretKey,
      signOptions: { expiresIn: '60h' },
    }),],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
