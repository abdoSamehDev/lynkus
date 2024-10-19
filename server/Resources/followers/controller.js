const asyncHandler = require('express-async-handler');
const mongoose = require("mongoose");
const Notifications = require("../notifications/model");
const User = require("../users/model");
const Follows = require("./model");
const ApiError = require("../../utils/apiError");

const generateDefaultProfileImg = (userName) => `https://avatar.iran.liara.run/username?username=${userName}&background=008080&color=F0F8FF&length=1`;
const isUserFollowed = async (currentUserId, targetUserId) => {
    const followExists = await Follows.findOne({ user: currentUserId, following: targetUserId });
    return !!followExists; // Returns true if the follow relationship exists, otherwise false
};
// Follow a user
exports.followUser = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Check if user id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ApiError("Invalid user id", 400));
    }

    // Check if user exists
    const userExists = await User.findById(id);
    if (!userExists) return next(new ApiError("User not found", 404));

    // Check if the user is trying to follow themselves
    if (req.user._id.toString() === id) return next(new ApiError("You can't follow yourself", 400));

    // Check if user is already following this user
    const followsExists = await Follows.findOne({ user: req.user._id, following: id });

    // Toggle follow/unfollow
    if (followsExists) {
        // User is currently following, so unfollow
        await Follows.findByIdAndDelete(followsExists._id);
        
        // Send a response indicating the user has been unfollowed
        return res.status(200).json({ message: "User unfollowed successfully" });
    } 
        // User is not currently following, so follow
        const newFollow = new Follows({ user: req.user._id, following: id });
        await newFollow.save();

        // Send notification to the followed user
        const notification = new Notifications({
            to: id,
            from: req.user._id,
            type: "FOLLOW",
            content: `${req.user.userName} started following you`,
        });
        await notification.save();

        // Send a response indicating the user has been followed
        return res.status(200).json({ message: "User followed successfully", newFollow, notification });
    
});

// Get user's followers
exports.getUserFollowers = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const { search } = req.query;
    const query = {};

    // Determine if id is MongoId or userName
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const user = await User.findOne({ userName: id }).select('_id');
        if (!user) return next(new ApiError("User Not Found", 404));
        query.following = user._id;
    } else {
        query.following = id;
    }

    // Fetch followers
    let followers = await Follows.find(query)
        .select('user')
        .populate({
            path: 'user',
            select: 'userName profileImg name',
        })
        .skip(skip)
        .limit(limit);

    // Search 
    if (search) {
        followers = followers.filter(follower =>
            follower.user.userName.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Add fallback for profileImg and follow status
    const responseFollowers = await Promise.all(followers.map(async (follower) => ({
        ...follower.user._doc,  // Extract plain user data without Mongoose methods
        profileImg: follower.user.profileImg || generateDefaultProfileImg(follower.user.userName),
        id: follower.user._id,
        isFollowed: await isUserFollowed(req.user._id, follower.user._id), // Check if current user follows this user
    })));

    const totalCount = await Follows.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({ results: responseFollowers.length, totalPages, page, data: responseFollowers });
});

// Get user's following
exports.getUserFollowing = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    const { search } = req.query;
    const query = {};

    // Determine if id is MongoId or userName
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const user = await User.findOne({ userName: id }).select('_id');
        if (!user) return next(new ApiError("User Not Found", 404));
        query.user = user._id;
    } else {
        query.user = id;
    }

    // Fetch following users
    let following = await Follows.find(query)
        .select('following')
        .populate({
            path: 'following',
            select: 'userName profileImg name',
        })
        .skip(skip)
        .limit(limit);

    // Search functionality
    if (search) {
        following = following.filter(follow =>
            follow.following.userName.toLowerCase().includes(search.toLowerCase())
        );
    }

    // Add fallback for profileImg and follow status
    const responseFollowing = await Promise.all(following.map(async (follow) => ({
        ...follow.following._doc,  // Extract plain user data without Mongoose methods
        profileImg: follow.following.profileImg || generateDefaultProfileImg(follow.following.userName),
        id: follow.following._id,
        isFollowed: await isUserFollowed(req.user._id, follow.following._id),  // Check if current user follows this user
    })));

    const totalCount = await Follows.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
        results: responseFollowing.length,
        totalPages,
        page,
        data: responseFollowing,
    });
});

// Get recommended followers
exports.getRecommendedFollowers = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;

    // Get the users the current user follows
    const userFollowing = await Follows.find({ user: userId }).select("following");

    // Extract the user IDs of the people the current user follows
    const followingIds = userFollowing.map(f => f.following.toString());

    // Recommend random users if the user is not following anyone
    if (followingIds.length === 0) {
        const randomUsers = await User.find({ _id: { $ne: userId } }).limit(req.query.limit * 1 || 10);
        const usersWithFollowInfo = randomUsers.map(user => ({
            ...user._doc,
            profileImg: user.profileImg || generateDefaultProfileImg(user.userName),
            id: user._id,
            isFollowing: false,  // Not following any random user initially
        }));
        return res.status(200).json({ recommendedUsers: usersWithFollowInfo });
    }

    // Get the users followed by the people the current user follows (second-degree connections)
    const secondFollowing = await Follows.find({ user: { $in: followingIds } }).select("following");
    const secondFollowingIds = secondFollowing.map(e => e.following.toString());

    // Filter out users already followed by the current user and the current user itself
    const recommendedUserIds = secondFollowingIds.filter(
        id => !followingIds.includes(id) && id !== userId.toString()
    );

    // Get recommended users based on filtered IDs
    let recommendedUsers;
    if (recommendedUserIds.length > 0) {
        recommendedUsers = await User.find({ _id: { $in: recommendedUserIds } })
            .select("userName profileImg name")
            .limit(req.query.limit * 1 || 10);
    } else {
        // If no second-degree connections are found, recommend random users not followed by the user
        recommendedUsers = await User.find({ _id: { $ne: userId, $nin: followingIds } })
            .select("userName profileImg name")
            .limit(req.query.limit * 1 || 10);
    }

    // Add fallback for profileImg and isFollowing field (false by default)
    const usersWithFollowInfo = recommendedUsers.map(user => ({
        ...user._doc,
        profileImg: user.profileImg || generateDefaultProfileImg(user.userName),
        id: user._id, // Add id for easy identification in frontend
        isFollowing: false,  // Always false since they are not already followed
    }));

    res.status(200).json({ recommendedUsers: usersWithFollowInfo });
});


// Controller function to get follower and following count
exports.getFollowStats = async (req, res) => {
    try {
        const {userId} = req.params;

        // Count the number of followers (users who follow the current user)
        const followersCount = await Follows.countDocuments({ following: userId });

        // Count the number of users the current user is following
        const followingCount = await Follows.countDocuments({ user: userId });

        return res.status(200).json({
            success: true,
            followers: followersCount,
            following: followingCount,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// Controller function to get follower and following count by id
exports.getFollowStatsByid = async (req, res) => {
    try {
        const {userId} = req.params;

        // Count the number of followers (users who follow the current user)
        const followersCount = await Follows.countDocuments({ following: userId });

        // Count the number of users the current user is following
        const followingCount = await Follows.countDocuments({ user: userId });

        return res.status(200).json({
            success: true,
            followers: followersCount,
            following: followingCount,
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}
