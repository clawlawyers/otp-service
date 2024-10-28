const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const MONGODB_URI = process.env.MONGODB_URI;


const connectToMongo = () => {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("connected");
    })
    .catch((e) => {
      console.log(e);
    });
};

module.exports = connectToMongo;
