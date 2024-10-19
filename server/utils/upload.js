const multer = require('multer');
const path = require('path');
const {v4: uuid4}=require("uuid")
const fs = require('fs');
// Create a storage engine for user images

const userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../uploads/users'); 
        if (!fs.existsSync(uploadPath)) {
            
            fs.mkdirSync(uploadPath, { recursive: true }); 
            
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, `user-${uuid4()}-${Date.now()}-${file.originalname}`);
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

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads/posts'); // Adjust path as needed

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true }); // Create directory if it doesn't exist
}

// Create a storage engine for post images
const postStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Set the destination to the uploads/posts directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Unique filename
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

        console.log("MIME", mimetype);
        console.log("EXT", extname);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('File type not allowed'), false);
    },
}).single('image');

module.exports = {
    userUpload,
    postUpload,
};
