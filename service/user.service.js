const userModule = require('../schema/user.schema')
const otpService = require('../service/otp.service')
const cloudinary = require('cloudinary').v2;
const tok  =  require('../config/Generatetoken')
const createUser = async(number)=>{
    try{
        // const {number} = body;
        console.log(number)
        const findUser = await userModule.findOne({number});
        if(!findUser){
            await otpService.sendOtpSms(number)
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




async function verify_otp(body){
    const {otp , number} = body
    const getOtp = await otpService.verifyOtp(otp);
    // if(getOtp  === 'Valid')
    if(getOtp === 'Valid'){
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




async function create_new_user(body , file){
    // const {number , name , image , gender} = body;
    try{
    const findNum = await userModule.findOne({number : body.number})
    if(findNum){
        return {
            msg : 'User Already Exist',
            success : false
        }
    }
    let new_file
    if(file){
        // cloudinary.uploader.upload()
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
              resource_type: 'auto',
            }, (error, result) => {
              if (error) {
                console.log(error);
                reject(error);
              } else {
                new_file = result.secure_url;
                resolve(result);
              }
            }).end(file);
          });
    }

    console.log(new_file)
    const saveData = await userModule.create({
        number : body.number,
        name : body.name,
        image : new_file,
        gender : body.gender
    });
    const {_id , number , name , image} = saveData;
    const payload = {_id , number  , name , image};
    const access_token = await tok.GenerateToken(payload)
    return {
        success :true,
        msg : 'Successfully Login',
        user : saveData,
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



async function show_user(req){
    console.log(req.user)
    // console.log(req.user)
    const _id = req.user._id;
    return await userModule.find({ _id: { $ne: _id } }).exec();
}

module.exports ={createUser,verify_otp, create_new_user , show_user}