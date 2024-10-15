
const { check } = require('express-validator');
const validatorMiddleware = require('../../Middleware/validateMiddleware');


exports.registerValidator = [
  check('name')
    .notEmpty()
    .withMessage('User required')
    .isLength({ min: 3 })
    .withMessage('Too short User name')
,
  check('email')
    .notEmpty()
    .withMessage('Email required')
    .isEmail()
    .withMessage('Invalid email address')
    ,

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    // .isStrongPassword({
    //   minLength:6,         // Minimum length for the password
    //   minLowercase: 1,      // Minimum number of lowercase letters
    //   minUppercase: 1,      // Minimum number of uppercase letters
    //   minNumbers: 1,        // Minimum number of numbers
    //   minSymbols: 1,        // Minimum number of symbols
    //   returnScore: false,   // Return a boolean instead of score
    // }).withMessage('Password is not strong enough')
    
    .custom((password, { req }) => {
      if (password !== req.body.passwordConfirm) {
        throw new Error('Password Confirmation incorrect');
      }
      return true;
    })
    ,
    
    

  check('passwordConfirm')
    .notEmpty()
    .withMessage('Password confirmation required'),

  validatorMiddleware,
];

exports.loginValidator = [
  check('name')
    .notEmpty()
    .withMessage('Name required')
    
    ,

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  validatorMiddleware,
];
