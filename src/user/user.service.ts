import { Injectable ,HttpStatus , HttpException,UploadedFile, UseInterceptors} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FileInterceptor } from '@nestjs/platform-express'
import { Model } from 'mongoose';
import { OtpService } from 'src/otp/otp.service';
import { User } from 'src/schema/user';
import { JwtService   } from '@nestjs/jwt';
import { v2 as cloudinary } from 'cloudinary';
import * as dotenv from 'dotenv'

dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
  });


@Injectable()
export class UserService {
   
    constructor(@InjectModel('User') private readonly userModule : Model<User>,
    private readonly optService : OtpService,
    private readonly jwtService : JwtService
    ){}

    async create_user(body){
        try{
        const {number} = body;
        const findUser = await this.userModule.findOne({number});
        if(!findUser){
            await this.optService.sendOtpSms(number)
            {
                return {
                    msg :'Otp Sent Successfully',
                    success : true
                }
            }
        }else if(findUser){
            return {
                msg : 'Mobile Number Already Registred Please Login',
                success: false
            }
        }

        else{
            return {
                msg : 'Invalid Number',
                success : false
            }
        }
    }catch(error){
        return {
            error : error.message,
            success : false
        }
    }
    }


    async verify_otp(body){
        const {otp , number} = body
        const getOtp = await this.optService.verifyOtp(otp);
        if(getOtp === 'valid'){
            return {
                success : true,
                msg : 'Otp Verified'
            }
        }else{
            return {
                success : false,
                msg : 'Invalid Otp'
            }
        }

    }




    async create_new_user(body , file){
        // const {number , name , image , gender} = body;
        try{
        const findNum = await this.userModule.findOne({number : body.number})
        if(findNum){
            return {
                msg : 'User Already Exist',
                success : false
            }
        }
        let new_file
        if(file){
            const result = await cloudinary.uploader.upload(file.path);
    new_file =  result.secure_url;
        }
        const saveData = await this.userModule.create({
            number : body.number,
            name : body.name,
            image : new_file,
            gender : body.gender
        });
        const {_id , number , name , image} = saveData;
        const payload = {_id , number  , name , image};
        const access_token = await this.jwtService.signAsync(payload)
        return {
            success :true,
            msg : 'Successfully Login',
            user : payload,
            access_token
        }
    }
    catch(error){
        
        return {
            error  : error.message,
            success : false,
         
        }
    }
        
    }



    async show_user(req){
        // console.log(req.user)
        const _id = req.user._id;
        return await this.userModule.find({ _id: { $ne: _id } }).exec();
    }


}
