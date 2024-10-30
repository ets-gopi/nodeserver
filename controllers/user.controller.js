const userModel=require("../models/user.model");
const { HttpError,createError } = require("../utils/customError");
const {signAccessToken}=require("../utils/jwt.tokens");

const register=async(req,res,next)=>{
    const {email}=req.body;
    try {
        const isExist=await userModel.findOne({email});
        if(Object.keys(isExist ? isExist : {}).length > 0){
            throw createError(`${email} already exist.`,409);
        }
        await userModel.create({...req.body});  
        res.json({
            status:true,
            bcc:201,
            message:"User Registered Successfully."
        });
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

const login=async(req,res,next)=>{
    const {email,password}=req.body;
    try {
        const isExist=await userModel.findOne({email});
        if(!isExist){
            throw createError(`${email} does not exit.`,404)
        }
        const isValid=await isExist.verifyPassword(password);
        if(!isValid){
            throw createError(`InValid Credentails.`,401);
        }
        const token=await signAccessToken(isExist._id);
        res.json({
            status:true,
            bcc:200,
            message:"Ok",
            accessToken:token
        });
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


const userInfo={register,login};

module.exports=userInfo;