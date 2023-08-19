import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { OtpModule } from './otp/otp.module';
import { ChatModule } from './chat/chat.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [UserModule, OtpModule, ChatModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
