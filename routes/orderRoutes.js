const express = require("express");
const router = express.Router();

const { verifyAccessToken } = require("../utils/jwt.tokens");
const ordersInfo = require("../controllers/orders.controller");

router.get("/id", verifyAccessToken, ordersInfo.getOrderDetails);
router.put(
  "/update-by-id/:orderId",
  verifyAccessToken,
  ordersInfo.updateOrderDetailsById
);
module.exports = router;
