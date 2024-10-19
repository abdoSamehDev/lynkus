const jwt = require('jsonwebtoken');
const fs = require('fs');
const mongoose = require('mongoose');
const Post = require('./model');
const Like = require('../likes/model');
const Comment = require('../comments/model');
const User = require('../users/model');


// Get likes and comments count for a post
const getLikesAndCommentsCount = async (postId) => {
    const likesCount = await Like.countDocuments({ postId });
    const commentsCount = await Comment.countDocuments({ postId });
    return { likesCount, commentsCount };
};

// Check if a user likes a specific post
const userLikesPost = async (postId, userId) => {
    const like = await Like.findOne({ postId, userId });
    return !!like;
};

// Create a new post
exports.createPost = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { postBody } = req.body;
        const authorId = decoded.userId;

        if (!postBody || !authorId) {
            return res.status(400).send({ message: 'Post body is required' });
        }

        // Construct the image URL if the image exists
        const image = req.file ? req.file.filename : null;

        const post = new Post({ image, body: postBody, authorId });
        await post.save();

        res.status(201).send(post);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).send(error);
    }
};

// Get a single post by ID along with likes, comments count, and user information
exports.getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('authorId');
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const {userId} = decoded;

        // Fetch user details
        const user = await User.findById(post.authorId);
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }

        // Prepend the base URL to the image if it exists
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        if (post.image) {
            const imageFilename = post.image.split('/').pop();
            post.image = `${baseUrl}/uploads/posts/${imageFilename}`;
        }

        // Get likes and comments count
        const { likesCount, commentsCount } = await getLikesAndCommentsCount(post._id);

        const likedByUser = await userLikesPost(post._id, userId);

        res.status(200).send({
            post,
            likes: likesCount,
            comments:commentsCount,
            userName: user.userName || "unknown UserName",
            name: user.name || "unknown User",
            likedByUser:likedByUser
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).send({ message: 'Invalid Post ID' });
        }
        res.status(500).send({ message: 'Error retrieving post', error });
    }
};

// Update a post by ID
exports.updatePost = async (req, res) => {
    try {
        const { body } = req.body;
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const authorId = decoded.userId;

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        // Ensure the user updating the post is the author
        if (post.authorId.toString() !== authorId) {
            return res.status(403).send({ message: 'Unauthorized to update this post' });
        }

        // Update post fields
        if (body) post.body = body;
        if (req.file) {
            post.image = req.file.path;
        }

        await post.save();
        const { likesCount, commentsCount } = await getLikesAndCommentsCount(post._id);
        const likedByUser = await userLikesPost(post._id, authorId)
        const user = await User.findById(authorId);
        res.status(200).send({
            post,
            likes: likesCount,
            comments: commentsCount,
            userName: user.userName,
            name: user.name,
            likedByUser:likedByUser
        });
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).send({ message: 'Invalid Post ID' });
        }
        res.status(500).send({ message: 'Error updating post', error });
    }
};

// Delete a post by ID
exports.deletePost = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const authorId = decoded.userId;

        // Find the post by ID
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).send({ message: 'Post not found' });
        }

        // Check if the current user is the author of the post
        if (post.authorId.toString() !== authorId) {
            return res.status(403).send({ message: 'Unauthorized to delete this post' });
        }

        // Delete the post from the database using deleteOne
        await post.deleteOne();

        if (post.image) {
            fs.unlink(post.image, (err) => {
                if (err) {
                    console.error('Error deleting image:', err);
                }
            });
        }

        res.status(200).send({ message: 'Post deleted successfully' });
    } catch (error) {
        // Check for invalid ObjectId format
        if (error.kind === 'ObjectId' || error.name === 'CastError') {
            return res.status(400).send({ message: 'Invalid Post ID' });
        }

        // Log and send any other errors
        console.error('Error deleting post:', error);
        res.status(500).send({ message: 'Error deleting post', error: error.message });
    }
};

// Get all posts
exports.getAllPosts = async (req, res) => {
    try {
        const posts = await Post.find().populate('authorId');
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const {userId} = decoded;
        const baseUrl = `${req.protocol}://${req.get('host')}`;

        const postsWithCounts = await Promise.all(posts.map(async post => {
            console.log(post.authorId);
            const user = await User.findById(post.authorId);

            // Check if user is found
            const userName = user ? user.userName : "unknown UserName";
            const name = user ? user.name : "unknown User";

            const { likesCount, commentsCount } = await getLikesAndCommentsCount(post._id);

            const likedByUser = await userLikesPost(post._id, userId);
            if (post.image) {
                const imageFilename = post.image.split('/').pop();
                post.image = `${baseUrl}/uploads/posts/${imageFilename}`;
            }

            return {
                ...post._doc,
                likes: likesCount,
                comments: commentsCount,
                userName: userName,
                name: name,
                likedByUser:likedByUser
            };
        }));

        res.status(200).send(postsWithCounts);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).send({ message: 'Error retrieving posts', error: error.message || error });
    }
};

// Helper function to prepend base URL to image paths
const prependBaseUrlToImages = (posts, req) => {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    posts.forEach(post => {
        if (post.image) {
            post.image = `${baseUrl}/uploads/posts/${post.image}`;
        }
    });
};




exports.getPostsByUser = async (req, res) => {
    try {
        const posts = await Post.find({ authorId: req.params.userId }).populate('authorId');
        if (!posts.length) {
            return res.status(200).json({ message: 'No posts found for this user', posts: [] });
        }
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { userId } = decoded;

        // Prepend base URL to image paths
        prependBaseUrlToImages(posts, req);

        // Add likes and comments count to each post
        const postsWithCounts = await Promise.all(posts.map(async post => {
            // Convert the post to a plain object
            const postObj = post.toObject();

            const { likesCount, commentsCount } = await getLikesAndCommentsCount(post._id);
            const likedByUser = await userLikesPost(post._id, userId); // Check if the user likes this post
            const user = await User.findById(post.authorId);

            // Assign new properties
            postObj.likesCount = likesCount;
            postObj.commentsCount = commentsCount;
            postObj.userName = user.userName || "unknown UserName";
            postObj.name = user.name || "unknown User";
            postObj.likedByUser = likedByUser;

            return postObj;
        }));

        res.status(200).send(postsWithCounts);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).send({ message: 'Invalid User ID' });
        }
        res.status(500).send({ message: 'Error retrieving user posts', error });
    }
};

// Get all posts that a user has liked with user information
exports.getPostsLikedByUser = async (req, res) => {
    try {
        const likedPosts = await Like.find({ userId: req.params.userId }).select('postId');
        const postIds = likedPosts.map(like => like.postId);

        if (!postIds.length) {
            return res.status(200).json({ message: 'No liked posts found for this user', posts: [] });
        }

        const posts = await Post.find({ _id: { $in: postIds } }).populate('authorId');

        // Prepend base URL to image paths
        prependBaseUrlToImages(posts, req);

        // Add likes and comments count to each post
        const postsWithCounts = await Promise.all(posts.map(async post => {
            // Convert the post to a plain object
            const postObj = post.toObject();

            const { likesCount, commentsCount } = await getLikesAndCommentsCount(post._id);
            const user = await User.findById(post.authorId);

            // Assign new properties
            postObj.likesCount = likesCount;
            postObj.commentsCount = commentsCount;
            postObj.userName = user.userName || "unknown UserName";
            postObj.name = user.name || "unknown User";
            postObj.likedByUser = true; // Since the user liked these posts, this is true by default.

            return postObj;
        }));

        res.status(200).send(postsWithCounts);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).send({ message: 'Invalid User ID' });
        }
        res.status(500).send({ message: 'Error retrieving liked posts', error });
    }
};

exports.searchPosts = async (req, res) => {
    try {
        // Use regex for partial matching, case-insensitive
        const searchTerm = req.params.q;
        const regex = new RegExp(searchTerm, 'i'); // 'i' makes it case-insensitive

        const posts = await Post.find({ body: { $regex: regex } }).populate('authorId');

        if (!posts.length) {
            return res.status(200).json({ message: 'No posts found for this search term', posts: [] });
        }

        // Prepend base URL to image paths
        prependBaseUrlToImages(posts, req);

        // Add likes and comments count to each post
        for (const post of posts) {
            if (!mongoose.Types.ObjectId.isValid(post._id)) {
                return res.status(400).json({ message: 'Invalid Post ID', post });
            }

            const { likesCount, commentsCount } = await getLikesAndCommentsCount(post._id);

            if (!post.authorId) {
                return res.status(400).json({ message: 'Invalid Author ID', post });
            }

            const user = await User.findById(post.authorId);
            if (!user) {
                return res.status(404).json({ message: 'User not found for this post', post });
            }
            const likedByUser = await userLikesPost(post._id, post.authorId);

            post.likesCount = likesCount;
            post.commentsCount = commentsCount;
            post.userName = user.userName || "unknown UserName";
            post.name = user.name || "unknown User";
            post.likedByUser= likedByUser;
        }

        res.status(200).send(posts);
    } catch (error) {
        console.error('Error details:', error);
        res.status(500).send({ message: 'Error searching posts', error: error.message || error });
    }
};
