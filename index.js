const express = require('express');
const { body, validationResult } = require("express-validator");
const OtpMobile = require("./models/MobileOtp");
const connectToMongo  = require("./db");
var jwt = require("jsonwebtoken");
var cors = require("cors");
const { sendMobileOtp } = require("./utils")
const otpAuth = require("./mddleware")


const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT;


const app = express();
app.use(cors());
app.use(express.json());




app.post(
    "/generateOTPmobile",
  
    [
      body("phone", "Enter a valid phone ").isNumeric().isLength({
        min: 10,
        max: 10,
      }),
    ],
    async (req, res) => {
      try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const { phone } = req.body;
      const digits = "0123456789";
      let otp = "";
      for (let i = 0; i < 6; i++) {
        otp += digits[Math.floor(Math.random() * 10)];
      }
      
      const user = await OtpMobile.findOne({ phone: phone });
    
      if (!user) {
        
        const gen_otp = await OtpMobile.create({
          phone: phone,
          OTP: otp,
        });
      }
        else{
          const date =new  Date(user.createdAt)
          date.setSeconds(date.getSeconds() + 30);
          if(Date.now()<date){
            return res.status(400).json({"message":"try after 30 seconds"})
          }

          await OtpMobile.findByIdAndUpdate(user.id, { OTP: otp, createdAt:Date.now() });
        }
       
      
   
      var isSent = sendMobileOtp( phone, otp );

    
      if (isSent) {
        const data = {
          user: {
            phone:phone,
          },
        };
        const authtoken = jwt.sign(data, JWT_SECRET);
       return res.status(200).json({ authtoken: authtoken });
      }
      return res.status(400);
    } catch (e) {
      console.log(e);
      return res.send(500);
    }
    }
  );


app.post("/verifyotpmobile",otpAuth, [
  body("phone", "Enter a valid email").isNumeric().isLength({
    min: 10,
    max: 10,
  }),
  body("otp", "Otp cannot be blank").exists(),
], async (req, res) => { try {



  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { phone, otp } = req.body;
  
  let user = await OtpMobile.findOne({
    phone: phone,
    OTP: otp,
  });

  if (!user) {
    return res
      .status(400)
      .json({ error: "Please try to login with correct credentials" });
  }
  else{
    await OtpMobile.findByIdAndDelete(user.id)
  }
  const data = {
    
      phone:phone,
      verified:true
    
  };
  const authtoken = jwt.sign(data, JWT_SECRET);
   return res.status(200).json({authtoken:authtoken  });
} catch (error) {
  return res.status(400).json({ error: "server error" });
}
})

app.listen(PORT, (error) =>{
  connectToMongo()
    if(!error) console.log("Server is Successfully Running,  and App is listening on port "+ PORT)
    else  console.log("Error occurred, server can't start", error);
    }
);