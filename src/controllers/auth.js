const auth = require("../middleware/auth")
const User = require("../models/User")
const VerifyCode = require("../models/VerifyCode")
const bycrypt = require("bcryptjs")


const userLogin = async (req, res) => {
    try {

        const user = await User.findOne({
            $or: [
                {
                    email: req.body.emailorUsername
                }, {
                    tag: req.body.emailorUsername
                }
            ]
        })
        if (! user) {
            throw new Error()
        }

        const token = user.generateAuthToken()
        user.tokens.push(token)

        res.status(200).send({user, token})

    } catch (e) {
        res.status(401).send({error: 'Please authenticate.'})
    }
}

const userLogout = async (req, auth, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
}

const userLogoutAllDevices = async (req, auth, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
}

const userSendVerificationCode = async (req, auth, res) => {} // check if email is used by another user first here before generating token

const userVerifyCode = async (req, auth, res) => {
    try {
        verification = VerifyCode.findOne({email: req.body.email, code: req.body.code})
        if (! verification) {
            res.status(404).send()
        }
        await verification.delete()

        res.status(200).send()

    } catch (e) {
        res.status(500).send()
    }

}

const userResetPassword = async (req, auth, res) => {}

const userChangePassword = async (req, auth, res) => {
    try {
        CorrectOldPass = bycrypt.compare(req.body.pass, req.user.password)
        if (!CorrectOldPass) {
            res.status(400).send()
        }

        user.password = req.body.newPass // pre save will auto hash changed password
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }

}

module.exports = {
    userLogin,
    userLogout,
    userLogoutAllDevices,
    userSendVerificationCode,
    userVerifyCode,
    userResetPassword,
    userChangePassword
}
