// this is the controller
const Comment = require('./model');
const Post = require('../posts/model');
const Notification = require('../notifications/model');

// Create a new comment
exports.createComment = async (req, res) => {
    try {
        const { text, postId } = req.body;

        // Retrieve userId from the token
        const userId = req.user._id;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Create a new comment with the userId from the token
        const comment = new Comment({ text, userId, postId });
        await comment.save();

        // Notify the post owner about the new comment
        const notification = new Notification({
            to: post.authorId, // Notify the post author
            from: userId, // Use the userId from the token
            type: 'COMMENT',
            post: postId,
            content: `${req.user.userName} has commented on your post`, // Use userName from req.user
            comment: comment._id,
        });
        await notification.save();

        // Populate the comment with user data before sending the response
        const populatedComment = await Comment.findById(comment._id).populate('userId', 'name userName profileImg'); // Populate the userId field

        res.status(201).json(populatedComment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Get all comments for a specific post
exports.getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.postId }).populate('userId');
        res.send(comments);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a comment
// Update a comment
exports.updateComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const userId = req.user._id;

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }

        // Check if the user is the owner of the comment
        if (comment.userId.toString() !== userId.toString()) {
            return res.status(403).send({ message: 'You are not authorized to update this comment' });
        }

        // Update the comment
        comment.text = text;
        await comment.save();

        res.send(comment);
    } catch (error) {
        res.status(500).send(error);
    }
};


// Delete a comment
exports.deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;
        // Find the comment by ID
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).send({ message: 'Comment not found' });
        }

        // Check if the user is the owner of the comment
        if (comment.userId.toString() !== userId.toString()) {
            return res.status(403).send({ message: 'You are not authorized to delete this comment' });
        }

        // Delete the comment
        await comment.deleteOne();

        res.status(200).send({ message: 'Comment deleted successfully' });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).send({ message: 'Invalid Comment ID' });
        }
        console.error('Error deleting comment:', error);
        res.status(500).send({ message: 'Error deleting comment', error: error.message || error });
    }
};

exports.getCommentsCount = async (req, res) => {
    try {
        const postId = req.params.postId;

        // Count the number of comments for the post
        const commentsCount = await Comment.countDocuments({ postId: postId });

        return res.status(200).json({
            success: true,
            comments: commentsCount,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};
