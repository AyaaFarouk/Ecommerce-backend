const mongoose = require('mongoose')

// user
const userSchema = require("./userSchema")
const userModel = mongoose.model('User' ,userSchema)

module.exports = userModel
//module.exports= mongoose.model("User" , userModel);