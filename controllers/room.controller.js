const {roomModel,mongoose}=require("../models/room.model");
const { HttpError, createError } = require("../utils/customError");



const createRoomByPropertyId=async(req,res,next)=>{
    try {
        const roomdoc=await roomModel.create({...req.body});
   
        res.json({
            status:true,
            bcc:201,
            message:`room created successfully.`
        })
        
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

const updateRoomByPropertyIdByRoomId=async(req,res,next)=>{
    //console.log(req.body);
    const {propertyId,roomId}=req.params;
    try {
        const doc=await roomModel.findById(roomId);
        if(!doc){
            throw createError('room does not found.',404);
        }
        const roomObj=doc.toObject();
        if(roomObj["propertyId"].toString()!==propertyId || roomObj["userId"].toString()!==req.payload.id){
            throw createError("Premission is Restricted.",401);
        }
        await roomModel.findByIdAndUpdate(roomId,{...req.body});
        res.json({
            status:true,
            bcc:200,
            message:'room updated successfully.'
        })
    } catch (error) {
        console.error(error);
        
        if(error instanceof HttpError){
            res.json({
                status:false,
                bcc:error.statusCode,
                message:error.message,
            })
        }else if(error instanceof mongoose.Error.CastError){
            res.json({
                status:false,
                bcc:400,
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


const deleteRoomByPropertyIdByRoomId=async(req,res,next)=>{
    const {propertyId,roomId}=req.params;
    try {
        const doc=await roomModel.findById(roomId);
        if(!doc){
            throw createError('room does not found.',404);
        }
        const roomObj=doc.toObject();
        if(roomObj["propertyId"].toString()!==propertyId  || roomObj["userId"].toString()!==req.payload.id){
            throw createError("Premission is Restricted.",401);
        }
        await roomModel.findByIdAndDelete(roomId);

        res.json({
            status:true,
            bcc:200,
            message:'room data deleted successfully.',
        })
    } catch (error) {
        console.error(error);
        
        if(error instanceof HttpError){
            res.json({
                status:false,
                bcc:error.statusCode,
                message:error.message,
            })
        }else if(error instanceof mongoose.Error.CastError){
            res.json({
                status:false,
                bcc:400,
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


const getAllRooms=async(req,res,next)=>{
    let roomsArray=[];
    try {
        const allRooms=await roomModel.find({});
        if(allRooms.length>0){
            roomsArray=allRooms.map((room,ind)=>{
                const {id,name,description,roomType,BedType,maxOccupancy,numberOfBeds,pricePerNight,isAvailable,images,thumbnailImage,amenities,quantityAvailable}=room;
                return {
                    id,name,description,roomType,BedType,maxOccupancy,numberOfBeds,pricePerNight,isAvailable,images,thumbnailImage,amenities,quantityAvailable
                }
            })
            
        }
        
        res.json({
            status:true,
            bcc:200,
            message:`All Rooms are fetched Successfully.`,
            data:roomsArray
        })
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


const getRoomById=async(req,res,next)=>{
    const {roomId}=req.params;
    let roomObj={};
    try {
        const Roomdoc=await roomModel.findOne({_id:roomId});
        if(!Roomdoc){
           throw createError("room dose not exit",404) 
        }
        roomObj=Roomdoc.toObject();
        const {name,description,roomType,BedType,maxOccupancy,numberOfBeds,pricePerNight,isAvailable,images,thumbnailImage,amenities,quantityAvailable}=roomObj;
        res.json({
            status:true,
            bcc:200,
            message:`Room data  fetched Successfully.`,
            data:{name,description,roomType,BedType,maxOccupancy,numberOfBeds,pricePerNight,isAvailable,images,thumbnailImage,amenities,quantityAvailable}
        })
    } catch (error) {
        console.error(error);
        
        if(error instanceof HttpError){
            res.json({
                status:false,
                bcc:error.statusCode,
                message:error.message,
            })
        }else if(error instanceof mongoose.Error.CastError){
            res.json({
                status:false,
                bcc:400,
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

};

const getRoomByPropertyId=async(req,res,next)=>{
    const {propertyId}=req.params;
    try {
        const Roomsdoc=await roomModel.find({propertyId});
        if(Roomsdoc.length===0){
           throw createError("rooms dose not exit",404); 
        }
        res.json({
            status:true,
            bcc:200,
            message:`Rooms data  fetched Successfully.`,
            data:Roomsdoc
        })
    } catch (error) {
        console.error(error);
        
        if(error instanceof HttpError){
            res.json({
                status:false,
                bcc:error.statusCode,
                message:error.message,
            })
        }else if(error instanceof mongoose.Error.CastError){
            res.json({
                status:false,
                bcc:400,
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

};


const getRoomsByUserId=async(req,res,next)=>{
    try {
        const propertyRooms=await roomModel.find({userId:req.payload.id});
        if(!propertyRooms){
            throw createError("property does not found.",404);
        }
        res.json({
            status:true,
            bcc:200,
            message:'rooms data feteched successfully.',
            data:propertyRooms
        })
    } catch (error) {
        console.error(error);
        
        if(error instanceof HttpError){
            res.json({
                status:false,
                bcc:error.statusCode,
                message:error.message,
            })
        }else if(error instanceof mongoose.Error.CastError){
            res.json({
                status:false,
                bcc:400,
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

const getRoomByUserIdByRoomId=async(req,res,next)=>{
    const {userId,roomId}=req.params;
    try {
        const doc=await roomModel.findById(roomId);
        if(!doc){
            throw createError('room does not found.',404);
        }
        const roomObj=doc.toObject();
        if(roomObj["userId"].toString()!==userId){
            throw createError("Premission is Restricted.",401);
        }
        res.json({
            status:true,
            bcc:200,
            message:'room data feteched successfully.',
            data:doc
        })
    } catch (error) {
        console.error(error);
        
        if(error instanceof HttpError){
            res.json({
                status:false,
                bcc:error.statusCode,
                message:error.message,
            })
        }else if(error instanceof mongoose.Error.CastError){
            res.json({
                status:false,
                bcc:400,
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





const roomInfo={createRoomByPropertyId,updateRoomByPropertyIdByRoomId,deleteRoomByPropertyIdByRoomId,getAllRooms,getRoomsByUserId,getRoomByUserIdByRoomId,getRoomById,getRoomByPropertyId};

module.exports=roomInfo;