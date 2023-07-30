const mongoose = require('mongoose')

// cart
const cartSchema = require("./cartSchema")
const cartModel = mongoose.model('cart' ,cartSchema)

module.exports = cartModel

