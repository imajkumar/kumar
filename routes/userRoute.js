var express = require("express");
const upload = require('../multer');

const UserController = require("../controllers/UserController");
const {checkSchema} = require('express-validator');
var router = express.Router();
const {
    registrationSchema,
    userLoginSchema,
    checkMobileRegistered   
  } = require("../routes/validator");

  

router.post("/uploadGallery", upload.array('Images',2), UserController.userUpload);
router.post("/uploadAvatar", upload.single('avatar'), UserController.userAvatar);

router.post("/userRegister", UserController.userRegister); //user logic
router.post("/userLogin",checkSchema(userLoginSchema), UserController.userLogin);
router.post("/checkMobileRegistered",checkSchema(checkMobileRegistered), UserController.checkMobileRegistered);
router.post("/updateProfile", UserController.updateProfile);



module.exports = router;

//http://localhost:4002/api/uploadGallery
