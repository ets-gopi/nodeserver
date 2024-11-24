const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../utils/jwt.tokens");
const {
  bookingValidation,
  orderDataValidation,
} = require("../middleware/booking.validation.middleware");
const bookingInfo = require("../controllers/booking.controller");

// create an order id when there is no booking conflicts.Then check the room availability.

router.post(
  "/property/:propertyId/create-order-id",
  verifyAccessToken,
  orderDataValidation,
  bookingInfo.transactionMiddleware,
  bookingInfo.checkRoomAvailability,
  bookingInfo.createOrderId,
  bookingInfo.reserveRooms,
  bookingInfo.finalizeOrderId
);
router.post(
  "/property/:propertyId/create-booking",
  verifyAccessToken,
  bookingValidation,
  bookingInfo.transactionMiddleware,
  bookingInfo.checkRoomAvailability,
  bookingInfo.reserveRooms,
  bookingInfo.createBooking,
  bookingInfo.updateRooms,
  bookingInfo.updateUserInfo,
  bookingInfo.finalizeBooking
);
router.get("/booking-testing", bookingInfo.testing);
module.exports = router;
