const express = require('express');

const router = express.Router();
const { registerUser, login, logout, forgotPassword, verifyPasswordResetCode, resetPassword, refreshAccessToken, } = require('./authController');
const {loginValidator,registerValidator}=require('./Validator')

router.post('/register', registerValidator,registerUser);
router.post('/login', loginValidator,login);
router.post('/logout', logout);
router.post('/refresh',refreshAccessToken);
router.post('/forgotPassword',forgotPassword);
router.post('/verifyResetCode', verifyPasswordResetCode);
router.put('/resetPassword', resetPassword);

module.exports = router; 
