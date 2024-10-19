
const { check } = require('express-validator');
const validatorMiddleware = require('../../Middleware/validateMiddleware');


exports.registerValidator = [
  check('name')
    .notEmpty()
    .withMessage('name required')
    .isLength({ min: 3 })
    .withMessage('Too short User name'),
  check('userName')
    .notEmpty()
    .withMessage('userName required')
    .isLength({ min: 3, max: 30 })
    .withMessage('User Name must be between 3 and 30 characters')
    .customSanitizer((value) => 
      // Replace spaces with underscores in userName
       value? value.toLowerCase().replace(/\s+/g, '_'):''
    ) .matches(/^[a-zA-Z0-9._]+$/)
    .withMessage('User name can only contain letters, numbers, underscores, and periods')
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
  check('userName')
    .notEmpty()
    .withMessage('userName required')
    
    ,

  check('password')
    .notEmpty()
    .withMessage('Password required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),

  validatorMiddleware,
];
