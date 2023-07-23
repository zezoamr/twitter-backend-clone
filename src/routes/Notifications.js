const express = require('express')
const auth = require("../middleware/auth");
const {getNotifications, markAsSeen} = require('../controllers/Notifications')

const router = express.Router()

router.route('/Notifications').get(auth, getNotifications)
router.route('/Notifications/markAsSeen').post(auth, markAsSeen)


module.exports = router
