// working with transactions in mongodb.
const {bookingModel,mongoose}=require("../models/booking.model");

const createBooking=async(req,res,next)=>{
    console.log(req.body);
    // start the session for
    const session=await mongoose.startSession();
    // console.log("Session ID:", session.id);
    // console.log("Transaction State:", session.transaction.state); 
    // console.log("mongodb",mongoose.connection.db.databaseName);

    try {
        session.startTransaction();
        //console.log("Transaction State:", session.transaction.state);
        //check the conflict in booking details.
        const bookingdocs=await bookingModel.find({})

        
        

        await session.commitTransaction();
        console.log("Transaction State:", session.transaction.state);
        res.json({
            status:true,
            bcc:201,

        })   
    } catch (error) {
        console.error(error);
        
        await session.abortTransaction();
        res.json({
            status:false,
        })
        
    }finally{
        await session.endSession();
    }
}


const bookingInfo={createBooking};
module.exports=bookingInfo;