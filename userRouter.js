const express = require('express')
const router = express.Router()
const userModel = require("./userModel");
const bcrypt = require("bcrypt")
const util = require('util')
const jwt = require('jsonwebtoken');
const auth = require('./Middleware')
const productModel = require("./productModel");
const { validateUser } = require("./validation");

/*SignUp*/
router.post("/",validateUser, async (req, res) => {
    const { FirstName, LastName, UserName, password, isAdmin, PhoneNumber} = req.body;

    let exist = await userModel.findOne({UserName});
    if (exist) {
      return res.status(400).send("username is already exist");
    }

    const newUser = await userModel.create({
      FirstName,
      LastName,
      UserName,
      password,
      isAdmin,
      PhoneNumber
    });

    const addUser = await newUser.save()
    res.status(200).send(newUser);
  
  });
  //-----------------------------------------------------------------------------------------------------------------------------------
  /*LogIn*/
  router.post('/login', async (req, res, next) => {
    const { UserName, password } = req.body
    const FindUSer = await userModel.findOne({ UserName })
    if (!FindUSer)
    {
      return res.status(400).send("username invalid");
    }
     

    const passcompare = await bcrypt.compare(password, FindUSer.password)
      if(!passcompare)
    {
      return res.status(400).send("password invalid");
    }

    const token = await FindUSer.generateToken()
     if(!token)
     {
      return res.status(400).send("password or password invalid");
     }

     else
     {
      const p = await productModel.find({});
      res.status(200).json({token: token, reults: p.length, data:p})
     }
})
//------------------------------------------------------------------------------------

/*delete*/
router.delete('/:id' ,auth,  async (req, res) => {
  try {
  const { id } = req.params
  const deleteuser = await userModel.findByIdAndRemove(id)
  res.status(200).send('Delete sucessfully')
  }   
  catch {
    return res.status(400).send("user not found");

  }
})
//------------------------------------------------------------------------------------------------------------------
//-------------------------------  PRODUCT ----------------------------------------


//create product
router.post("/product",auth,async (req, res) => {
  const { Name, Price, Description} = req.body;
  const newProduct = await productModel.create({
    Name,
    Price,
    Description
  });

  const addUProduct = await newProduct.save()
  res.status(200).send(newProduct);

});

// Edit product
router.patch('/product/edit/:id' ,auth,  async (req, res, next) => {
  try {
    const { id } = req.params
    const { Name, Price, Description} = req.body;
    const editProduct = await productModel.findByIdAndUpdate(id, {Name, Price, Description})
    res.status(200).send('Edit sucessfully')
  }
  catch {
    return res.status(400).send("Product not found");

  }
})

// delete product 
router.delete('/product/delete/:id' ,auth,  async (req, res) => {
  try {
  const { id } = req.params
  const deleteproduct = await productModel.findByIdAndRemove(id)
  res.status(200).send('Delete sucessfully')
  }   
  catch {
    return res.status(400).send("Product not found");

  }
})

//show all product
const asyncverify = util.promisify(jwt.verify)
require('dotenv').config()
const AuthorieUsershow = async (req, res, next) => {
  const { authorization: token } = req.headers
  if (!token) return res.status(400).send("access denied..")
  try
  { 
  const decoded = await asyncverify(token, process.env.secrtkey)
  if (decoded.id !== req.params.id) return res.status(400).send("sign up first")
  next();
  }

  catch(err)
   {
  res.status(400).send("Invalid Token..")
  }
}

router.get('/show/:id',AuthorieUsershow,async (req, res) => {
     const p = await productModel.find({});
     res.status(200).json({reults: p.length, data:p})
})
//----------------------------------------------------------------------------
//------------ CART ------------------------------------------------------

//create cart
const cartModel = require("./cartModel");

router.post("/cart/:id",AuthorieUsershow,async (req, res) => {
  let {id} = req.params
  try
  {
  const { cart, UserId ,Totalprice} = req.body;
  const tocart = await cartModel.create({
    cart,
    UserId:UserId ,
    Totalprice,
  });

  const addtocart = await tocart.save()
  res.status(200).json({YourCart: addtocart})
  }

  catch(err)
  {
 res.status(400).send("invalid..")
  }

});


// buy
router.get('/cart/:id/buy',AuthorieUsershow,async (req, res) => {
  let {id} = req.params
  let finduser = await cartModel.findOne({UserId: id});
  res.status(200).json({Totalprice:finduser.Totalprice ,YourCart: finduser.cart})
})


//cancel
router.get('/cart/:id/cancel',AuthorieUsershow,async (req, res) => {
  let {id} = req.params
  let finduser = await cartModel.findOne({UserId: id});
  let cartID =  finduser._id
  let zero = await cartModel.findByIdAndUpdate(cartID,{cart:[],Totalprice:0})
  res.status(200).send("Order is Canceled")
})

module.exports = router