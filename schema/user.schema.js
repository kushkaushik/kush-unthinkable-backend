const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({

    number : {
        required : true,
        type : Number,
    },
    name : {
        type : String
    },
    image : {
        type : String
    },
    gender : {
        type : String
    }
})

module.exports = mongoose.model('User' , userSchema)