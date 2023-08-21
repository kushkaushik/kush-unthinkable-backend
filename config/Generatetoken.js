const jwt = require('jsonwebtoken')

const GenerateToken = (_id)=>{
    return jwt.sign({_id},"kush")
}

module.exports = {GenerateToken}