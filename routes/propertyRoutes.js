const express=require("express");
const router = express.Router();
const propertyInfo=require("../controllers/property.controller");
const {propertyValidation,updatePropertyValidation}=require("../middleware/property.validation.middleware");
const{propertyUpload,updatePropertyUpload}=require("../middleware/property.upload.middleware");
const { verifyAccessToken } = require("../utils/jwt.tokens");
const {checkUser} = require("../middleware/checkUser");



router.get("/",verifyAccessToken,propertyInfo.getAllProperties);
router.post("/create-property",verifyAccessToken,checkUser,propertyUpload,propertyValidation,propertyInfo.createProperty);
router.put("/update-property/:id",verifyAccessToken,checkUser,updatePropertyUpload,updatePropertyValidation,propertyInfo.updatePropertyById);
router.delete("/delete-property/:id",verifyAccessToken,checkUser,propertyInfo.deletePropertyById);
router.get("/property/:id",verifyAccessToken,propertyInfo.getPropertyById);






module.exports=router;