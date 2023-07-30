const mongoose = require('mongoose')
const bycrpt = require('bcrypt')
const util = require('util')
const jwt = require('jsonwebtoken')
const AsyncAsign = util.promisify(jwt.sign)
const valid = require("validator")
require('dotenv').config()

const userSchema = new mongoose.Schema({
    FirstName: {
     type: "string",
     //required: true,
    // minlength: 3 
     /*validator: {
        validator: (valid) => {
           return valid.isAlpha(valid)
     }, 
     message: 'value is not valid name'
    }*/
},

    LastName:{
        type: "string",
        //required: true,
       // minlength: 3 
},

    UserName:{
        type: "string",
        //required: true,
       // minlength: 3 
        /*validator: {
           validator: (val) => {
            return valid.isAlpha(val)
    },*/
},

    password:{
     type:"string",
    },

    isAdmin:{
        type: Boolean
    },

    PhoneNumber:{
        type:"string",
        /*validator: {
            validator: (val) => {
                return valid.isMobilePhone(val,any)*/
                //"pattern":"^01[0125][0-9]{8}$"
     },
     //message: 'value is not valid phone number'
   // }
 //}
})

// hashing password 
userSchema.pre('save', async function () {
    if (this.isModified('password')) {
        const salatRound = 5
        const HashPassword = await bycrpt.hash(this.password, salatRound)
        this.password = HashPassword
    }
})

//sign token
userSchema.methods.generateToken = function () {

    const token = AsyncAsign({
        id: this.id,
        adminRole:this.isAdmin,
    }, process.env.secrtkey)
    return token

}
module.exports = userSchema ;

//module.exports= mongoose.model("User" , userSchema);

