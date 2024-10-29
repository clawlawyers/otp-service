const fast2sms = require("fast-two-sms");


const sendMobileOtp = async (phone, otp) => {

  const options = {
    authorization: process.env.FAST2SMS_API_KEY, // Use an environment variable
    message: `Your verification code is ${otp}`,
    numbers: [phone],
  };

  try {
    const response = await fast2sms.sendMessage(options);
    console.log(response)
    if (response.status_code === 200) {
      return { success: true, message: 'OTP sent successfully' };
    } else {
      return { success: false, message: response.message || 'Failed to send OTP' };
    }
  } catch (error) {
    return { success: false, message: error.message || 'An error occurred' };
  }
};

module.exports = { sendMobileOtp }; // Use module.exports to export the function
