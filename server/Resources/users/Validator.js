const {check,body}=require('express-validator')
const bcrypt = require('bcrypt')
const validatorMiddleware=require('../../Middleware/validateMiddleware')
const User=require('./model')
const {cleanupTempImages} =require('../../utils/cleanupTempImages')


exports.updateUserValidator = [
  body('name')
    .optional(),

  check('email')
  .optional()
    .notEmpty().withMessage('Email Address is required')
    .isEmail().withMessage('Invalid email address')
    .custom(async (val, { req }) => {
      const user = await User.findOne({ email: val });
      // Check if email is already used by another user
      if (user && user._id.toString() !== req.user._id.toString()) {
        cleanupTempImages(req); // Clean temp images if error
        return Promise.reject(new Error('E-mail already in use'));
      }
    }),

  check('userName')
  .optional()
    .notEmpty().withMessage('userName Required')
    .isLength({ min: 3, max: 20 })
    .customSanitizer((value) => 
      // Replace spaces with underscores in userName
      value ? value.toLowerCase().replace(/\s+/g, '_') : ''
    )
    .matches(/^[a-zA-Z0-9._]+$/).withMessage('User name can only contain letters, numbers, underscores, and periods')
    .custom((value) => {
      if (/^\./.test(value) || /^\_/.test(value)) {
        throw new Error('User name cannot start with a period or underscore');
      }
      if (/\.\./.test(value) || /\_\_/.test(value)) {
        throw new Error('User name cannot contain consecutive periods or underscores');
      }
      if (/\.$/.test(value) || /\_$/.test(value)) {
        throw new Error('User name cannot end with a period or underscore');
      }
      return true;
    })
    .custom(async (val, { req }) => {
      const user = await User.findOne({ userName: val });
      // Check if userName is already used by another user
      if (user && user._id.toString() !== req.user._id.toString()) {
        cleanupTempImages(req); // Clean temp images if error
        return Promise.reject(new Error('userName already in use'));
      }
    }),

  check('profileImg')
    .optional(),

  body('bio')
    .optional(),

  validatorMiddleware,
];

 

  exports.changeUserPasswordValidator = [
    
    body('currentPassword')
      .notEmpty()
      .withMessage('current password required'),
    body('passwordConfirm')
      .notEmpty()
      .withMessage(' password confirm required'),
    body('password')
      .notEmpty()
      .withMessage('new password required')
      .isLength({ min: 6 })
       // .isStrongPassword({
    //   minLength:6,         // Minimum length for the password
    //   minLowercase: 1,      // Minimum number of lowercase letters
    //   minUppercase: 1,      // Minimum number of uppercase letters
    //   minNumbers: 1,        // Minimum number of numbers
    //   minSymbols: 1,        // Minimum number of symbols
    //   returnScore: false,   // Return a boolean instead of score
    // }).withMessage('Password is not strong enough')
      .custom(async (val, { req }) => {
      
        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
          throw new Error('There is no user for this id');
        }
        const isCurrentPassword = await bcrypt.compare(
          req.body.currentPassword,
          user.password
        );
        if (!isCurrentPassword) {
          throw new Error('Invalid currentPassword');
        }

        const isValidPassword = await bcrypt.compare(
          val,
          user.password
        );
        if (isValidPassword) {
          throw new Error('New password should be different from old password');
        }
          
        
  
        
        if (val !== req.body.passwordConfirm) {
          throw new Error('Password Confirmation incorrect');
        }
        return true;
      }),
    validatorMiddleware,
  ];