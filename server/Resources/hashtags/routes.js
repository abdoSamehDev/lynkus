const express = require('express');
const router = express.Router();
const hashtagController = require('./controller');
const { validateHashtag } = require('./middleware');

/**
 * @swagger
 * /hashtags/from-post:
 *   post:
 *     summary: Create hashtags from a post body
 *     tags: [Hashtags]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               body:
 *                 type: string
 *                 description: The body of the post containing hashtags.
 *               postId:
 *                 type: string
 *                 description: The ID of the post the hashtags are associated with.
 *     responses:
 *       201:
 *         description: Hashtags created successfully.
 *       400:
 *         description: No hashtags found in the post body.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /hashtags/{postId}:
 *   get:
 *     summary: Get all hashtags for a specific post
 *     tags: [Hashtags]
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         description: The ID of the post to retrieve hashtags for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of hashtags for the post.
 *       404:
 *         description: Post not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /hashtags/{id}:
 *   delete:
 *     summary: Delete a hashtag
 *     tags: [Hashtags]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the hashtag to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Hashtag deleted successfully.
 *       404:
 *         description: Hashtag not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /hashtags/trending:
 *   get:
 *     summary: Get trending hashtags
 *     tags: [Hashtags]
 *     responses:
 *       200:
 *         description: List of trending hashtags.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /hashtags/{hashtag}/posts:
 *   get:
 *     summary: Get posts associated with a specific hashtag
 *     tags: [Hashtags]
 *     parameters:
 *       - in: path
 *         name: hashtag
 *         required: true
 *         description: The hashtag to retrieve posts for.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of posts associated with the hashtag.
 *       404:
 *         description: Hashtag not found.
 *       500:
 *         description: Internal server error.
 */

// Hashtag routes
router.post('/', validateHashtag, hashtagController.createHashtagsFromPost);
router.get('/:postId', hashtagController.getHashtagsByPost);
router.get('/trending', hashtagController.getTrendingHashtags);
router.get('/:hashtag/posts', hashtagController.getPostsByHashtag);
router.get('/trending/posts', hashtagController.getPostsByTrendingHashtags);
router.delete('/:id', hashtagController.deleteHashtag);

module.exports = router;


// to do
// add authentication to the routes
