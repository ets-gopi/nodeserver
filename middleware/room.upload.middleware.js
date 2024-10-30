const {multer,roomFilesUpload}=require("../config/multer.config");
const { HttpError } = require("../utils/customError");
const roomUpload=(req,res,next)=>{
    roomFilesUpload(req,res,function(err){
        //console.log(req.files);
        
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.log("Multer error",err);
            res.json({
                status:false,
                bcc:500,
                message:"Internal server Issuse.",
            }) 
          } else if (err) {
            // An unknown error occurred when uploading.
            console.log("Unknown error",err);
            if(err instanceof HttpError){
                res.json({
                    status:false,
                    bcc:err.statusCode,
                    message:err.message,
                })
            }else{
                res.json({
                    status:false,
                    bcc:500,
                    message:"Internal server Issuse.",
                }) 
            }
          }else{
            if(req.files===undefined || Object.keys(req.files).length!==2){
                res.json({
                    status:false,
                    bcc:400,
                    message:"Images fields are required."
                });
            }else{
                next();
            }
            
          }
        
        
    })

}


const updateRoomUpload=(req,res,next)=>{
    roomFilesUpload(req,res,function(err){
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            console.log("Multer error",err);
            res.json({
                status:false,
                bcc:500,
                message:"Internal server Issuse.",
            }) 
          } else if (err) {
            // An unknown error occurred when uploading.
            console.log("Unknown error",err);
            if(err instanceof HttpError){
                res.json({
                    status:false,
                    bcc:err.statusCode,
                    message:err.message,
                })
            }else{
                res.json({
                    status:false,
                    bcc:500,
                    message:"Internal server Issuse.",
                }) 
            }
          }else{
            next();
          }
        
        
    })

}


module.exports={roomUpload,updateRoomUpload};