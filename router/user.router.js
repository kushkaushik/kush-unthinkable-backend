const express = require('express')
const router = express.Router()
const multer = require('multer')
const  userService = require('../service/user/user.service')
const auth = require('../middleware/auth')



router.post('/number', async(req,res)=>{
    const {number} =req.body;
    try {
        const result = await userService.createUser(number)
        res.json(result)
      } catch (error) {
        res.status(500).json({ error: 'Failed to send OTP SMS' });
      }
})


router.post('/otp/verify' , async(req, res)=>{
    try{
        const result  = await userService.verify_otp(req.body);
        res.json(result)
    }catch(error){
        res.status(500).json({error: error})
    }
})



const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
router.post('/creation',upload.single('file') , async(req,res)=>{
    try{
        console.log(req.file)
        const result = await userService.create_new_user(req.body, req.file.buffer)
        res.json(result)
    }catch(error){
        console.log(error)
        res.status(500).json({error : error.message})
    }
})




router.get('/all_user' , auth ,async(req,res)=>{
    const result = await userService.show_user(req);
    res.json(result)
})






module.exports = router