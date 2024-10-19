// this is the route
const express = require('express');

const router = express.Router();
const {authenticate}=require('../auth/authController')

const {getRecommendedFollowers,getUserFollowers,getUserFollowing,followUser,getFollowStats, getFollowStatsByid}=require('./controller')




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
 * 
 * 
 * 
 * @swagger
 * /follows/followers/{id}:
 *   get:
 *     summary: Get User Followers
 *     tags: [Follows]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user whose followers are to be retrieved.
 *                      <h4>You can send MongoObjectId or 'userName' of the user</h4>
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by a keyword (name)
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
 *         description: A list of followers for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       user:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           id:
 *                             type: string
 *                           userName:
 *                             type: string
 *                           name:
 *                             type: string
 *                           profileImg:
 *                             type: string
 *                 totalPages:
 *                   type: integer
 *                 page:
 *                   type: integer
 *       400:
 *         description: Invalid user ID or user not found.
 *       404:
 *         description: User not found.
 */
router.get('/followers/:id',authenticate, getUserFollowers)


/**
 * @swagger
 * /follows/following/{id}:
 *   get:
 *     summary: Get User Following
 *     tags: [Follows]
 *     security:
 *       - tokenAuth: []
 *     parameters:

 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user whose followings are to be retrieved.
 *                      <h4>You can send MongoObjectId or 'userName' of the user</h4>
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by a keyword (name)
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
 *         description: A list of users that the specified user is following.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       following:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                           id:
 *                             type: string
 *                           userName:
 *                             type: string
 *                           name:
 *                             type: string
 *                           profileImg:
 *                             type: string
 *                 totalPages:
 *                   type: integer
 *                 page:
 *                   type: integer
 *       400:
 *         description: Invalid user ID or user not found.
 *       404:
 *         description: User not found.
 */
router.get('/following/:id',authenticate, getUserFollowing)
/**
 * @swagger
 * /follows/{id}:
 *   post:
 *     summary: Follow a User
 *     tags: [Follows]
 * 
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the user to follow or unfollow.
 *         schema:
 *           type: string
 *     security:
 *       - tokenAuth: []  # Requires authentication
 *     responses:
 *       200:
 *         description: User followed or unfollowed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 notification:
 *                   type: object
 *                   nullable: true
 *       400:
 *         description: Invalid user ID or can't follow yourself.
 *       404:
 *         description: User not found.
 */
router.post('/:id', authenticate,followUser)
/**
 * @swagger
 * /follows/recommended:
 *   get:
 *     summary: Get Recommended Followers
 *     tags: [Follows]
 *     security:
 *       - tokenAuth: []  # Requires authentication
 *     parameters:
 *       - name: limit
 *         in: query
 *         required: false
 *         description: The maximum number of recommended users to return (default is 10).
 *         schema:
 *           type: integer
 *           example: 5
 *     responses:
 *       200:
 *         description: A list of recommended users.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 recommendedUsers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         description: The unique identifier of the user.
 *                       id:
 *                         type: string
 *                         description: The same as `_id`, included for frontend convenience.
 *                       userName:
 *                         type: string
 *                         description: The username of the user.
 *                       name:
 *                         type: string
 *                         description: The full name of the user.
 *                       profileImg:
 *                         type: string
 *                         description: The URL of the user's profile image or a default image.
 *                       isFollowing:
 *                         type: boolean
 *                         description: Indicates if the current user is following this user (always false in the context of recommendations).
 *       404:
 *         description: No recommended users found.
 *       401:
 *         description: Unauthorized. Token is missing or invalid.
 *       500:
 *         description: Internal server error.
 */

router.get('/recommended',authenticate, getRecommendedFollowers)


/**
 * @swagger
 * /follows/stats:
 *   get:
 *     summary: Get Follow Statistics
 *     tags: [Follows]
 *     security:
 *       - tokenAuth: []  # Requires authentication
 *     responses:
 *       200:
 *         description: Follow statistics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 followersCount:
 *                   type: integer
 *                   description: The number of followers.
 *                 followingCount:
 *                   type: integer
 *                   description: The number of users the current user is following.
 *       500:
 *         description: Internal server error.
 */

router.get('/stats',authenticate,getFollowStats)

/**
 * @swagger
 * /follows/stats/{userId}:
 *   get:
 *     summary: Get Follow Statistics by User ID
 *     tags: [Follows]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: The ID of the user whose follow statistics are to be retrieved.
 *         schema:
 *           type: string
 *     security:
 *       - tokenAuth: []  # Requires authentication
 *     responses:
 *       200:
 *         description: Follow statistics retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 followers:
 *                   type: integer
 *                   description: The number of followers.
 *                 following:
 *                   type: integer
 *                   description: The number of users the specified user is following.
 *       500:
 *         description: Internal server error.
 */
router.get('/stats/:userId',authenticate,getFollowStatsByid)



module.exports = router;
