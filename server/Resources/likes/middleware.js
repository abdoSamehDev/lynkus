//this is the middleware
const { body, validationResult } = require('express-validator');
const Post = require('../posts/model');

// Validation rules for like
exports.validateLike = [
    // Check that postId and userId are provided
    body('postId').notEmpty().withMessage('Post ID is required'),

    // Check for validation errors
    async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Check if the post exists
        const { postId } = req.body;
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        next();
    },
];

// validate authentication
exports.validateAuthentication = (req, res, next) => {
    if (!req.user || !req.user.id) {
        return res.status(401).send({ message: 'Unauthorized: No user authenticated' });
    }
    next();
};
