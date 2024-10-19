const jwt=require('jsonwebtoken')

const createAccessToken = (userId) =>
    jwt.sign({ userId: userId },
         process.env.JWT_Access_SECRET_KEY, {
      expiresIn: process.env.JWT_Access_SECRET_EXPIRE,
    });
  
const createRefreshToken = (userId) =>
        jwt.sign({ userId: userId },
         process.env.JWT_Refresh_SECRET_KEY, {
      expiresIn: process.env.JWT_Refresh_SECRET_EXPIRE,
    });
    



  module.exports = {createAccessToken, createRefreshToken};