// this is the route
const express = require('express');

const {updateUser,deleteUser,searchUser,getUserProfile,changeUserPassword,resizeImg,UploadUserImgs}=require('./userController')
const {authenticate}=require("../auth/authController")
const {updateUserValidator,changeUserPasswordValidator}=require("./Validator")

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and operations
 *   securitySchemes:
 *     tokenAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Search for users
 *     description: Returns a list of users. If no parameters are provided, it will return all users with pagination.
 *     tags: [Users]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by a keyword (userName)
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users per page for pagination
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 */

router.get('/', authenticate, searchUser);

/**
 * @swagger
 * /users/changePassword:
 *   put:
 *     summary: Change user password
 *     tags: [Users]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Bad request
 */
router.put('/changePassword', authenticate, changeUserPasswordValidator, changeUserPassword);

/**
 * @swagger
 * /users/profile/{id}:
 *   get:
 *     summary: Get user profile by ID 
 *     description: <h3>You Can Send MongoObjectId or "userName" of the User.</h3>
 *     tags: [Users]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID or userName of the user
 *     responses:
 *       200:
 *         description: User profile retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     _id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     userName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     profileImg:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                 FollowerCount:
 *                   type: integer
 *                   description: Number of followers
 *                 FollowingCount:
 *                   type: integer
 *                   description: Number of users the user is following
 *       404:
 *         description: User not found
 */

router.route('/profile/:id').get(authenticate, getUserProfile);

/**
 * @swagger
 * /users:
 *   delete:
 *     summary: Delete user Account
 *     tags: [Users]
 *     security:
 *        - tokenAuth: []
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.route('/').delete(authenticate, deleteUser);

/**
 * @swagger
 * /users:
 *   put:
 *     summary: Update user profile
 *     tags: [Users]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userName:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               bio:
 *                type: string
 *               profileImg:
 *                 type: string
 *                 format: binary
 *               headerImg:
 *                 type: string
 *                 format: binary
 * 
 *     responses:
 *       200:
 *         description: User profile updated
 *       400:
 *         description: Bad request
 */
router.route('/')
    .put(authenticate, UploadUserImgs, resizeImg, updateUserValidator, updateUser);

module.exports = router;
