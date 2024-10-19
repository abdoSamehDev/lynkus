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
const Follows=require("../followers/model")
const {cleanupTempImages} =require('../../utils/cleanupTempImages')


exports.UploadUserImgs=userUpload.fields([
    {
        name: 'profileImg',
        maxCount: 1
    },
    {
        name: 'headerImg',
        maxCount: 1
    }
]);

exports.resizeImg = asyncHandler(async (req, res, next) => {

    if (req.files) {

        //Create temp for save path of new Image if the update is Not successful , cleanup  it 
        req.tempImg={};


        const profileImgDir = path.join(__dirname, '../../uploads/users/profileImg');
        const headerImgDir = path.join(__dirname, '../../uploads/users/headerImg');
    
     // Remove profileImg if sent  empty field
     if (req.body.profileImg === '' && req.user.profileImg) {
        const oldImgFileName = req.user.profileImg.split('/').pop(); 
        const oldImgPath = path.join(profileImgDir, oldImgFileName);

        if (fs.existsSync(oldImgPath)) {
            fs.unlinkSync(oldImgPath);  // Remove the existing profile image
        }

        req.body.profileImg = null;  // Clear the profileImg in request
        
    }

    // Remove headerImg if sent  empty field
    if (req.body.headerImg === '' && req.user.headerImg) {
        const oldImgFileName = req.user.headerImg.split('/').pop();
        const oldImgPath = path.join(headerImgDir, oldImgFileName);

        if (fs.existsSync(oldImgPath)) {
            fs.unlinkSync(oldImgPath);  
        }

        req.body.headerImg = null;  // Clear the headerImg in request
    }
   
     // Check if profileImg directory exists, if not create it
    if (!fs.existsSync(profileImgDir)) {
        // recursive ensures parent directories are created if necessary
        fs.mkdirSync(profileImgDir, { recursive: true }); 
        
    }

    // Check if headerImg directory exists, if not create it
    if (!fs.existsSync(headerImgDir)) {
        fs.mkdirSync(headerImgDir, { recursive: true });
       
    }  
        // Handle Profile Image
        if (req.files && req.files.profileImg && req.files.profileImg.length > 0) 
            {
            // Use req.files.profileImg[0] for single file in array
            const originalPath = req.files.profileImg[0].path;  
            console.log(originalPath);

            // Remove the extension
            const fileNameWithoutExt = req.files.profileImg[0].filename
            .replace(path.extname(req.files.profileImg[0].filename), ''); 

            // Path to the original file
            const newFileName = `ProfileImg-${fileNameWithoutExt}.jpeg`;
            console.log({newFileName:newFileName}); 
            // Path for the resized file
            const outputPath = path.join(__dirname, '../../uploads/users/profileImg', newFileName); 

           


            await sharp(originalPath)
                .resize(300, 300)
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(outputPath);

            // Delete old profile image if it exists
            if (req.user && req.user.profileImg) {
                // Extract the file name from URL
                const oldImgFileName = req.user.profileImg.split('/').pop(); 
                const oldImgPath = path.join(__dirname, '../../uploads/users/profileImg', oldImgFileName);

                try {   
                    if (fs.existsSync(oldImgPath)) 
                        {
                        // Delete the old profile image if it exists
                        fs.unlinkSync(oldImgPath); 
                    }
                } catch (err) {
                    console.error(`Error deleting old profile image: ${err.message}`);
                }
            }
                 //add path of new profileImg
                req.tempImg.profileImg=outputPath;
            // Set the resized image path to the request body for saving
            req.body.profileImg = newFileName;

            fs.unlinkSync(originalPath); // Remove the original file
        }

        // Handle Header Image
        if (req.files && req.files.headerImg && req.files.headerImg.length > 0) 
            {
            // Use req.files.headerImg[0] for single file in array
            const originalPath = req.files.headerImg[0].path;  
            console.log(originalPath);

            // Remove the extension
            const fileNameWithoutExt = req.files.headerImg[0].filename
            .replace(path.extname(req.files.headerImg[0].filename), ''); 
            // Path to the original file
            const newFileName = `HeaderImg-${fileNameWithoutExt}.jpeg`; 
             // Path for the resized file
            const outputPath = path.join(__dirname, '../../uploads/users/headerImg', newFileName);


            
            await sharp(originalPath)
                .resize(1000, 500)  
                .toFormat('jpeg')
                .jpeg({ quality: 90 })
                .toFile(outputPath);

            // Delete old header image if it exists
            if (req.user &&req.user.headerImg) 
                {
                // Extract the file name from URL
                const oldImgFileName = req.user.headerImg.split('/').pop(); 
                const oldImgPath = path.join(__dirname, '../../uploads/users/headerImg', oldImgFileName);

                try {
                    if (fs.existsSync(oldImgPath)) {
                        fs.unlinkSync(oldImgPath); // Delete the old header image if it exists
                    }
                } catch (err) {
                    console.error(`Error deleting old header image: ${err.message}`);
                }
            }

            req.tempImg.headerImg=outputPath
            // Set the resized image path to the request body for saving
            req.body.headerImg = newFileName;

            fs.unlinkSync(originalPath); // Remove the original file
        }
    }
    

    next();
});












//for Admin
// exports.createUser = asyncHandler(async (req, res, next) => {


//     if (!req.user.isAdmin) {
//         return next(new ApiError("Not Authorized",401))
//     }
//     const {userName,userName,email,profileImg,password,isAdmin} =req.body

//     const user1 = await User.findOne({
//         $or: [
//             { userName: userName }, 
//             { email: email } 
//         ]
//     });
//     if (user1) {
//         return next(new ApiError('User already exists', 400));
//     }

//     const user = await User.create({ userName, userName, email,profileImg, password,isAdmin });
   

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
//         query.userName = { $regex: search, $options: 'i' }; 
//     }

//     const user = await User.find(query)
        
//         .skip(skip)
//         .limit(limit);

//     const totalCount = await User.countDocuments(query);
//     const totalPages = Math.ceil(totalCount / limit);

//     res.status(200).json({ results: user.length, page, totalPages, data: user });
// });


exports.searchUser = asyncHandler(async (req, res, next) => {
   

    const currentUserId = req.user._id; 
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;

    const { search } = req.query;
    const query = {};

    if (search) {
        query.userName = { $regex: search, $options: 'i' };
    }

    const users = await User.find(query)
        .skip(skip)
        .limit(limit);

    if (!users) {
        return next(new ApiError("User Not Found", 404));
    }

    // Get list of users Followings
    const userFollowing = await Follows.find({ user: currentUserId }).select("following");
    const followingIds = userFollowing.map(f => f.following.toString());

    console.log(followingIds)
    // Add an `isFollowing` field for each user in the result
    const usersWithFollowInfo = users.map(user => ({
        ...user._doc,
        isFollowing: followingIds.includes(user._id.toString()),
    }));

    const totalCount = await User.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({
        results: usersWithFollowInfo.length,
        page,
        totalPages,
        data: usersWithFollowInfo,
    });
});


exports.deleteUser = asyncHandler(async (req, res, next) => {
    const id = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ApiError("Invalid User ID", 404));
    }
    // Delete related posts, comments, bookmarks, and refresh tokens for the user
    await Post.deleteMany({ user: id });
    await Comment.deleteMany({ user: id });
    await BookMark.deleteMany({ user: id });
    await refreshToken.deleteMany({ user: id });

    //delete profileImg and headerImg
    if (req.user && req.user.profileImg) {
        const oldImgFileName = req.user.profileImg.split('/').pop(); // Extract the file name from URL
        const oldImgPath = path.join(__dirname, '../../uploads/users/profileImg', oldImgFileName);

        try {
            if (fs.existsSync(oldImgPath)) {
                fs.unlinkSync(oldImgPath); // Delete the old profile image if it exists
            }
        } catch (err) {
            console.error(`Error deleting old profile image: ${err.message}`);
        }
    }
    if (req.user && req.user.headerImg) {
        const oldImgFileName = req.user.headerImg.split('/').pop(); // Extract the file name from URL
        const oldImgPath = path.join(__dirname, '../../uploads/users/headerImg', oldImgFileName);

        try {
            if (fs.existsSync(oldImgPath)) {
                fs.unlinkSync(oldImgPath); // Delete the old header image if it exists
            }
        } catch (err) {
            console.error(`Error deleting old header image: ${err.message}`);
        }
    }
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
    const currentUserId = req.user._id;

    // Check if the ID is a valid MongoDB ObjectId
    let query;
    if (mongoose.Types.ObjectId.isValid(id)) {
        query = { _id: id };
    } else {
        query = { userName:id };
    }
    const user=await User.findOne(query);

    if (!user) {
        return next(new ApiError("UserProfile Not Found", 404));
    }
    // Fetch user profile, followers count, following count, and following status in parallel
    const [ followersCount, followingCount, isFollowing] = await Promise.all([
        Follows.countDocuments({ following: user._id }), // Count followers
        Follows.countDocuments({ user: user._id }), // Count following
        Follows.findOne({ user: currentUserId, following: user._id }), // Check if current user follows
    ]);
    
    
    
    // Fetch user's posts, comments, and bookmarks count in parallel
   

    // Return the profile with followers, following counts, and follow status
    res.status(200).json({
        followersCount,
        followingCount,
        isFollowing: !!isFollowing,
        data: user,
    });
});


exports.updateUser = asyncHandler(async (req, res, next) => {
    
    const updateData = {};  // Create an object to hold the fields that need to be updated

  // add fields if they provided or send
  if (req.body.userName) {
    updateData.userName = req.body.userName;
  }
  if (req.body.name) {
    updateData.name = req.body.name;
  }
  if (req.body.email) {
    updateData.email = req.body.email;
  }

    if (req.body.profileImg || req.body.profileImg===null ) {
    updateData.profileImg = req.body.profileImg;
  }

  if (req.body.headerImg || req.body.headerImg===null) {
    updateData.headerImg = req.body.headerImg;
  }
  if (req.body.bio) {
    updateData.bio = req.body.bio;
  }

  const user = await User.findOneAndUpdate(
    req.user._id,
    updateData,  
    { new: true }
  );
    if (!user) {
        cleanupTempImages(req);
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


