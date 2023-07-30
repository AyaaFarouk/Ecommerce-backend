
const mongoose = require('mongoose')

//product 
const productSchema = require('./productSchema')
const productModel = mongoose.model('Product' ,productSchema)
module.exports = productModel
