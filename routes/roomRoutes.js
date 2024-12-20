const express = require("express");
const router = express.Router();
const roomInfo = require("../controllers/room.controller");
const {
  roomUpload,
  updateRoomUpload,
} = require("../middleware/room.upload.middleware");
const { verifyAccessToken } = require("../utils/jwt.tokens");
const { checkRoomUser, checkUser } = require("../middleware/checkUser");
const {
  roomValidation,
  updateRoomValidation,
} = require("../middleware/room.validation.middleware");
const {serachRoomsValidation} = require("../middleware/serachRoomValidation");

router.get("/", verifyAccessToken, roomInfo.getAllRooms);
router.get("/room/:roomId", verifyAccessToken, roomInfo.getRoomById);

router.get(
  "/property/:propertyId",
  verifyAccessToken,
  roomInfo.getRoomByPropertyId
);

// router.get("/",verifyAccessToken,checkUser,roomInfo.getRoomsByUserId);
// router.get("/:userId/:roomId",verifyAccessToken,checkUser,roomInfo.getRoomByUserIdByRoomId);

router.post(
  "/property/:propertyId/create-room",
  verifyAccessToken,
  checkRoomUser,
  roomUpload,
  roomValidation,
  roomInfo.createRoomByPropertyId
);
router.put(
  "/property/:propertyId/room/:roomId/update-room",
  verifyAccessToken,
  checkRoomUser,
  updateRoomUpload,
  updateRoomValidation,
  roomInfo.updateRoomByPropertyIdByRoomId
);
router.delete(
  "/property/:propertyId/room/:roomId/delete-room",
  verifyAccessToken,
  checkRoomUser,
  roomInfo.deleteRoomByPropertyIdByRoomId
);

//  search rooms
router.post(
  "/property/:propertyId/search-rooms",
  verifyAccessToken,
  serachRoomsValidation,
  roomInfo.searchRoomsByPropertyId
);
module.exports = router;
