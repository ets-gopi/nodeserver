const Validator=require("../utils/validator");
const {bookingSchema}=require("../utils/schemaforValidation");
const {HttpError,createError}=require("../utils/customError");
const mongoose=require("mongoose");
// const path=require("path");
// const fs=require("fs");

const bookingValidation=(req,res,next)=>{
    //console.log(req.body);
    try {
        if(Object.keys(req.body).length === 0){
            throw createError("Invalid Request.",400);
        }
        if(!mongoose.Types.ObjectId.isValid(req.params.propertyId)){
            throw createError("Invalid Property ID.",400);
        }
        const bookingObj=new Validator(bookingSchema);
        const {data,errors}=bookingObj.validate({...req.body});
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