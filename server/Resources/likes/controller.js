const Like = require('./model');
const Post = require('../posts/model');
const Notification = require('../notifications/model');
// Like a post
exports.likePost = async (req, res) => {
    try {
        const { postId } = req.body;
        const userId = req.user._id;

        // Check if the user has already liked the post
        const existingLike = await Like.findOne({ postId, userId });
        if (existingLike) {
            // If like exists, remove it (unlike)
            await Like.deleteOne({ _id: existingLike._id });
            return res.status(200).send({ message: 'Post unliked successfully' });
        }

        // If like doesn't exist, create a new like
        const like = new Like({ postId, userId });
        await like.save();

        // Notify the post owner about the new liked post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const notification = new Notification({
            to: post.authorId,
            from: req.user._id,
            content: `${req.user.userName} liked your post`,
            type: 'LIKE',
            post: post._id
        });
        await notification.save();

        res.status(201).send(like);
    } catch (error) {
        res.status(500).send(error);
    }
};


// Get all likes for a post
exports.getLikes = async (req, res) => {
    try {
        const likes = await Like.find({ postId: req.params.postId }).populate('userId');
        res.send(likes);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Unlike a post
exports.unlikePost = async (req, res) => {
    try {
        const { postId, userId } = req.body;

        const like = await Like.findOneAndDelete({ postId, userId });
        if (!like) {
            return res.status(404).send({ message: 'Like not found' });
        }

        res.send({ message: 'Post unliked' });
    } catch (error) {
        res.status(500).send(error);
    }
};

exports.getLikesCount = async (req, res) => {
    try {
        const {postId} = req.params;

        // Count the number of likes for the post
        const likesCount = await Like.countDocuments({ postId: postId });

        return res.status(200).json({
            success: true,
            likes: likesCount,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

