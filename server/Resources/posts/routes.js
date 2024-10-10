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
 * /posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
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
 *               authorId:
 *                 type: string
 *                 description: The ID of the post's author.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file for the post.
 *     responses:
 *       201:
 *         description: Post created successfully.
 *       400:
 *         description: Invalid request - missing body or authorId.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
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
 *               authorId:
 *                 type: string
 *                 description: The ID of the post's author.
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Optional image file to update.
 *     responses:
 *       200:
 *         description: Post updated successfully.
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
 *   delete:
 *     summary: Delete a post by ID
 *     tags: [Posts]
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
 * /posts/searchPost:
 *   get:
 *     summary: Search posts by a search term
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query to match post body content.
 *     responses:
 *       200:
 *         description: List of posts matching the search query.
 *       404:
 *         description: No posts found for the search term.
 *       500:
 *         description: Internal server error.
 */

// Post routes
router.post('/',authenticate, validatePost, postController.createPost);
router.get('/:id', postController.getPost);
router.put('/:id',authenticate,  authorizePost, validatePost, postController.updatePost);
router.delete('/:id',authenticate, authorizePost, postController.deletePost);
router.get('/', postController.getAllPosts);
router.get('/user/:userId', postController.getPostsByUser);
router.get('/likes/:userId', postController.getPostsLikedByUser);
router.get('/searchPost', postController.searchPosts);
module.exports = router;


// to-do list
// add authentication to the routes
