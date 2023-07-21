const express = require('express')
const auth = require("../middleware/auth");
const {uploadTweetGallery} = require("../middleware/multer")
const {
    createTweet,
    deleteTweet,
    deleteAllUserTweets,
    editTweetText,
    viewTweet,
    viewTweetLikers,
    likeUnlikeTweet,
    userTweets,
    pinUnpinTweet,
    userLikedTweets,
    UserReplies,
    UserTimeline
} = require('../controllers/Tweet')

const router = express.Router()

router.route('/').post(auth, uploadTweetGallery, createTweet)
router.route('/:id').delete(auth, deleteTweet).patch(auth, editTweetText).get(viewTweet).post(auth, pinUnpinTweet)
router.route('/likes/:id').post(auth, likeUnlikeTweet).get(viewTweetLikers)

router.route('/user/:id').get(auth, userTweets).delete(auth, deleteAllUserTweets)
router.route('/user/replies/:id').get(auth, UserReplies)
router.route('/user/timeline/:id').get(auth, UserTimeline)
router.route('/user/likes/:id').get(auth, userLikedTweets)

module.exports = router
