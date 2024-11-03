const {userModel} = require("../models/user.model");
const { createError, HttpError } = require("../utils/customError");

const checkUser=async(req,res,next)=>{
    //console.log(req.payload);

    try {
        if(!req.payload){
            throw createError('Unauthorized',401);
        }else{
            const {id}=req.payload;
            const isUserExit=await userModel.findById(id);
            if(!isUserExit){
                throw createError("user does not exist.",404);
            }
            if(isUserExit.isAdmin){
                next();
            }else{
                res.json({
                    status:false,
                    bcc:401,
                    message:"Premission are Restricted."
                });
            }
            
        }
    } catch (error) {
        console.error(error);
        
        if(error instanceof HttpError){
            res.json({
                status:false,
                bcc:error.statusCode,
                message:error.message,
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

const checkRoomUser=async(req,res,next)=>{
    //console.log(req.payload);

    try {
        if(!req.payload){
            throw createError('Unauthorized',401);
        }else{
            const {id}=req.payload;
            const {propertyId}=req.params;
            let isValidUser=false;
            
            const isUserDocExit=await userModel.findById(id);
            if(!isUserDocExit){
                throw createError("user does not exist.",404);
            }
            const userObj=isUserDocExit.toObject();
            //console.log(userObj.propertyId);
            userObj.propertyId?.forEach((key,ind)=>{
                if(key.toString()===propertyId){
                    isValidUser=true;
                    return;
                }
            });

            if(isUserDocExit.isAdmin && isValidUser){
                next();
            }else{
                res.json({
                    status:false,
                    bcc:401,
                    message:"Premission are Restricted."
                });
            }
            
        }
    } catch (error) {
        console.error(error);
        
        if(error instanceof HttpError){
            res.json({
                status:false,
                bcc:error.statusCode,
                message:error.message,
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
module.exports={checkUser,checkRoomUser};