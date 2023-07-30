const mongoose = require('mongoose')
const productModel = require("./productModel");
const cartSchema = mongoose.Schema({
    cart:{
        type: mongoose.Schema.Types.Array,ref:'Product',
    },

    UserId:{
        type: mongoose.Schema.Types.ObjectId,ref:'User',
    },

    Totalprice:
    {
        type: Number,
    }
})

// calculate total price
cartSchema.pre('save', async function () {
    if (this.isModified('Totalprice')) 
    {
        var howmuch = 0 ;
        for (var i in this.cart)
        {
         var x = this.cart[i];
         var findproduct = await productModel.findOne({Name: x });
         howmuch = parseInt(howmuch) + parseInt(findproduct.Price.toString())
        }
        this.Totalprice = howmuch
    }
})



module.exports = cartSchema ;

