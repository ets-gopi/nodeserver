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

// when payment is successful and then create a booking.
router.post(
  "/property/:propertyId/create-booking",
  verifyAccessToken,
  bookingValidation,
  bookingInfo.transactionMiddleware,
  bookingInfo.verifyPaymentStatus,
  bookingInfo.createBooking,
  bookingInfo.updateRooms,
  bookingInfo.updateUserInfo,
  bookingInfo.finalizeBooking
);

// when rooms lock are expired.
router.put(
  "/property/:propertyId/update-rooms-after-expxiry",
  verifyAccessToken,
  bookingInfo.updateRoomsAfterExpiry
);

// when payment is fails and then create a failed booking.
router.post(
  "/property/:propertyId/create-failed-booking",
  verifyAccessToken,
  bookingValidation,
  bookingInfo.transactionMiddleware,
  bookingInfo.createFailedBooking,
  bookingInfo.updateRooms,
  bookingInfo.updateUserInfo,
  bookingInfo.finalizeFailedBooking
);

// for internal testing.
router.get("/booking-testing", bookingInfo.testing);
module.exports = router;
