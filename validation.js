/*const Ajv = require("ajv").default;
const ajv = new Ajv();

const schema ={
    "type":"object",
    "properties":{
        "FirstName":{"type":"string", "pattern":"^[A-Z][a-z]*$"},
        "LastName":{"type":"string", "pattern":"^[A-Z][a-z]*$"},
        "UserName":{"type":"string", "pattern":"^[A-Z][a-z]*$"},
        "Password":{"type":"string"},
        "PhoneNumber":{"type":"string"}
    },
    "required":["FirstName" , "LastName" , "UserName" , "Password" , "PhoneNumber" ]
}

module.exports = ajv.compile(schema)*/


const Joi = require("joi");

function validateUser(req, res, next) {
  const schema = Joi.object({
    FirstName: Joi.string().required(),
    LastName: Joi.string().required(),
    UserName: Joi.string().required(),
    password: Joi.string().required(),
    isAdmin: Joi.boolean().optional(),
    PhoneNumber: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).send("Validation error");
  }
  
  next();
}

module.exports = {validateUser} ;