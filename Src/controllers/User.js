const auth = require("../middleware/auth");


const userBan = async (req, auth, res) => { // doesn't delete the account just locks out everything //requires admin user
    try {
        const _id = req.params.id
        if (!req.user.adminCheck()) {
            res.status(400).send("not an admin can't process request")
        }

        const user = await User.findById(_id)

        if (! user) {
            throw new Error()
        }

        user.isBanned.status = true
        user.isBanned.banDate = Date.now()
        user.tokens = []
        await user.save()
        res.status(200).send()
    } catch (e) {
        res.status(404).send()
    }
}

const userDelete = async (req, auth, res) => { // deletes user and his tweets
    try {
        const _id = req.params.id
        if (!req.user.adminCheck() && req.user._id != _id) {
            res.status(400).send("not an admin or the user themselves can't process request")
        }

        const user = await User.findById(_id)

        if (! user) {
            throw new Error()
        }

        await tweet.deleteMany({owner: user})
        await user.delete()
        res.status(200).send()
    } catch (e) {
        res.status(404).send()
    }
}

const userFollow = async (req, auth, res) => {}

const userUnFollow = async (req, auth, res) => {}

const userGetFollowers = async (req, auth, res) => {
    try {
        const sort = [{
                createdAt: -1
            }];
        const limit = req.query.limit ? parseInt(req.query.limit) : 30;
        const skip = req.query.skip ? parseInt(req.query.skip) : 0;
        const user = await User.findOne({_id: req.params.id});
        await user.populate({
            path: "follower",
            select: "_id screenName tag followercount followingcount profileAvater.url Biography",
            options: {
                limit: parseInt(limit), // to limit number of user
                skip: parseInt(skip),
                sort
            }
        });

        return res.status(200).send(user.follower)
    } catch (e) {
        res.status(404).send()
    }
}

const userGetFollowing = async (req, auth, res) => {
    try {
        const sort = [{
                createdAt: -1
            }];
        const limit = req.query.limit ? parseInt(req.query.limit) : 30;
        const skip = req.query.skip ? parseInt(req.query.skip) : 0;
        const user = await User.findOne({_id: req.params.id});
        await user.populate({
            path: "following",
            select: "_id screenName tag followercount followingcount profileAvater.url Biography",
            options: {
                limit: parseInt(limit), // to limit number of user
                skip: parseInt(skip),
                sort
            }
        });
        return res.status(200).send(user.following)
    } catch (e) {
        res.status(404).send()
    }
}

/**const userIsFollowingOther = async (req, auth, res) => {
 // to check if you follow the user or not
        if (! user.follower.length < 1) {
            user.follower = user.follower.map((follow) => {
                const isfollowed = req.user.following.some((followed) => followed.followingId.toString() == follow._id.toString())
                delete follow._doc.following;
                if (isfollowed) {
                    userFollower = {
                        ...follow._doc,
                        isfollowing: true
                    }
                } else {
                    userFollower = {
                        ...follow._doc,
                        isfollowing: false
                    }
                }
                return userFollower
            })
        }
    }
 */

module.exports = {
    userBan,
    userDelete,
    userFollow,
    userUnFollow,
    userGetFollowers,
    userGetFollowing
}
