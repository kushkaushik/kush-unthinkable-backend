const USER = require('../schema/user.schema')
const jwt = require('jsonwebtoken')
const AUTH = async(req,res,next)=>{
    let token;
    if(req?.headers?.authorization?.startsWith("Bearer ")){
        token = req?.headers?.authorization?.split(' ')[1];
        if(token){
            console.log(token)
            const decode = jwt.verify(token,"kush")
            const user =await USER.findById(decode?._id);
            req.user = user;
            next();
        }else{
          res.status(500).json({message: 'You are not a verified User'})
        }
    }else{
        res.status(401).json({
            message : 'Unauthorized',
            success : false
        })
    }
}

module.exports = AUTH;