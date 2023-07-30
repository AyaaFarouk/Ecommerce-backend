const mongoose = require('mongoose')
const productSchema = mongoose.Schema({
    Name:{
        type: "string",
    },

    Price:{
        type: "Number",
    } ,

    Description:{
        type: "string",
    } ,

})


module.exports = productSchema ;