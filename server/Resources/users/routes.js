// this is the route
const express = require('express');

const {updateUser,deleteUser,searchUser,getUserProfile,changeUserPassword,resizeImg,UploadProfileImg}=require('./userController')
const {authenticate}=require("../auth/authController")
const {updateUserValidator,changeUserPasswordValidator}=require("./Validator")

const router = express.Router();

router.route('/')
.get(searchUser)

router.put('/changePassword', authenticate,changeUserPasswordValidator,changeUserPassword);

router.route('/profile/:id').get(getUserProfile)

router.route('/')
.delete(authenticate,deleteUser)
.put(authenticate,UploadProfileImg,resizeImg,updateUserValidator,updateUser)
module.exports = router;
