const mongoose=require("mongoose");
const {Schema} =mongoose;

// room Schema

const roomSchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },
    propertyId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Property',
    },
    name:{
        type:String
    },
    description:{
        type:String
    },
    roomType:{
        type:String
    },
    BedType:{
        type:String
    },
    maxOccupancy:{
        type:Number
    },
    numberOfBeds:{
        type:Number
    },
    pricePerNight:{
        type:Number
    },
    isAvailable:{
        type:Boolean
    },
    images:{
        type:[String]
    },
    thumbnailImage:{
        type:String
    },
    amenities:{
        type:[String]
    },
    currentBookings:{
        type:[String]
    },
    quantityAvailable: {  
        type: Number
    }  

},{
    timestamps:true,
    versionKey:false
});

const roomModel=mongoose.model("Room",roomSchema);

module.exports={roomModel,mongoose};