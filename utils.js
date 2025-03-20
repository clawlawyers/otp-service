const fast2sms = require("fast-two-sms");

const sendMobileOtp = async (phone, otp) => {
  const options = {
    authorization: process.env.FAST2SMS_API_KEY, // Use an environment variable
    message: `Your verification code is ${otp}`,
    numbers: [phone],
  };

  try {
    const response = await fast2sms.sendMessage(options);
    console.log(response);
    if (response.status_code === 200) {
      return { success: true, message: "OTP sent successfully" };
    } else {
      return {
        success: false,
        message: response.message || "Failed to send OTP",
      };
    }
  } catch (error) {
    return { success: false, message: error.message || "An error occurred" };
  }
};

const sendBulkSMS = async (otp, website, numbers) => {
  const message = `${otp} is your verfication code for CLAWLAW`;

  // const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${
  //   process.env.FAST2SMS_API_KEY
  // }&message=${encodeURIComponent(
  //   message
  // )}&language=english&route=q&numbers=${numbers.join(",")}`;
  const url = `https://www.fast2sms.com/dev/bulkV2?authorization=${process.env.FAST2SMS_API_KEY}&sender_id=CLAWLG&message=181830&variables_values=${otp}&route=dlt&numbers=${numbers}`;

  try {
    const response = await fetch(url, {
      method: "GET",
    });
    const data = await response.json();

    if (response.ok) {
      return { success: true, data };
    } else {
      return { success: false, error: data.message || "Failed to send SMS" };
    }
  } catch (error) {
    return { success: false, error: error.message || "An error occurred" };
  }
};

module.exports = { sendMobileOtp, sendBulkSMS }; // Use module.exports to export the function
