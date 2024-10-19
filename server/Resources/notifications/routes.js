const express = require('express');
const router = express.Router();
const { getNotifications, deleteNotification, deleteNotifications } = require('./controller');
const { authenticate } = require('../auth/authController');

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: API for managing user notifications
 *   securitySchemes:
 *     tokenAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - tokenAuth: []  # Requires authentication
 *     responses:
 *       200:
 *         description: A list of notifications for the user.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Notifications:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       id:
 *                         type: string
 *                       from:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           profileImg:
 *                             type: string
 *                       content:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       read:
 *                         type: boolean
 *       401:
 *         description: Unauthorized. User must be authenticated.
 */

/**
 * @swagger
 * /notifications/{id}:
 *   delete:
 *     summary: Delete a notification by ID
 *     tags: [Notifications]
 *     security:
 *       - tokenAuth: []  # Requires authentication
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the notification to delete.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Invalid notification ID.
 *       404:
 *         description: Notification not found.
 */

/**
 * @swagger
 * /notifications:
 *   delete:
 *     summary: Delete all notifications for the authenticated user
 *     tags: [Notifications]
 *     security:
 *       - tokenAuth: []  # Requires authentication
 *     responses:
 *       200:
 *         description: All notifications deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized. User must be authenticated.
 */

router.use(authenticate);
router.get('/', getNotifications);
router.delete('/:id', deleteNotification);
router.delete('/', deleteNotifications);

module.exports = router;
