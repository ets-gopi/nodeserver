const mongoose =require("mongoose");

const connectDB=()=>{
        mongoose.connect(process.env.MONGODB_URI,{dbName:process.env.DB_NAME}).then((res)=>{
            console.log("connected to db.");
            
        }).catch((err)=>{
            console.log("error in connecting the db.",err);
            
        })  
}

module.exports=connectDB;