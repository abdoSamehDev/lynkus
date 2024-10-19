const express = require('express');

const router = express.Router();
const { registerUser, login, logout, forgotPassword, verifyPasswordResetCode, resetPassword, refreshAccessToken } = require('./authController');
const { loginValidator, registerValidator } = require('./Validator');
// const {UploadUserImgs,resizeImg}=require('../users/userController')

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     tokenAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint allows a new user to register by providing their name, email, password, and other details. It checks if the email or username already exists before creating a new user.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The username for the account.
 *               name:
 *                 type: string
 *                 description: The full name of the user.
 *               email:
 *                 type: string
 *                 description: The user's email address.
 *               password:
 *                 type: string
 *                 description: The password for the account.
 *               passwordConfirm:
 *                  type: string
 *                  description: The user's password confirmation
 *             required:
 *               - name
 *               - email
 *               - password
 *               - userName
 *               - passwordConfirm
 *     responses:
 *       201:
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Register Successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     userName:
 *                       type: string
 *                     _id:
 *                       type: string
 *                     id:
 *                       type: string
 *       400:
 *         description: Bad request. Email or name already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email or name already exists.
 */
router.post('/register',registerValidator, registerUser);
//router.post('/register', UploadUserImgs, resizeImg,registerValidator, registerUser); //to form-data When add ProfileImg in register

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in an existing user
 *     description: This endpoint allows an existing user to log in by providing their username and password. It verifies the user's identity and returns a success message if the login is successful
 * 
 *                   <h3>The refresh token is automatically stored in an HTTP-only cookie and not included in the response body.
 *                    its ok to use The AccessToken as normal Token Without Caring About The Refresh Token
 *                        .</h3>.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *                 description: The username of the user.
 *               password:
 *                 type: string
 *                 description: The password for the account.
 *             required:
 *               - userName
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully.
 *         content:
 *         
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login Successful
 *                 AccessToken:
 *                   type: string
 *                   description: A JWT token for authentication.
 *                 refreshToken:
 *                   type: string
 *                   description: "The refresh token is automatically stored in a secure, HTTP-only cookie and **will not** be visible in the response body."
 *                   example: "Stored in cookie"
 *       401:
 *         description: Unauthorized. Incorrect username or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Incorrect username or password.
 */
router.post('/login', loginValidator, login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out the current user
 *     tags: [Auth]
 *     security:
 *       - tokenAuth: []  # Require tokenAuth for this route
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post('/logout', logout);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh the access token
 *     tags: [Auth]
 *     security:
 *       - tokenAuth: []  # Require tokenAuth for this route
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/refresh', refreshAccessToken);

/**
 * @swagger
 * /auth/forgotPassword:
 *   post:
 *     summary: Request a password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *             required:
 *               - email
 *     responses:
 *       200:
 *         description: Password reset email sent
 *       400:
 *         description: Bad request
 */
router.post('/forgotPassword', forgotPassword);

/**
 * @swagger
 * /auth/verifyResetCode:
 *   post:
 *     summary: Verify password reset code
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *             required:
 *               - code
 *     responses:
 *       200:
 *         description: Reset code verified successfully
 *       400:
 *         description: Invalid reset code
 */
router.post('/verifyResetCode', verifyPasswordResetCode);

/**
 * @swagger
 * /auth/resetPassword:
 *   put:
 *     summary: Reset user password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Bad request
 */
router.put('/resetPassword', resetPassword);

module.exports = router;
