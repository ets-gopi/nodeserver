const express = require("express");
const router = express.Router();
const userInfo = require("../controllers/user.controller");
const userValidation = require("../middleware/user.validation.middleware");
const { verifyAccessToken } = require("../utils/jwt.tokens");
const {
  userSearchDetailsValidation,
} = require("../middleware/serachRoomValidation");

router.post("/register", userValidation, userInfo.register);
router.post("/login", userValidation, userInfo.login);
router.get("/get-user-info", verifyAccessToken, userInfo.getUserDetails);
router.post(
  "/manipulate-session-data",
  verifyAccessToken,
  userSearchDetailsValidation,
  userInfo.manipulateUserSessionData
);
router.get("/get-session-data", verifyAccessToken, userInfo.getUserSessionData);

module.exports = router;
