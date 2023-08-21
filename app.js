const express = require('express')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose')
const cloudinary = require('cloudinary').v2;
const app = express();
const PORT = process.env.PORT || 8000


cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_KEY,
    api_secret: process.env.CLOUD_SECRET,
  });


mongoose.connect(process.env.URI,{ useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('connected',()=>{
    console.log("connected to database successfully");
})


app.use(express.json())
app.use(express.urlencoded({extended : true}))


  


app.use('/user',require('./router/user.router'))




app.listen(PORT , ()=>{
    console.log(`Successfully connected to ${PORT}`)
})