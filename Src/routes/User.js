const express = require('express')
const auth = require("../middleware/auth");
const {uploadUserBanner, uploadUserProfileAvatar} = require("../middleware/multer")
const {
    userBan,
    userDelete,
    userFollowUnFollow,
    userGetFollowers,
    userGetFollowing,
    userSuggestedAccounts,
    userGetMe,
    userProfileAvatar,
    userBanner,
    getUserbyid,
    getUserbytag,
    userSearchByTag
} = require('../controllers/auth')

const router = express.Router()

router.route('/Ban/:id').delete(auth, userBan)
router.route('/Delete/:id').delete(auth, userDelete)
router.route('/FollowUnFollow/:id').post(auth, userFollowUnFollow)
router.route('/GetFollowers/:id').get(auth, userGetFollowers)
router.route('/GetFollowing/:id').get(auth, userGetFollowing)

router.route('/SuggestedAccounts').get(auth, userSuggestedAccounts)
router.route('/GetMe').get(auth, userGetMe)
router.route('/getbyid/:id').get(getUserbyid)
router.route('/getbytag/:tag').get(getUserbytag)
router.route('/SearchByTag').get(userSearchByTag)

router.route('/ProfileAvatar').post(auth, uploadUserBanner, userProfileAvatar)
router.route('/Banner').post(auth, uploadUserProfileAvatar, userBanner)

module.exports = router
