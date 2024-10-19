const Hashtag = require('./model');
const Post = require('../posts/model');

exports.createHashtagsFromPost = async (req, res) => {
    try {
        const { body, postId } = req.body;
        const hashtags = body.match(/#\w+/g);

        if (!hashtags) {
            return res.status(400).send({ message: 'No hashtags found in the post body.' });
        }

        const savedHashtags = [];
        for (let hashtagText of hashtags) {
            const text = hashtagText.substring(1);
            let hashtag = await Hashtag.findOne({ text, postId });
            if (!hashtag) {
                hashtag = new Hashtag({ text, postId });
                await hashtag.save();
            } else {
                hashtag.count += 1;
                await hashtag.save();
            }
            savedHashtags.push(hashtag);
        }

        res.status(201).send(savedHashtags);
    } catch (error) {
        res.status(500).send({ message: 'Error creating hashtags', error });
    }
};

exports.getHashtagsByPost = async (req, res) => {
    try {
        const hashtags = await Hashtag.find({ postId: req.params.postId });
        res.send(hashtags);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving hashtags', error });
    }
};

exports.deleteHashtag = async (req, res) => {
    try {
        const hashtag = await Hashtag.findByIdAndDelete(req.params.id);
        if (!hashtag) {
            return res.status(404).send({ message: 'Hashtag not found' });
        }
        res.send({ message: 'Hashtag deleted' });
    } catch (error) {
        res.status(500).send({ message: 'Error deleting hashtag', error });
    }
};

exports.getTrendingHashtags = async (req, res) => {
    try {
        const trendingHashtags = await Hashtag.find()
            .sort({ count: -1 })
            .limit(10);
        res.send(trendingHashtags);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving trending hashtags', error });
    }
};

exports.getPostsByHashtag = async (req, res) => {
    try {
        const { hashtag } = req.params;
        const foundHashtag = await Hashtag.findOne({ text: hashtag });
        if (!foundHashtag) {
            return res.status(404).send({ message: 'Hashtag not found' });
        }

        const posts = await Post.find({ _id: { $in: foundHashtag.postId } });

        res.send(posts);
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving posts for the hashtag', error });
    }
};

exports.getPostsByTrendingHashtags = async (req, res) => {
    try {
        const trendingHashtags = await Hashtag.find()
            .sort({ count: -1 })
            .limit(10);

        const postsPromises = trendingHashtags.map(async (hashtag) => {
            return await Post.find({ _id: { $in: hashtag.postId } });
        });

        const allPosts = await Promise.all(postsPromises);

        res.send(allPosts.flat());
    } catch (error) {
        res.status(500).send({ message: 'Error retrieving posts for trending hashtags', error });
    }
};
