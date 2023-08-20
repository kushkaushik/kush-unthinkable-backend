import { HttpException, HttpStatus, Injectable } from '@nestjs/common'; 
 import * as speakeasy from 'speakeasy'; 
 import { UserService } from 'src/user/user.service'; 
 import { Twilio } from 'twilio'; 
  
 @Injectable() 
 export class OtpService { 
   private otpSecrets: Map<string, string> = new Map(); 
   private twilioClient: Twilio; 
  

   constructor() { 
     this.twilioClient = new Twilio( 
       "AC53cc68b8224e8b791f99d3d0bf9809f9", 
       "dd714ac2e2093f4b5e94b308a79e08fd" 
       // process.env.OTP_KEY, 
       // process.env.OTP_SECRET, 
     ); 
   } 
  
   generateOtp(): string { 
     const secret = speakeasy.generateSecret({ length: 6 }); 
     const otp = speakeasy.totp({ 
       secret: secret.base32, 
       encoding: 'base32', 
    }); 
  
    this.otpSecrets.set(otp, secret.base32); 
    return otp; 
  } 
 
  async sendOtpSms(mobileNumber: string): Promise<void> { 
    const otp = this.generateOtp(); 
 
    try { 
      await this.twilioClient.messages.create({ 
        body: `Your OTP is: ${otp}`, 
        from: '+17175393661', 
        to: `+91${mobileNumber}`, 
      }); 
    } catch (error) { 
      // return {msg: ''Failed to send OTP SMS:''} 
      throw new HttpException('Failed to send OTP SMS:', HttpStatus.BAD_GATEWAY); 
    } 
  } 


  async  verifyOtp(otp : string) { 
    const secret = this.otpSecrets.get(otp); 
 
    if (!secret) { 
      return 'Not valid'; 
    } 
 
    const isValid =await speakeasy.totp.verify({ 
      secret, 
      encoding: 'base32', 
      token: otp, 
      window: 2, 
 
    }); 
 
    if (isValid) { 
      this.otpSecrets.delete(otp); 
    } 
 
 
    return 'valid';

}
}