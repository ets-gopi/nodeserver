const multer  = require('multer');
const path=require("path");
const { createError } = require('../utils/customError');
//create a storage for property files.
const propertiesStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/images/properties');

    },
    filename:function(req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix+extension)
    }
});

//create a storage for room files.
const roomStorage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/images/rooms');

    },
    filename:function(req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix+extension)
    }
});

function fileFilter (req, file, cb) {
    //console.log("file",file);
    const fileExtensions=[".jpg",".jpeg",".png"];
    // Check allowed extensions
    const isAllowedExt = fileExtensions.includes(
        path.extname(file.originalname.toLowerCase())
    );
    // Mime type must be an image
    const isAllowedMimeType = file.mimetype.startsWith("image/");
    if (isAllowedExt && isAllowedMimeType) {
        return cb(null, true);
    }
    
    cb(createError(`File type not allowed!`,400), false);
  }
const propertyupload = multer({storage:propertiesStorage,fileFilter});
const roomupload = multer({storage:roomStorage,fileFilter});


const propertyFilesUpload=propertyupload.fields([{
    name:"thumbnailImage",
    maxCount:1
},{
    name:"images",
    maxCount:2
}]);

const roomFilesUpload=roomupload.fields([{
    name:"thumbnailImage",
    maxCount:1
},{
    name:"images",
    maxCount:2
}]);

module.exports={multer,propertyFilesUpload,roomFilesUpload};