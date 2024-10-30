const mongoose=require("mongoose");
const {Schema} =mongoose;


// property Schema

const propertySchema=new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    name:{
        type:String
    },
    location:{
        type:{
            address: {
                type:String
            },
            city: {
                type:String
            },
            state: {
                type:String
            },
            country: {
                type:String
            },
            postalCode: {
                type:String
            },
            coordinates: {
              latitude:{
                type:String
            },
              longitude: {
                type:String
            }
            }
        },
        _id:false
    },
    description:{
        type:String
    },
    type:{
        type:String
    },
    starRating:{
        type:Number
    },
    checkInTime:{
        type:String
    },
    checkOutTime:{
        type:String
    },
    availabilityStatus:{
        type:Boolean
    },
    totalRooms:{
        type:Number
    },
    availableRooms:{
        type:Number
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
    rooms:{
        type:[String]
    },
    contactInfo:{
        type:{
            phone:{
                type:String
            },
            email:{
                type:String
            }, 
            website:{
                type:String
            }
        },
        _id:false
    },

},{
    timestamps:true,
    versionKey:false
});



// create an model

const propertyModel=mongoose.model('Property',propertySchema);

module.exports={mongoose,propertyModel};
