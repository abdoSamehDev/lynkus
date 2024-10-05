const express = require('express');

const router = express.Router();

const { createBookmark, deleteBookmark, getUserBookmarks } = require('./controller');
const { createBookMarkValidator, deleteBookMarkValidator } = require('./Validator');



/**
 * @swagger
 * /api/bookmarks:
 *   get:
 *     summary: Retrieve bookmarks for the authenticated user.
 *     tags:
 *       - Bookmarks 
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 results:
 *                   type: integer
 *                   example: 2
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 totalPages:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "60e4fe4f9c1d4c001f65a09f"
 *                       user:
 *                         type: string
 *                         example: "66dc408aec99f7b928aa2ef6"
 *                       post:
 *                         type: string
 *                         example: "60e4fe4f9c1d4c001f65a0a0"
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["tag1", "tag2"]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2021-07-01T12:00:00Z"
 */

/**
 * @swagger
 * /api/bookmarks/{id}:
 *   post:
 *     summary: Create a new bookmark.
 *     tags:
 *       - Bookmarks  
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the post to be bookmarked.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "66dc408aec99f7b928aa2ef6"
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["tag1", "tag2"]
 *     responses:
 *       201:
 *         description: Bookmark created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bookmark created successfully"
 *                 bookmark:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60e4fe4f9c1d4c001f65a09f"
 *                     user:
 *                       type: string
 *                       example: "66dc408aec99f7b928aa2ef6"
 *                     post:
 *                       type: string
 *                       example: "60e4fe4f9c1d4c001f65a0a0"
 *                     tags:
 *                       type: array
 *                       items:
 *                         type: string
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2021-07-01T12:00:00Z"
 *       404:
 *         description: Invalid post ID
 */

/**
 * @swagger
 * /api/bookmarks/{id}:
 *   delete:
 *     summary: Delete a bookmark.
 *     tags:
 *       - Bookmarks  
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the bookmark to be deleted.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bookmark deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bookmark deleted successfully"
 *       404:
 *         description: Bookmark not found
 */

router.route('/').get(getUserBookmarks);
router.route('/:id').post(createBookMarkValidator, createBookmark).delete(deleteBookMarkValidator, deleteBookmark);

module.exports = router;
