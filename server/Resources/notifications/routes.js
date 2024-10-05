
const express = require('express');

const router = express.Router();

const {getNotifications,deleteNotification,deleteNotifications}=require('./controller')
const {authenticate}=require('../auth/authController')


router.use(authenticate)
router.get('/', getNotifications)

router.delete('/:id', deleteNotification)

router.delete('/', deleteNotifications)

module.exports = router;
