// this is the route
const express = require('express');

const router = express.Router();
const {authenticate}=require('../auth/authController')

const {getRecommendedFollowers,getUserFollowers,getUserFollowing,followUser}=require('./controller')



router.get('/followers/:id', getUserFollowers)

router.get('/following/:id', getUserFollowing)

router.post('/:id', authenticate,followUser)
router.get('/recommended',authenticate, getRecommendedFollowers)





module.exports = router;
