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
        
        await tweet.deleteMany({ owner: user })
        await user.delete()
        res.status(200).send()
    } catch (e) {
        res.status(404).send()
    }
}

const userFollow = async (req, auth, res) => {}

const userUnFollow = async (req, auth, res) => {}

const userGetFollowers = async (req, auth, res) => {}

const userGetFollowing = async (req, auth, res) => {}

module.exports = {
    userBan,
    userDelete,
    userFollow,
    userUnFollow,
    userGetFollowers,
    userGetFollowing
}
