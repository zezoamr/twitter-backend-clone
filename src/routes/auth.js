const express = require('express')
const auth = require("../middleware/auth");
const {
    UserSignUp,
    userLogin,
    userLogout,
    userLogoutAllDevices,
    userSendVerificationCode,
    userVerifyCode,
    userResetPassword,
    userChangePassword
} = require('../controllers/auth')

const router = express.Router()

router.route('/').post(UserSignUp)
router.route('/logout').get(auth, userLogout)
router.route('/logout/all').get(auth, userLogoutAllDevices)
router.route('/login').get(auth, userLogin)

router.route('/resetPassword').post(auth, userResetPassword)
router.route('/changePassword').post(auth, userChangePassword)
router.route('/verifyCode').get(userVerifyCode)
router.route('/sendVerificationCode').get(userSendVerificationCode)

module.exports = router
