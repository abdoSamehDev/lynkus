const asyncHandler = require("express-async-handler")
const mongoose = require("mongoose")
const bcrypt=require("bcrypt")
const sharp = require("sharp")
const path = require("path")
const fs = require("fs")
const ApiError=require("../../utils/apiError")
const User = require("./model");
const Post = require("../posts/model")
const Comment = require("../comments/model")
const BookMark = require("../bookmarks/model")
const {userUpload} = require("../../utils/upload")
const refreshToken=require("../auth/RefreshTokenModel")

exports.UploadProfileImg=userUpload.single("profileImg");

exports.resizeImg = asyncHandler(async (req, res, next) => {

    if (req.file) {
        const originalPath = req.file.path;
        // Path to the original file
        const newFileName = `IMG-${req.file.filename}.jpeg`; 
        const outputPath = path.join(__dirname, '../../uploads/users', newFileName); // Path for the resized file

        
       
        await sharp(originalPath)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 90 })
            .toFile(outputPath);


        if (req.user.profileImg) {
            
            //Split the URL to return Array then Pop last element to get IMG Path
            const oldImgFileName = req.user.profileImg.split('/').pop(); // Extract the file name from URL
            console.log(oldImgFileName)
            const oldImgPath = path.join(__dirname, '../../uploads/users', oldImgFileName);
            
            try {
                //ensure the old IMG exist 
                if (fs.existsSync(oldImgPath)) {
                    fs.unlinkSync(oldImgPath); // Delete the old profile image if it exists
                }
            } catch (err) {
                console.error(`Error deleting old profile image: ${err.message}`);
            }
        }

        // Set the resized image path to the request body for Save 
        req.body.profileImg = newFileName; 
       
        fs.unlinkSync(originalPath);
    }
   
    next();
});











//for Admin
// exports.createUser = asyncHandler(async (req, res, next) => {


//     if (!req.user.isAdmin) {
//         return next(new ApiError("Not Authorized",401))
//     }
//     const {userName,name,email,profileImg,password,isAdmin} =req.body

//     const user1 = await User.findOne({
//         $or: [
//             { name: name }, 
//             { email: email } 
//         ]
//     });
//     if (user1) {
//         return next(new ApiError('User already exists', 400));
//     }

//     const user = await User.create({ userName, name, email,profileImg, password,isAdmin });
   

//     res.status(201).json({ message: 'User created successfully' ,data: user });
// });
//for admin
// exports.getUsers = asyncHandler(async (req, res, next) => {
    
//     if (!req.user.isAdmin) {
//     return next(new ApiError("Not Authorized",404));
//     }
//     const userId = req.user._id;

//     const page = req.query.page * 1 || 1;
//     const limit = req.query.limit * 1 || 10;
//     const skip = (page - 1) * limit;

//     const { search } = req.query;
//     const query = { user: userId }; 

//     if (search) {
//         query.name = { $regex: search, $options: 'i' }; 
//     }

//     const user = await User.find(query)
        
//         .skip(skip)
//         .limit(limit);

//     const totalCount = await User.countDocuments(query);
//     const totalPages = Math.ceil(totalCount / limit);

//     res.status(200).json({ results: user.length, page, totalPages, data: user });
// });


exports.searchUser = asyncHandler(async (req, res, next) => {
    
   
    

    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const { search } = req.query;
    const query = { }; 

    if (search) {
        query.name = { $regex: search, $options: 'i' }; 
    }

    const user = await User.find(query)
        .skip(skip)
        .limit(limit);

        if (!user) {
            
            return next(new ApiError("User Not Found", 404));
            
        }

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({ results: user.length, page, totalPages, data: user });
});


exports.deleteUser = asyncHandler(async (req, res, next) => {
    const id = req.user._id;

    // Delete related posts, comments, bookmarks, and refresh tokens for the user
    // await Post.deleteMany({ user: id });
    // await Comment.deleteMany({ user: id });
    // await BookMark.deleteMany({ user: id });
    // await refreshToken.deleteMany({ user: id });

   
    const user = await User.findByIdAndDelete(id);

    if (!user) {
        return next(new ApiError("User Not Found", 404));
    }

    // Clear the refreshToken cookie and send success response
    res.status(200)
        .clearCookie('refreshToken')
        .json({ message: 'User deleted successfully' });
});





exports.getUserProfile = asyncHandler(async (req, res, next) => {


    const { id } = req.params;

if (!mongoose.Types.ObjectId.isValid(id)) {
    
    const user = await User.findOne({ name: id })
    //dont forget to add it .populate("posts");
    if (!user) {
        return next(new ApiError("UserProfile Not Found", 404));
    }
    return res.status(200).json({ data: user });
}

const user = await User.findById(id);
  //dont forget to add it .populate("posts");

if (!user) {
    return next(new ApiError("UserProfile Not Found", 404));
}
res.status(200).json({ data: user });

});

exports.updateUser = asyncHandler(async (req, res, next) => {
    
    
    
   

    
  const user = await User.findOneAndUpdate( 
        req.user._id,
        {
          username: req.body.userName,
          email: req.body.email,
            profileImg: req.body.profileImg,
  
           
        },
        {new:true}

    );
    if (!user) {
        return next(new ApiError("User Not Found", 404));
    }
    

   

    res.status(200).json({ message: 'User Updated successfully',data:user });
});

exports.changeUserPassword = asyncHandler(async (req, res, next) => {



const hashedPassword = await bcrypt.hash(req.body.password, 12);


   const updatedUser = await User.findByIdAndUpdate(
    req.user._id, 
        {
            password: hashedPassword,
            passwordChangedAt: Date.now(),
        },
        {new: true, }
    );
    
    if (!updatedUser) {
        return next(new ApiError(`No document for this id ${req.user._id}`, 404));
    }
    
    await refreshToken.deleteMany({user:req.user._id});
    
   
    res.status(200)
    .clearCookie('refreshToken')
    .json({message:"Password Has been Changed Please Login Again" ,data: updatedUser });
    });


