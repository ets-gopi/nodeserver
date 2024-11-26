const Razorpay = require("razorpay");
var razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SCERET_ID,
});
module.exports = razorpayInstance;
