const asyncHandler = require('express-async-handler');
const Bookmark = require('./model');
const ApiError = require('../../utils/apiError');


exports.createBookmark = asyncHandler(async (req, res, next) => {

    const { tags } = req.body; 
    const userId = req.user._id; 
    const { id } = req.params; 

    

    const newBookmark = await Bookmark.create({ user: userId, post: id, tags });
   

    res.status(201).json({ message: 'Bookmark created successfully', bookmark: newBookmark });
});


exports.getUserBookmarks = asyncHandler(async (req, res, next) => {
    const userId = req.user._id; 

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const { search } = req.query;
    const query = { user: userId }; 

    if (search) {
        query.tags = { $regex: search, $options: 'i' }; 
    }

    const bookmarks = await Bookmark.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalCount = await Bookmark.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({ results: bookmarks.length, page, totalPages, data: bookmarks });
});

// Delete a bookmark
exports.deleteBookmark = asyncHandler(async (req, res, next) => {
    const { id } = req.params; 
    const userId = req.user._id; 

    const deletedBookmark = await Bookmark.findOneAndDelete({ _id: id, user: userId });

    if (!deletedBookmark) {
        return next(new ApiError("Bookmark not found", 404)); 
    }

    res.status(200).json({ message: 'Bookmark deleted successfully' });
});
