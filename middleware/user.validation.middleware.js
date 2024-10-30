const Validator=require("../utils/validator");
const {userRegisterSchema,userLoginSchema}=require("../utils/schemaforValidation");
const {HttpError,createError}=require("../utils/customError");

const userValidation=(req,res,next)=>{
    const schema=typeof req.route.path === "string" && req.route.path.slice(1,) === "login" ? userLoginSchema : userRegisterSchema;
    
    try {
        console.log(req.body);
        
        const userSchema=new Validator(schema);
        const {data,errors}=userSchema.validate(req.body);
        console.log(data,errors);
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

module.exports=userValidation;
