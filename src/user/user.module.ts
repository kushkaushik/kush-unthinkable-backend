import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { OtpModule } from 'src/otp/otp.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/schema/user';
import {MulterModule} from '@nestjs/platform-express'
@Module({
  imports : [
    MulterModule.register({
      dest: './uploads', // Specify the destination folder for temporary storage
    }),
    MongooseModule.forFeature([{name : 'User' , schema : UserSchema}]),
    OtpModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
