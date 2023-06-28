const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const validator = require("validator")

userSchema = mongoose.Schema({
    screenName: {
        type: String,
        required: true,
        trim: true
    },
    tag: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    Biography: {
        type: String,
        maxlength: 280,
        default: "",
        trim: true
    },
    website: {
        type: String,
        default: "",
        trim: true
    },
    phoneNumber: {
        type: String,
        default: 0
    },
    darkMode: {
        type: Boolean,
        default: false
    },
    location: {
        place: {
            type: String,
            default: null
        },
        visability: {
            type: Boolean,
            default: true
        }
    },
    birth: {
        date: {
            type: Date,
            default: "2001-04-24T13:35:32.392Z"
        },
        visability: {
            type: Boolean,
            default: true
        }
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        trim: true,
        required: true,
        minlength: 6
    },
    blueCheckMark:{
        type: Boolean,
        default: false
    },
    email: {
        type: String,
        trim: true,
        unique: true,
        required: true,
        lowercase: true,
        validate(value) {
            if (! validator.isEmail(value)) {
                throw new Error("not valid email");
            }
        }
    },
    profileAvater: {
        type: Buffer,
        default: null
    },
    banner: {
        type: Buffer,
        default: null
    },
    following: [
        { // //who i follow //???
            followingId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }, {
            timestamps: true,
            toJSON: {
                virtuals: true
            },
            toObject: {
                virtuals: true
            }
        }
    ],
    followercount: { // ///who follow me
        type: Number,
        default: 0

    },
    followingcount: { // //who i follow
        type: Number,
        default: 0
    },
    Notificationssetting: {
        newfollow: {
            type: Boolean,
            default: true
        },
        newtweet: {
            type: Boolean,
            default: true
        },
        liketweet: {
            type: Boolean,
            default: true
        }
    },
    isBanned: {
        status: {
            type: Boolean,
            default: false
        },
        banDate: {
            type: Date,
            default: Date.now()
        }
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    /*verified: {
        type: Boolean,
        default: false
    },*/ //verified field isn't needed since we send verification code, check that the email exists and doesn't belong to any other users all before user is created 
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    strictPopulate: false

});

userSchema.methods.toJSON = function () {
    const userObject = this.toObject()
    delete userObject.tokens
    delete userobject.password
    delete userobject.following
    // ...
    return userObject
}

userSchema.methods.banCheck = async function () { // check to make code cleaner and avoid having to deal with nested objects when checking
    return this.isBanned.status

}

userSchema.methods.adminCheck = async function () { // to make checks simillar and code base systematic //check to make code cleaner and avoid having to deal with nested objects when checking
    return this.isAdmin

}

userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({
        _id: user._id.toString(),
        timestamp: Date.now()
    }, process.env.secretkey || 'Secretunnel..SECRETTUNNEL!!!')
    user.tokens.push({token})
    await user.save()
    next()

}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = bcrypt.hash(user.password, 8)
    }
    next()

})

userSchema.statics.findByCredentials = async (emailorUsername, password) => {

    let user = await User.findOne({
        $or: [
            {
                email: emailorUsername
            }, {
                tag: emailorUsername
            }
        ]
    })
    if (! user) { 
        throw new Error('unable to login as user is not found')
    }
    if (! user.verified) {
        throw new Error('unable to login as user is not verified')
    }
    const ismatch = await bcrypt.compare(password, user.password)
    if (! ismatch) {
        throw new Error("unable to login")
    }
    
    return user
}

const User = mongoose.model('User', userSchema)

module.exports = User
