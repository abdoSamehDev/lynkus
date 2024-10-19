const jwt=require('jsonwebtoken')
const bcrypt = require('bcrypt');
const crypto=require('crypto');
const asyncHandler = require('express-async-handler')
const ApiError = require('../../utils/apiError')
 const User=require('../users/model')
 const {createAccessToken,createRefreshToken}=require("./createTokens")
 const RefreshToken=require('./RefreshTokenModel')
const sendEmail=require('../../utils/sendEmail')

 exports.registerUser=asyncHandler(async(req,res,next)=>{
    const {name,email,password,userName}=req.body
    const isExist=await User.findOne({
    $or:[
            {email},
            {userName}
        ]
    })
    if(isExist)
    {
      return  next(new ApiError('Email or userName already exists',400))
    }
    const user=await User.create({name,email,password,userName})
    const Suer=user.toObject();
    delete Suer.password
  
    res.status(201).json({message:'Register Successful',data:Suer})

 })
 exports.login = asyncHandler(async (req, res, next) => {
    
    const user = await User.findOne({ userName: req.body.userName }).select("+password");

   
    if (!user) {
        return next(new ApiError('Incorrect userName or password', 401)); 
    }

    
    const passwordMatch = await bcrypt.compare(req.body.password, user.password);

    if (!passwordMatch) {
        return next(new ApiError('Incorrect userName or password', 401)); 
    }

    
    const AccessToken = createAccessToken(user._id);
    const refreshToken =  createRefreshToken(user._id);

    
    await RefreshToken.create({ token: refreshToken,
        user: user._id,
          expiresAt: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000 //7 days in milliseconds
        ) });
        
    // Set the refreshToken as a cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // prevent xss attacks and cookies is sent over HTTP
      secure: false, // make sure the token is only sent over encrypted HTTPS connections.
      sameSite: 'Strict', // sent from same site prevent CSRF attacks
      path: '/', // make sure cookie accessible to all routes
    });


  const Suer=user.toObject();
  delete Suer.password
  res.status(200)
  .json({ message:'User logged in successfully',data:Suer, AccessToken });
    
   
});


  exports.refreshAccessToken = asyncHandler(async (req, res, next) => {
    const {refreshToken} = req.cookies;
    
    
    if (!refreshToken) {
      return next(new ApiError('UnAuthorized',401))
    }
  
    const storedToken = await RefreshToken.findOne({ token: refreshToken });
    if (!storedToken) {
        return next(new ApiError('Forbidden Refresh Token not Exist',403))
    }
   
    const decoded =jwt.verify(storedToken.token, process.env.JWT_Refresh_SECRET_KEY)
      
    if (!decoded) {
        return next(new ApiError('Forbidden Refresh Token not Exist',403))
    }
          // Implement refresh token rotation: generate a new refresh token
    const newRefreshToken = createRefreshToken(decoded.userId);

    // Store the new refresh token and delete the old one
    await RefreshToken.deleteOne({ token: storedToken.token });
    await new RefreshToken({ token: newRefreshToken }).save();

    // Set the new refresh token as a cookie
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
      const AccessToken =createAccessToken(decoded.userId)
      res.json({AccessToken:AccessToken} );
    });

exports.authenticate = asyncHandler(async (req, res, next) =>{


const token=  req.headers.authorization &&req.headers.authorization.startsWith('Bearer')?
req.headers.authorization.split(' ')[1]:null

if(!token) return next(new ApiError('you are not login , login now ',401))

    
        const decoded = jwt.verify(token, process.env.JWT_Access_SECRET_KEY);
        
        const currUser = await User.findById({_id:decoded.userId});

       if (!currUser) {
            return next(new ApiError('Invalid User', 401));
        }
    



       
       
  // const refreshToken = req.cookies.refreshToken || req.headers['x-refresh-token'];

  // if (!refreshToken) {
  //   return next(new ApiError('Invalid or expired refresh token. ', 401));
  // }


  //       const checkRefreshToken =RefreshToken.findOne(refreshToken)

  // if (!checkRefreshToken) {
  //   return next(new ApiError('Invalid or expired refresh token.', 401));
  // }
   
            req.user=currUser;
            next();
}
 
)

exports.forgotPassword = asyncHandler(async (req, res, next) => {
   
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new ApiError(`There is no user with that email ${req.body.email}`, 404)
      );
    }
    
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(resetCode)
      .digest('hex');
  
    
    user.passwordResetCode = hashedResetCode;
    
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
    user.passwordResetVerified = false;
  
    await user.save();
  
    
    const message = `
  <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
    <h2 style="text-align: center; color: #007BFF;">Password Reset Request</h2>
    <p>Hi <strong>${user.userName}</strong>,</p>
    <p>We received a request to reset the password for your Lynkus account. Please use the following code to reset your password:</p>
    <div style="text-align: center; margin: 20px 0;">
      <span style="font-size: 24px; font-weight: bold; color: #007BFF;">${resetCode}</span>
    </div>
    <p>This code is valid for the next 10 minutes. If you did not request this password reset, please ignore this email and your account will remain secure.</p>
    <p>Thanks for helping us keep your account safe!</p>
    <p style="margin-top: 40px;">Best regards,</p>
    <p style="font-size: 18px; font-weight: bold; color: #007BFF;">The Lynkus Team</p>
    <hr style="margin-top: 40px; border-color: #f1f1f1;">
    <p style="font-size: 12px; color: #777;">If you need further assistance, please contact our support team at <a href="mailto:support@lynkus.com" style="color: #007BFF; text-decoration: none;">support@lynkus.com</a></p>
  </div>
`
    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset code (valid for 10 min)',
        message,
      });
    } catch (err) {
      console.error('Error sending email:', err); 
      user.passwordResetCode = undefined;
      user.passwordResetExpires = undefined;
      user.passwordResetVerified = undefined;
  
      await user.save();
      return next(new ApiError('There is error in sending email', 500));
    }
    
    res
      .status(200)
      .json({ status: 'Success', message: 'ResetCode sent to email' });
  });
  
  
  exports.verifyPasswordResetCode = asyncHandler(async (req, res, next) => {
   
    const hashedResetCode = crypto
      .createHash('sha256')
      .update(req.body.resetCode)
      .digest('hex');
  
    const user = await User.findOne({
      passwordResetCode: hashedResetCode,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      return next(new ApiError('ResetCode invalid or expired'));
    }
  
 
    user.passwordResetVerified = true;
    await user.save();
  
    res.status(200).json({
      status: 'Success',
    });
  });
  

  exports.resetPassword = asyncHandler(async (req, res, next) => {
 
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return next(
        new ApiError(`There is no user with email ${req.body.email}`, 404)
      );
    }
  
    if (!user.passwordResetVerified) {
      return next(new ApiError('ResetCode not verified', 400));
    }
  const {newPassword}=req.body;
    user.password = newPassword
    user.passwordResetCode = undefined;
    user.passwordResetExpires = undefined;
    user.passwordResetVerified = undefined;
  
    await user.save();
 
    const refreshToken = createRefreshToken(user._id)
    
    const AccessToken = createAccessToken(user._id);
    res
    .status(200)
    .cookie('refreshToken', refreshToken, { httpOnly: true, secure: true })
    .json({ AccessToken });
  });
  


    exports.logout = asyncHandler(async (req, res, next) => {
        const {refreshToken} = req.cookies;
      
        if (!refreshToken) {
          return next(new ApiError('Invalid Refresh Token or no exist',204))
        }
      
        
        await RefreshToken.findOneAndDelete({ token: refreshToken });
      
        res.clearCookie('refreshToken');

        res.status(200).json({ message: 'Logged out successfully' });
      });
