const mongoose=require("mongoose");
const {Schema} =mongoose;
const argon2 =require("argon2");
// user Schema

const userSchema=new Schema({
    username:{
        type:String
    },
    email:{
        type:String
    },
    password:{
        type:String
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    bookings:{
        type:[String]
    },
    propertyId:{
        type:[{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Property",
        }],
    }

},{
    timestamps:true,
    versionKey:false
});


userSchema.pre("save",async function(next){
    console.log(this);
    this.password = await argon2.hash(this.password);
    if (!this.isAdmin) {
        this.propertyId = undefined;
      }
    next();
    
})

userSchema.methods.verifyPassword=async function(password){
    //console.log(this);
    const isVerified=await argon2.verify(this.password,password);
    return isVerified;
    
}
// create an model

const userModel=mongoose.model('User',userSchema);

module.exports={userModel,mongoose};
