const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();


const connectDB = () => {
    mongoose
      .connect(process.env.MONGO_URI)
      .then((conn) => {
        console.log(`Database Connected: ${conn.connection.host}`);
      })
    }

module.exports = connectDB;
