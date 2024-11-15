const express = require("express");
const router = express.Router();
const userInfo = require("../controllers/user.controller");
const userValidation = require("../middleware/user.validation.middleware");
const { verifyAccessToken } = require("../utils/jwt.tokens");

router.post("/register", userValidation, userInfo.register);
router.post("/login", userValidation, userInfo.login);
router.get("/get-user-info", verifyAccessToken, userInfo.getUserDetails);

module.exports = router;
