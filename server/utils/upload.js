const multer = require('multer');
const path = require('path');

// Create a storage engine for user images
const userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../uploads/users/'); // Set the destination to '../uploads/users'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    },
});

// Create a storage engine for post images
const postStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../uploads/posts/'); // Set the destination to '../uploads/posts'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    },
});

// Initialize upload middleware for user images
const userUpload = multer({
    storage: userStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('File type not allowed'), false);
    },
});

// Initialize upload middleware for post images
const postUpload = multer({
    storage: postStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10 MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/; // Allowed file types
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('File type not allowed'), false);
    },
});

module.exports = {
    userUpload,
    postUpload,
};
