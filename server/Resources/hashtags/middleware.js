const { body, validationResult } = require('express-validator');
const Post = require('./model');

// Validation rules for hashtag
exports.validateHashtag = [
    // Check that text and postId are provided
    body('text').notEmpty().withMessage('Text is required'),
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
