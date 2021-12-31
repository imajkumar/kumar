const {body, checkSchema, validationResult} = require('express-validator');
const registrationSchema = {
    gender: {
        notEmpty: true,
        errorMessage: "Gender field cannot be empty"
    },
    password: {
        isStrongPassword: {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        },
        errorMessage: "Password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number",
    },
    phone: {
        notEmpty: true,
        errorMessage: "Phone number cannot be empty"
    },
   
}
const checkMobileRegistered = {
   
  
    phone: {
        notEmpty: true,
        errorMessage: "Phone number cannot be empty"
    },
   
}
const userLoginSchema = {
   
  
    phone: {
        notEmpty: true,
        errorMessage: "Phone number cannot be empty"
    },
    password: {
        notEmpty: true,
        errorMessage: "Password number cannot be empty"
    },
   
}


module.exports = {
    registrationSchema,
    checkMobileRegistered,
    userLoginSchema
   
  };