const Tweet = require("../models/Tweet");
const auth = require("../middleware/auth");
const filterText = require("../helper-functions/badwords-filter")
// auth provides req.user and req.token to the request object

// needs to add admin bypass for all functions
// refactor to extract finding tweet and checking if it exists

const maxTweetLength = 150;
const createTweet = async (req, auth, res) => {
    try {
        req.body.text = req.body.text.slice(0, maxTweetLength); //triming the text
        req.body.text = filterText(req.body.text) //filtering any bad words in it
        const tweet = new Tweet({
            ...req.body,
            owner: req.user._id
        })
        await tweet.save()

        // need to increase reply or retweet count if this tweet was a result of that
        if (tweet.replyingTo) {
            const tweetreplyingTo = await tweet.findOne({ _id: tweet.replyingTo })
            if (!tweetreplyingTo) {
                res.status(404).send()
            }
            tweetreplyingTo.replyCount += 1
            await tweetreplyingTo.save()
        }
        if (tweet.retweetedTweet) {
            const retweetedTweet = await tweet.findOne({ _id: tweet.retweetedTweet })
            if (!retweetedTweet) {
                res.status(404).send()
            }
            retweetedTweet.retweetCount += 1
            await retweetedTweet.save()
        }

        res.status(200).send(tweet)
    } catch (e) {
        res.status(400).send(e)
    }

}

const deleteTweet = async (req, auth, res) => {
    try {
        const _id = req.params.id
        const tweet = await tweet.findOneAndDelete({ owner: req.user._id, _id })
        if (!tweet) {
            res.status(404).send()
        }
        res.status(200).send(tweet)
    } catch (e) {
        res.status(400).send(e)
    }

}

// working on it
const retweetedTweetObjSelectString = "_id replyingTo owner text likeCount retweetCount gallery likes replyCount createdAt";
const replyingToTweetObjSelectString = "_id replyingTo owner text likeCount retweetCount gallery likes replyCount createdAt";
const userObjSelectString = "_id screenName tag isPrivate profileAvater.url";
const viewTweet = async (req, res) => {
    try {
        const _id = req.params.id
        const tweet = await tweet.findOne({ _id })
        if (!tweet) {
            res.status(404).send()
        }

        await tweet.populate({ path: "owner", select: userObjSelectString })
        await tweet.populate({
            path: "retweetedTweet",
            select: retweetedTweetObjSelectString,
            populate: {
                path: "authorId",
                select: userObjSelectString
            }
        })
        await tweet.populate({
            path: "replyingTo",
            select: replyingToTweetObjSelectString,
            populate: {
                path: "authorId",
                select: userObjSelectString
            }
        })


        res.status(200).send(tweet)
    } catch (e) {
        res.status(400).send(e)
    }

}

const tweetLikersObjString = "_id screenName tag isPrivate profileAvater.url";
const viewTweetLikers = async (req, res) => {
    try {
        const _id = req.params.id
        const tweet = await tweet.findOne({ _id })
        if (!tweet) {
            res.status(404).send()
        }

        // let likes = tweet.likes
        await tweet.populate({ path: "likes", select: tweetLikersObjString })
        const likes = tweet.likes
        res.status(200).send(likes)
    } catch (e) {
        res.status(400).send(e)
    }

}

const likeUnlikeTweet = async (req, auth, res) => {
    try {
        const _id = req.params.id
        const tweet = await tweet.findOne({ _id })
        if (!tweet) {
            res.status(404).send()
        }

        const likedbefore = tweet.likes.some((like) => like == req.user._id)

        if (likedbefore) {
            tweet.likes = tweet.likes.filter((like) => like != req.user._id)
            tweet.likeCount -= 1
        } else {
            tweet.likes.append(req.user._id)
            tweet.likeCount += 1
        }

        await tweet.save()

        res.status(200).send(tweet)
    } catch (e) {
        res.status(400).send(e)
    }

}


module.exports = {
    createTweet,
    deleteTweet,
    viewTweet,
    viewTweetLikers,
    likeUnlikeTweet
}
