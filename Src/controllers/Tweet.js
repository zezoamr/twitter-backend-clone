const Tweet = require("../models/Tweet");
const auth = require("../middleware/auth");
const filterText = require("../helper-functions/badwords-filter")
// auth provides req.user and req.token to the request object

// needs to add admin bypass for all functions
// check on blocked users

// add upload img to tweet gallery
// view multiple tweets / user profile

const maxTweetLength = 150;
const createTweet = async (req, auth, res) => {
    try {
        req.body.text = req.body.text.slice(0, maxTweetLength); // triming the text
        req.body.text = filterText(req.body.text) // filtering any bad words in it
        const tweet = new Tweet({
            ...req.body,
            owner: req.user._id
        })
        await tweet.save()

        // increases reply or retweet count if this tweet was a result of that
        // prevents retweeting or replying to something a banned user did
        // checks if replying/retweeted tweet still exists

        if (tweet.isReply) {
            const tweetreplyingTo = await tweet.findOne({_id: tweet.replyingTo})
            const userreplyingTo = await User.findOne({_id: tweetreplyingTo.owner})
            if (! tweetreplyingTo || ! userreplyingTo || userreplyingTo.isBanned === true) {
                res.status(404).send()
            }
            tweetreplyingTo.replyCount += 1
            await tweetreplyingTo.save()
        }
        if (tweet.isRetweet) {
            const retweetedTweet = await tweet.findOne({_id: tweet.retweetedTweet})
            const userretweetedTweet = await User.findOne({_id: tweetreplyingTo.owner})
            if (! retweetedTweet || ! userretweetedTweet || userretweetedTweet.isBanned === true) {
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
        const owner = req.user._id
        const tweet = await tweet.findOneAndDelete({owner, _id})
        if (! tweet) {
            res.status(404).send()
        }
        res.status(200).send(tweet)
    } catch (e) {
        res.status(400).send(e)
    }

}

const deleteAllUserTweets = async (req, auth, res) => {
    try {
        const owner = req.user._id
        const tweet = await tweet.deleteMany({owner})
        if (! tweet) {
            res.status(404).send()
        }
        res.status(200).send()
    } catch (e) {
        res.status(400).send(e)
    }

}

const editTweetText = async (req, auth, res) => {
    try {
        const _id = req.params.id
        const owner = req.user._id
        const tweet = await tweet.findOne({owner, _id})
        if (! tweet) {
            res.status(404).send()
        }
        req.body.text = req.body.text.slice(0, maxTweetLength); // triming the text
        req.body.text = filterText(req.body.text) // filtering any bad words in it
        tweet.text = req.body.text
        tweet.textEdited = true
        await tweet.save()

        res.status(200).send(tweet)
    } catch (e) {
        res.status(400).send(e)
    }

}

const retweetedTweetObjSelectString = "_id replyingTo owner text likeCount retweetCount gallery likes replyCount createdAt";
const replyingToTweetObjSelectString = "_id replyingTo owner text likeCount retweetCount gallery likes replyCount createdAt";
const userObjSelectString = "_id screenName tag isPrivate profileAvater";
const viewTweet = async (req, res) => {
    try {
        if (req.user.isBanned === true) 
            return res.status(400).send("user is banned")

        

        const _id = req.params.id
        const tweet = await tweet.findOne({_id})
        if (! tweet) {
            res.status(404).send()
        }

        await tweet.populate({path: "owner", select: userObjSelectString})

        await tweet.populate({
            path: "retweetedTweet",
            select: retweetedTweetObjSelectString,
            populate: {
                path: "owner",
                select: userObjSelectString,
                match: {
                    isBanned: {
                        $ne: true
                    }
                }
            }
        })
        await tweet.populate({
            path: "replyingTo",
            select: replyingToTweetObjSelectString,
            populate: {
                path: "owner",
                select: userObjSelectString,
                match: {
                    isBanned: {
                        $ne: true
                    }
                }
            }
        })
        await tweet.populate({
            path: "replies",
            select: replyingToTweetObjSelectString,
            populate: {
                path: "owner",
                select: userObjSelectString,
                match: {
                    isBanned: {
                        $ne: true
                    }
                }
            }
        })
        // if the tweet that is retweeted or replied to doesn't exist anymore populate will return a null object and we can assume that its deleted
        let retweetedTweetIsLiked = null
        if (tweet.retweetedTweet) 
            retweetedTweetIsLiked = false
        
        if (tweet.retweetedTweet && tweet.retweetedTweet.tweetId.likes.some((like) => like.like.toString() === req.user._id.toString())) 
            retweetedTweetIsLiked = true


        


        const currentUserLikesThisTweet = tweet.likes.some((like) => like.like.toString() === req.user._id.toString());


        res.status(200).send({tweet, currentUserLikesThisTweet, retweetedTweetIsLiked})
    } catch (e) {
        res.status(400).send(e)
    }

}

const tweetLikersObjString = "_id screenName tag isPrivate profileAvater";
const viewTweetLikers = async (req, res) => {
    try {
        const _id = req.params.id
        const tweet = await tweet.findOne({_id})
        if (! tweet) {
            res.status(404).send()
        }

        // let likes = tweet.likes
        await tweet.populate({path: "likes", select: tweetLikersObjString})
        const likes = tweet.likes
        res.status(200).send(likes)
    } catch (e) {
        res.status(400).send(e)
    }

}

const likeUnlikeTweet = async (req, auth, res) => {
    try {
        const _id = req.params.id
        const tweet = await tweet.findOne({_id})
        if (! tweet) {
            res.status(404).send()
        }

        const likedbefore = tweet.likes.some((like) => like === req.user._id)

        if (likedbefore) {
            tweet.likes = tweet.likes.filter((like) => like !== req.user._id)
            tweet.likeCount -= 1
        } else {
            tweet.likes.push(req.user._id)
            tweet.likeCount += 1
        }

        await tweet.save()

        res.status(200).send(tweet)
    } catch (e) {
        res.status(400).send(e)
    }

}

const userTweets = async (req, auth, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 30;
        const skip = req.query.skip ? parseInt(req.query.skip) : 0; 
        const parsematch(str) => {
            return "false" === str
        }
        const match = {
            "isRetweet": req.query.retweets ? parsematch(req.query.retweets) : true,
            "isReply": req.query.replys ? parsematch(req.query.replys) : true,
            "pinned": req.query.pinned ? parsematch(req.query.pinned) : false,
        };
        const sortParse = (str) => {
            if (str === 'asc') return -1
            else return 1
        }
        const sort = [{
            createdAt: req.query.sort ? sortParse(req.query.sort) : -1
        }];

        const user = await User.findOne({_id: req.params.id});
        if (! user) {
            e = "user doesn't exist";
            throw e;
        }

        const tweets = await user.populate({
            path: "Tweets",
            match,
            options: {
                limit: parseInt(limit), 
                skip: parseInt(skip)
            },
            populate: [
                {
                    path: "owner",
                    strictPopulate: false,
                    select: "_id screenName tag  profileAvater"
                }, { 
                    path: "retweetedTweet.tweetId",
                    strictPopulate: false,
                    select: "_id replyingTo owner text tags likeCount retweetCount gallery likes replyCount createdAt",
                    populate: {
                        path: "owner",
                        strictPopulate: false,
                        select: "_id screenName tag profileAvater"
                    }
                }, {
                    path: "replyingTo.tweetId",
                    strictPopulate: true,
                    select: "_id replyingTo owner text tags likeCount retweetCount gallery likes replyCount createdAt",
                    populate: {
                        path: "owner",
                        strictPopulate: false,
                        select: "_id screenName tag profileAvater"
                    }
                },
            ],

            options: {
                sort
            }
        });

        //need to add user viewing tweets seeing if they liked or retweeted them or not

        res.send(tweets);
    } catch (e) { 
        res.status(400).send({error: e.toString()});
    }
}

const pinUnpinTweet = (req, auth, res) => {}

module.exports = {
    createTweet,
    deleteTweet,
    deleteAllUserTweets,
    editTweetText,
    viewTweet,
    viewTweetLikers,
    likeUnlikeTweet,
    userTweets
}
