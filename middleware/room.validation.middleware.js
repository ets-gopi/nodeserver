const Validator=require("../utils/validator");
const {roomSchema}=require("../utils/schemaforValidation");
const {HttpError,createError}=require("../utils/customError");
const path=require("path");
const fs=require("fs");
const parseBoolean = (value) => {
    if (typeof value === "string") {
        if(value.toLowerCase().trim() === "true"){
            return true
        }else if(value.toLowerCase().trim() === "false"){
            return false
        }
    }
    return value;
};

const parseNumber = (value) => {
    if(typeof value === "string"){
        const parsed = Number(value.trim() ? value.trim() : undefined);
        //console.log(value,parsed,isNaN(parsed));
        return isNaN(parsed) ? value : parsed;
    }
    return value
};
const roomValidation=(req,res,next)=>{
    let images=req.files["images"],thumbnailImage=req.files["thumbnailImage"][0];
    //console.log(images,thumbnailImage);
    
    const baseUrl=`${req.protocol}://${req.get('host')}`;
    thumbnailImage=`${baseUrl}/images/rooms/${thumbnailImage.filename}`
    images=images.map((item,ind)=>{
        return `${baseUrl}/images/rooms/${item.filename}`
    });
    //console.log(thumbnailImage,images);

    //console.log({...req.body,images,thumbnailImage});

    const parsedData={
        userId:req.payload.id,
        propertyId:req.params.propertyId,
        ...req.body,
        images,
        thumbnailImage,
        maxOccupancy: parseNumber(req.body.maxOccupancy),
        isAvailable: parseBoolean(req.body.isAvailable),
        numberOfBeds: parseNumber(req.body.numberOfBeds),
        pricePerNight: parseNumber(req.body.pricePerNight),
        quantityAvailable:parseNumber(req.body.quantityAvailable),
    }
    //console.log(parsedData);
    

    try {
        const userRoomSchema=new Validator(roomSchema);
        const {data,errors}=userRoomSchema.validate(parsedData);
        //console.log(data,errors);
        if(Object.keys(errors).length > 0){
            throw createError("Invalid Request.",400,{error:errors});
        }
        req.body=data;
        next();
        
        
    } catch (error) {
        console.error(error);
        req.files["images"].forEach((file,ind)=>{
            const filePath = path.resolve(__dirname, '../public/images/rooms', file.filename);

            fs.unlink(filePath, (err) => {
                if (err) {
                console.error(`Error deleting ${file.filename}:`, err);
                } else {
                console.log(`${file.filename} deleted successfully!`);
                }
            });

        })
        req.files["thumbnailImage"].forEach((file,ind)=>{
            const filePath = path.resolve(__dirname, '../public/images/rooms', file.filename);

            fs.unlink(filePath, (err) => {
                if (err) {
                console.error(`Error deleting ${file.filename}:`, err);
                } else {
                console.log(`${file.filename} deleted successfully!`);
                }
            });

        })
        
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

const updateRoomValidation=(req,res,next)=>{
    //console.log("body",req.body);
    //console.log("files",req.files);
    let updateRoomSchema={},images=[],thumbnailImage=[],parseData={};
    if(Object.keys(req.body).length>0){
        for(const key in req.body){
            if(typeof req.body[key] === "object" && !Array.isArray(req.body[key])){
                let updatetype={};
                const {type}=roomSchema[key]
                for(const subkey in req.body[key]){
                    //console.log("subkey",subkey,"type",type);
                    if(type[subkey]){
                        updatetype[subkey]=type[subkey];
                    }
                
                }
                updateRoomSchema[key]={...roomSchema[key],type:updatetype}
                
            }else{
                updateRoomSchema[key]=roomSchema[key];
            }
        }
    }
    if(typeof req.files === "object" && !Array.isArray(req.files)){
        if(Object.keys(req.files).length>0){
            images=req.files["images"] ? req.files["images"] : [] ,thumbnailImage=req.files["thumbnailImage"] ? req.files["thumbnailImage"] : [];
           
            const baseUrl=`${req.protocol}://${req.get('host')}`;
            if(thumbnailImage.length>0){
                //thumbnailImage=`${baseUrl}/images/properties/${thumbnailImage[0].filename}`
                thumbnailImage=thumbnailImage.map((item,ind)=>{
                    return `${baseUrl}/images/rooms/${item.filename}`
                }); 
                parseData["thumbnailImage"]=thumbnailImage[0];
            }
            if(images.length>0){
                 images=images.map((item,ind)=>{
                return `${baseUrl}/images/rooms/${item.filename}`
                
            });
            parseData["images"]=images;
            }
            for(const key in req.files){
                updateRoomSchema[key]=roomSchema[key];  
            }

        }
    }
    parseData=req.body.maxOccupancy ? {...parseData,maxOccupancy:parseNumber(req.body.maxOccupancy)} : parseData;
    parseData=req.body.numberOfBeds ? {...parseData,numberOfBeds:parseNumber(req.body.numberOfBeds)} : parseData;
    parseData=req.body.pricePerNight ? {...parseData,pricePerNight:parseNumber(req.body.pricePerNight)} : parseData;
    parseData=req.body.isAvailable ? {...parseData,isAvailable:parseBoolean(req.body.isAvailable)} :parseData;

    parseData={...req.body,...parseData};

    if(Object.keys(updateRoomSchema).length>0){
        try {
            const userRoomSchema=new Validator(updateRoomSchema);
            const {data,errors}=userRoomSchema.validate(parseData);
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
    }else{
        res.json({
            status:false,
            bcc:400,
            message:"data is required."
        })
    }
}

module.exports={roomValidation,updateRoomValidation};
