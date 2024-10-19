// this is the route
const express = require('express');

const router = express.Router();
const { authorizePost, validatePost} = require('./middleware');
const postController = require('./controller');
const { validateAuthentication } = require('./middleware');
const {postUpload} = require('../../utils/upload');
const {authenticate}= require('../auth/authController')

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
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - tokenAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               postBody:
 *                 type: string
 *                 description: The body content of the post.
 *               authorId:
 *                 type: string
 *                 description: The ID of the post's author.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file for the post.
 *             required:
 *               - postBody
 *               - authorId
 *     responses:
 *       201:
 *         description: Post created successfully.
 *       400:
 *         description: Invalid request - missing postBody or authorId.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to retrieve.
 *     responses:
 *       200:
 *         description: Post retrieved successfully.
 *       404:
 *         description: Post not found.
 *       400:
 *         description: Invalid Post ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update a post by ID
 *     tags: [Posts]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 description: The body content of the post.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file to update.
 *             required:
 *               - body
 *     responses:
 *       200:
 *         description: Post updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *                 likes:
 *                   type: integer
 *                   description: Number of likes the post has.
 *                 comments:
 *                   type: integer
 *                   description: Number of comments the post has.
 *                 userName:
 *                   type: string
 *                   description: The author's username.
 *                 name:
 *                   type: string
 *                   description: The author's name.
 *                 likedByUser:
 *                   type: boolean
 *                   description: Whether the current user has liked the post.
 *       404:
 *         description: Post not found.
 *       400:
 *         description: Invalid Post ID.
 *       403:
 *         description: Unauthorized to update this post.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the post to delete.
 *     responses:
 *       200:
 *         description: Post deleted successfully.
 *       404:
 *         description: Post not found.
 *       400:
 *         description: Invalid Post ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *       - tokenAuth: []
 *     responses:
 *       200:
 *         description: List of posts retrieved successfully.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /posts/user/{userId}:
 *   get:
 *     summary: Get all posts by a specific user
 *     tags: [Posts]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve posts for.
 *     responses:
 *       200:
 *         description: List of posts by the user.
 *       404:
 *         description: No posts found for this user.
 *       400:
 *         description: Invalid User ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /posts/likes/{userId}:
 *   get:
 *     summary: Get posts liked by a user
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve liked posts for.
 *     responses:
 *       200:
 *         description: List of posts liked by the user.
 *       404:
 *         description: No liked posts found for this user.
 *       400:
 *         description: Invalid User ID.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /posts/searchPost/{q}:
 *   get:
 *     summary: Search posts by a search term
 *     tags: [Posts]
 *     security:
 *       - tokenAuth: []
 *     parameters:
 *       - in: path
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query to match post body content.
 *     responses:
 *       200:
 *         description: List of posts matching the search query.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The post ID.
 *                   image:
 *                     type: string
 *                     description: The URL of the post image.
 *                   body:
 *                     type: string
 *                     description: The body content of the post.
 *                   likesCount:
 *                     type: number
 *                     description: Number of likes on the post.
 *                   commentsCount:
 *                     type: number
 *                     description: Number of comments on the post.
 *                   userName:
 *                     type: string
 *                     description: The username of the post author.
 *       404:
 *         description: No posts found for the search term.
 *       500:
 *         description: Internal server error.
 */


// Post routes
// Route Definitions
router.post('/', authenticate, validatePost, postUpload, postController.createPost);
router.get('/:id', authenticate, postController.getPost);
router.put('/:id', authenticate, authorizePost, validatePost, postUpload, postController.updatePost);
router.delete('/:id', authenticate, authorizePost, postController.deletePost);
router.get('/', authenticate, postController.getAllPosts);
router.get('/user/:userId', authenticate, postController.getPostsByUser);
router.get('/likes/:userId',authenticate, postController.getPostsLikedByUser);
router.get('/searchPost/:q',authenticate, postController.searchPosts);
module.exports = router;


