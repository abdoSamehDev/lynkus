const {check,body}=require("express-validator")
const validatorMiddleware = require("../../Middleware/validateMiddleware")
const Post=require("../posts/model")


exports.createBookMarkValidator = [
    check("id")
        .isMongoId().withMessage("Invalid ID format") 
        .custom(async (postId) => {
            const post = await Post.findById(postId); 
            if (!post) {
                return Promise.reject(new Error("Post not found")); 
            }
        }),
    body("tags")
        .optional()
        .isArray().withMessage("Tags must be an array"), 
    validatorMiddleware,
];


exports.deleteBookMarkValidator = [
  check("id").isMongoId().withMessage("Invalid product id format"),
  validatorMiddleware,
]