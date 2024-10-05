const asyncHandler=require('express-async-handler')
const mongoose = require("mongoose")
const Notifications = require("../notifications/model")
const User = require("../users/model")
const Follows= require("./model")
const ApiError=require("../../utils/apiError")
//follow a user

exports.followUser=asyncHandler(async(req,res,next)=>{
    const {id}=req.params

    //check if user id is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new ApiError("Invalid user id",400))
    }

    //check if user is trying to follow a non-existing user
    const userExists=await User.findById(id)
    if(!userExists) return next(new ApiError("User not found",404))


    //check if user is trying to follow himSelf
    if(req.user._id.toString()===id) return next(new ApiError("You can't follow yourself",400))

        const user = await User.findById(id)
        if(!user) return next(new ApiError("User not found",404))

    //check if user is already following this user
    const followsExists=await Follows.findOne({user:req.user._id,following:id})
    if(followsExists) 
        {
            if (process.env.NODE_ENV !== 'production') {
                const deletedFollows= await Follows.findByIdAndDelete(followsExists._id)
                return res.status(200).json({message:"User unFollowed successfully",deletedFollows})
            }
            
            return res.status(200).json({message:"User unFollowed successfully"})
    }

    //create a new follow
    const newFollow=new Follows({user:req.user._id,following:id})
    await newFollow.save()

    //send notification to the followed user
    const notification=new Notifications({
        to:id,
        from:req.user._id,
        type:"FOLLOW",
        content:`${req.user.name} started following you`,
        
    })
    await notification.save()
    if (process.env.NODE_ENV !== 'production') 
    {res.status(200).json({message:"User followed successfully",newFollow,notification})}
    
    
    res.status(200).json({message:"User followed successfully"})

})



//get user's followers

exports.getUserFollowers=asyncHandler(async(req,res,next)=>{
     const { id } = req.params;
  
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
  
    const { search } = req.query;
    const query = {};
  
   
  
    // Determine if the id is MongoId or  name
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const user = await User.findOne({ name: id }).select('_id');
     
      if (!user) {
        return next(new ApiError("User Not Found",404))
      }
      query.following = user._id;  
    } else {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ApiError("Invalid user id",400))
        }
        query.following = id;  
    }
  
    
    let followers=await Follows.find(query)
    .select('user -_id')
    .populate('user','name profileImg')
    .skip(skip)
    .limit(limit)



    //search 
    if (search) {
       
       followers = followers.filter(user => 
        user.user.name.toLowerCase().includes(search.toLowerCase())
      ); 
      
    }
    
    



    const totalDocs = await Follows.countDocuments({query});
    const totalPages = Math.ceil(totalDocs / limit);
    


    res.status(200).json({results:followers.length,totalPages,page,data:followers})

})



//get user's following

exports.getUserFollowing = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
  
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 10;
    const skip = (page - 1) * limit;
  
    const { search } = req.query;
    const query = {};
  
   
  
    // Determine if the id is MongoId or  name
    if (!mongoose.Types.ObjectId.isValid(id)) {
      const user = await User.findOne({ name: id }).select('_id');
      if (!user) {
        return next(new ApiError("User Not Found",404))
      }
      query.user = user._id;  
    } else {

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return next(new ApiError("Invalid user id",400))
        }
        query.user = id;  
    }

    
    
    
    // get the following users and populate name profileImg
    let following = await Follows.find(query)
        .select('following -_id')
        .populate('following', 'name profileImg')
        .skip(skip)
        .limit(limit);
        
        console.log(following)
    // get the following users and populate name profile
   
   
    // search the following users by name
    console.log(following)
    if (search) {
        // filter the following users by name
        following = following.filter(user =>
            user.following.name.toLowerCase().includes(search.toLowerCase())
        );
        console.log(following)
        }
    
    
  
    const totalDocs = await Follows.countDocuments(query);
    const totalPages = Math.ceil(totalDocs / limit);
  
    res.status(200).json({
      results: following.length,
      totalPages,
      page,
      data: following
    });
  });




exports.getRecommendedFollowers = asyncHandler(async (req, res, next) => {
    const userId = req.user._id;
  
    //  get the users that the current user follows
    const userFollowing = await Follows.find({ user: userId }).select("following -_id");
  
    // if the user is not following anyone then recommend random users
    if (userFollowing.length === 0) {
      const randomUsers = await User.find({ _id: { $ne: userId } }).limit(req.query.limit*1||10); // random users, excluding the current user
      return res.status(200).json({ recommendedUsers: randomUsers });
    }

    const followingId = userFollowing.map(f => f.following);
    //  get the users that the people you follow are also follow
    const secondFollowing = await Follows.find({
      user: { $in: followingId }
    }).select("following -_id");


  const secondFollowingId = secondFollowing.map(e => e.following.toString())
    //  remove users that followed by the current user and the current user 
    const recommendedUserId = 
    secondFollowingId
    .filter(FollowingId => !followingId.includes(FollowingId) && FollowingId !== userId.toString());
  
    // get the recommended users
    let recommendedUsers;
    if (recommendedUserId.length > 0) {
      recommendedUsers = await User.find({ _id: { $in: recommendedUserId } })
      .select("name profileImg")
      .limit(req.query.limit*1||10);;
    } else {
      // if no recommend make random users
      recommendedUsers = await User.find({ _id: { $ne: userId } })
      .select("name profileImg")
      .limit(req.query.limit*1||10);
    }
  
    res.status(200).json({ recommendedUsers });
  });
  