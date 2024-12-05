var jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const otpAuth = async (req, res, next) => {
  // Get the user from the jwt token and add id to req object
  try {
    const token = req.headers["auth-token"]; // or req.get('auth-token')
    // console.log(req.header.json());
    console.log(token);
    if (!token) {
      console.log("token not found");
      res
        .status(401)
        .send({ error: "Please authenticate using a valid token" });
    }
    const data = jwt.verify(token, JWT_SECRET);
    console.log(data);

    req.user = data.user;

    next();
  } catch (error) {
    res.status(401).send({ error: "Please authenticate using a valid token" });
  }
};

module.exports = otpAuth;
