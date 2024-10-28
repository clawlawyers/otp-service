const mongoose = require("mongoose");

const schmea = mongoose.Schema;

const OTPMobileSchema = new schmea({
  createdAt: {
    type: Date,
    default:  Date.now,
    expires: '5m' // Document will expire  after createdAt
  },
  
  phone: {
    type: String,
    required: true,
  },
  OTP: {
    type: Number,
    required: true,
  },
});
const OtpMobile = mongoose.model("OTPMobile", OTPMobileSchema);
module.exports = OtpMobile;
