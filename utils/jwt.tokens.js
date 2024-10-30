const jwt =require("jsonwebtoken");
const { createError, HttpError } = require("./customError");


// sign the user.
const signAccessToken=(userId)=>{
    //payload
    const payload={
        id:userId
    }
    //options
    const options={
        algorithm:"HS256",
        issuer:"bookingserver.com",
    }
    
    // create a promise 
    return new Promise((res,rej)=>{
    // generate the access token
    jwt.sign(payload,process.env.JWT_SCERET,options,function(err,token){
        if(err){
            rej(createError(`Internal Server Issue.`,500))

        }else{
            res(token);

        }})
    })

}

const verifyAccessToken=(req,res,next)=>{
    try {
        const authHeader=req.headers['authorization'];
        if(!authHeader){
            throw createError('Unauthorized',401);
        }else{
            const berearToken =authHeader.split(" ");
            const token=berearToken[1];
            jwt.verify(token,process.env.JWT_SCERET,(err,payload)=>{
                if(err){
                    throw createError('Unauthorized',401);
                }else{
                    req.payload=payload;
                    next();
                }
            });
            
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

module.exports={signAccessToken,verifyAccessToken};
