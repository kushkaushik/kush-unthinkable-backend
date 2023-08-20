import { Body, Controller, Post , Req , Put , Delete , Get  , Res ,UploadedFile, UseInterceptors, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { FileInterceptor  } from '@nestjs/platform-express'
import {Express} from 'express'
import {Multer} from 'multer'
import { AuthGuard } from 'src/auth/auth.guard';


@Controller('user')
export class UserController {

    constructor(private readonly userService : UserService){}

    @Post('/number')
    async loginUser(@Body() body : any){
        return await this.userService.create_user(body);
    }

    @Post('/otp/verify')
    async verifyOtp(@Body() body : any){
        return await this.userService.verify_otp(body);
    }

    @Post('/create_user')
    @UseInterceptors(FileInterceptor('image'))
    async createUser(@Body() body  : any , @UploadedFile() file: Multer.File ){
        return await this.userService.create_new_user(body ,file )
    }

    @UseGuards(AuthGuard)
    @Get('/all_user')
    async showUser(@Req() req : any){
        return await this.userService.show_user(req);
    }

}

