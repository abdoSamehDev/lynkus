const { check, validationResult } = require('express-validator');
const Post = require('./model');
const User = require('../users/model');


exports.validateAuthentication = async (req, res, next) => {
    // Ensure the request has a user ID (usually from a token or session)
    if (!req.user || !req.user.id) {
        return res.status(401).send({ message: 'Unauthorized: No user authenticated' });
    }

    try {
        // Check if the user exists in the database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(401).send({ message: 'Unauthorized: User not found' });
        }

        // User is authenticated and exists, proceed to the next middleware
        next();
    } catch (error) {
        res.status(500).send({ message: 'Server Error' });
    }
};

// Authorization middleware to check if the user is the author of the post
exports.authorizePost = async (req, res, next) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        // Check if the author ID matches the user ID
        if (post.authorId.toString() !== req.user.id) {
            return res.status(403).send({ message: 'Forbidden: You do not have permission to modify this post' });
        }

        next();
    } catch (error) {
        res.status(500).send({ message: 'Server Error' });
    }
};

// Validation rules for posts
exports.validatePost = [
    // Middleware to handle validation results
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
];
