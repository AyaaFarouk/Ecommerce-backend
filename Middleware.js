const CustomError = require('./CustomError')
const util = require('util')
const jwt = require('jsonwebtoken')
const asyncverify = util.promisify(jwt.verify)
const validator = require("./validation")
require('dotenv').config()


module.exports = async (req, res, next) => {

    const { authorization: token } = req.headers
    if (!token) return res.status(400).send("access denied..")
   /* try
    {*/
    const decoded = await asyncverify(token, process.env.secrtkey)
    if (!decoded.adminRole) return res.status(400).send("Not Authorized")
     next();
   // }

    /*catch(err)
    {
        res.status(400).send("Invalid Token..")
    }*/
    }
   

/*module.exports = (req , res , next) =>
{
    let val = validator(req.body);
    if(val)
    {
        req.val=1;
        next();
    }
    else
    {
        res.status(400).send("forbidden command")
    }
}*/


