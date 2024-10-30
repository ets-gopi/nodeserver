const Validator=require("../utils/validator");
const {bookingSchema}=require("../utils/schemaforValidation");
const {HttpError,createError}=require("../utils/customError");
const {userModel,mongoose} = require("../models/user.model");

// const path=require("path");
// const fs=require("fs");

const bookingValidation=async(req,res,next)=>{
    //console.log(req.body);
    const {id}=req.payload;
    try {
        if(Object.keys(req.body).length === 0){
            throw createError("Invalid Request.",400);
        }
        const isUserExit=await userModel.findById(id);
        if(!isUserExit){
                throw createError("user does not exist.",404);
            }
        if(!mongoose.Types.ObjectId.isValid(req.params.propertyId)){
            throw createError("Invalid Property ID.",400);
        }
        
        const bookingObj=new Validator(bookingSchema);
        const {data,errors}=bookingObj.validate({...req.body,userId:id,propertyId:req.params.propertyId});
        //console.log(data,errors);
        if(Object.keys(errors).length > 0){
            throw createError("Invalid Request.",400,{error:errors});
        }
        req.body=data;
        next();      
        
    } catch (error) {
        console.error(error);
        if(error instanceof HttpError){
            res.json({
                status:false,
                bcc:error.statusCode,
                message:error.message,
                error:error.error
            })
        }else{
            res.json({
                status:false,
                bcc:500,
                message:"Internal server Issuse.",
            }) 
        }
        
    }  
    
   
}
module.exports=bookingValidation;