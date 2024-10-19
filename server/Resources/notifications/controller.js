const asyncHandler=require('express-async-handler')
const mongoose = require("mongoose")
const Notifications = require("./model")
const User = require("../users/model")
const ApiError=require("../../utils/apiError")



// Get all notifications for a user

exports.getNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const notifications = await Notifications.find({to:userId }).select('-to').populate({
        path: 'from',
        select: 'userName profileImg'
    })
    .sort({ createdAt: -1 })

    await Notifications.updateMany({to:userId},{read:true})

    res.status(200).json({Notifications:notifications})
})




// Delete notification

exports.deleteNotification = asyncHandler(async (req, res,next) => {
    
    const {id}=req.params
    if  (!mongoose.Types.ObjectId.isValid(id))  {
        next(new ApiError("Invalid notification Id",400 ))
    }


    const notification = await Notifications.findByIdAndDelete({_id:id,to:req.user._id})

    if (!notification) {
        return next(new ApiError('Notification not  found'));
    }

    res.status(200).json({ message: "Notification deleted successfully" })
})



// Delete all notification
exports.deleteNotifications = asyncHandler(async (req, res,next) => {
    
    const notifications = await Notifications.deleteMany({to:req.user._id})
    
    res.status(200).json({ message: `${notifications.deletedCount} Notifications deleted successfully` })
})

