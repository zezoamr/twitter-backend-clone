const User = require("../models/User")
const {sendEmail} = require('../helper-functions/nodemailer')
const VerifyCode = require("../models/VerifyCode")
const bycrypt = require("bcryptjs")
const {generatePassword} = require('../helper-functions/passgenerator')
const {generateVerificationCode} = require('../helper-functions/verifycodegen')

const UserSignUp = async (req, res) => {
    try {
        const user = new User(req.body)
        await user.save()
        const token = await user.generateAuthToken() // generates and pushes token to store it
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
}


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
        if(user && user.banCheck()) res.status(400).send("user is banned")

        const token = user.generateAuthToken() // generates and pushes token to store it

        res.status(200).send({user, token})

    } catch (e) {
        res.status(401).send({error: 'Please authenticate.'})
    }
}

const userLogout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(400).send()
    }
}

const userLogoutAllDevices = async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(400).send()
    }
}

const userSendVerificationCode = async (req, res) => {
    try {
        // check if email is used by another user first here before generating token
        const aUserAlreadyHasThisEmail = User.findone({emai: req.body.email})
        if(aUserAlreadyHasThisEmail){
            res.status(400).send('a user already has this email')
        }

        //generate the code
        const newcode = generateVerificationCode(8)
        //make new verifycode object or modify exisitng object in case of resending
        let verification = VerifyCode.findOne({emai: req.body.email})
        if(verification){
            verification.code = newcode
            await verification.save()
        }
        else{
            verification = new VerifyCode(req.body)
            await verification.save()
        }

        //send email
        const subject = 'your verification code for twitter-clone'
        const to = req.body.email
        const text = 'your verification code is ' + newcode 

        sendEmail(subject, text, to)

        res.status(200).send()

    } catch (e) {
        res.status(400).send()
    }
} 

const userVerifyCode = async (req, res) => {
    try {
        verification = VerifyCode.findOne({email: req.body.email, code: req.body.code})
        if (!verification) {
            res.status(404).send()
        }
        await verification.delete()

        res.status(200).send()

    } catch (e) {
        res.status(400).send()
    }

}

const userResetPassword = async (req, res) => {
    try {
        const changedPass = generatePassword(12)
        const subject = 'your password have been reset for twitter-clone'
        const to = req.user.email
        const text = 'your new pass is ' + changedPass + ' please change it as soon as possible'

        req.user.password = changedPass
        await req.user.save()

        sendEmail(subject, text, to)

        res.status(200).send()

    } catch (e) {
        res.status(400).send()
    }

}

const userChangePassword = async (req, res) => {
    try {
        CorrectOldPass = bycrypt.compare(req.body.pass, req.user.password)
        if (!CorrectOldPass) {
            res.status(400).send()
        }

        user.password = req.body.newPass // pre save will auto hash changed password
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(400).send()
    }

}

module.exports = {
    UserSignUp,
    userLogin,
    userLogout,
    userLogoutAllDevices,
    userSendVerificationCode,
    userVerifyCode,
    userResetPassword,
    userChangePassword
}
