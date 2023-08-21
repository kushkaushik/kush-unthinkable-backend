const speakeasy = require('speakeasy');
const { Twilio } = require('twilio');

const otpSecrets = new Map();
const twilioClient = new Twilio(
  process.env.TWILIO_KEY,
  process.env.TWILIO_SECRET,
  
);

async function generateOtp() {
  const secret = speakeasy.generateSecret({ length: 6 });
  const otp = speakeasy.totp({
    secret: secret.base32,
    encoding: 'base32',
  });

  otpSecrets.set(otp, secret.base32);
  return otp;
}

async function sendOtpSms(mobileNumber) {
  const otp = await generateOtp();
  console.log(process.env.TWILIO_OTP)
  console.log(process.env.TWILIO_SECRET)

  try {
    await twilioClient.messages.create({
      body: `Your OTP is: ${otp}`,
      from: process.env.TWILIO_NUMBER,
      to: `+91${mobileNumber}`,
    });
    return 'OTP sent successfully';
  } catch (error) {
    console.log(error.message)
    throw new Error(`Failed to send OTP SMS ${error.message}`);
  }
}



async function verifyOtp(otp) {
  const secret = otpSecrets.get(otp);

  if (!secret) {
    return 'Not valid';
  }

  try {
    const isValid = await speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token: otp,
      window: 2,
    });

    if (isValid) {
      otpSecrets.delete(otp);
    }

    return isValid ? 'Valid' : 'Not valid';
  } catch (error) {
    throw new Error('An error occurred');
  }
}

module.exports = {
  sendOtpSms,
  verifyOtp,
};
