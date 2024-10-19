const express = require('express');

const router = express.Router();

const users = require('./Resources/users/routes');
const posts = require('./Resources/posts/routes');
const notifications = require('./Resources/notifications/routes');
const comments = require('./Resources/comments/routes');
const likes = require('./Resources/likes/routes');
const follows = require('./Resources/followers/routes');
const hashtags = require('./Resources/hashtags/routes');
const bookmarks = require('./Resources/bookmarks/routes');
const auth = require('./Resources/auth/routes');


router.use('/auth', auth);
router.use('/users', users);
router.use('/posts', posts);
router.use('/notifications', notifications);
router.use('/comments', comments);
router.use('/likes', likes);
router.use('/follows', follows);
router.use('/hashtags', hashtags);
router.use('/bookmarks', bookmarks);

module.exports = router;
