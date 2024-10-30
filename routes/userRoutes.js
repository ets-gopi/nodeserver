const express=require("express");
const router = express.Router();
const userInfo=require("../controllers/user.controller");
const userValidation=require("../middleware/user.validation.middleware");


router.post("/register",userValidation,userInfo.register);
router.post("/login",userValidation,userInfo.login);

module.exports=router;