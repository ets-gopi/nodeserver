const createBooking=(req,res,next)=>{
    console.log(req.body);
    
    res.send(req.body)
}


const bookingInfo={createBooking};
module.exports=bookingInfo;