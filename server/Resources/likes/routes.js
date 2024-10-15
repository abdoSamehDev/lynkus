const express = require('express');
const likeController = require('./controller');
const router = express.Router();
const {validateLike} = require('./middleware');
const {validateAuthentication} = require('../posts/middleware');
const {authenticate}= require('../auth/authController')
/**
 * @swagger
 * /likes:
 *   post:
 *     summary: Like a post
 *     tags: [Likes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: The ID of the post to like.
 *               userId:
 *                 type: string
 *                 description: The ID of the user liking the post.
 *     responses:
 *       201:
 *         description: Post liked successfully.
 *       400:
 *         description: Post already liked by this user.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /likes/{postId}:
 *   get:
 *     summary: Get all likes for a specific post
 *     tags: [Likes]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to retrieve likes for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of likes for the post.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /likes:
 *   delete:
 *     summary: Unlike a post
 *     tags: [Likes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               postId:
 *                 type: string
 *                 description: The ID of the post to unlike.
 *               userId:
 *                 type: string
 *                 description: The ID of the user unliking the post.
 *     responses:
 *       200:
 *         description: Post unliked successfully.
 *       404:
 *         description: Like not found.
 *       500:
 *         description: Internal server error.
 */

// Like routes
router.post('/', authenticate, validateLike, likeController.likePost);
router.get('/:postId', likeController.getLikes);
router.delete('/', authenticate, validateLike, likeController.unlikePost);
module.exports = router;


// to-do list
// add authentication to the routes
