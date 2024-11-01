const express=require("express");
const router = express.Router();
const { verifyAccessToken } = require("../utils/jwt.tokens");
const bookingValidation = require("../middleware/booking.validation.middleware");
const bookingInfo = require("../controllers/booking.controller");

router.post("/property/:propertyId/create-booking",verifyAccessToken,bookingValidation,bookingInfo.createBooking);
router.get("/booking-testing",bookingInfo.testing);
module.exports=router;