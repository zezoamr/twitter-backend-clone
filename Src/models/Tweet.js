const mongoose = require('mongoose');

// Declare the Schema of the Mongo model
var tweetSchema = new mongoose.Schema({

    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    retweetedTweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
        default: null
    },
    replyingTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tweet",
        default: null
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    gallery: [
        {
            photo: {
                type: String
            }
        },
    ],
    likeCount: {
        type: Number,
        default: 0
    },
    retweetCount: {
        type: Number,
        default: 0
    },
    replyCount: {
        type: Number,
        default: 0
    },
    likes: [
        {
            like: {
                type: mongoose.SchemaTypes.ObjectId,
                required: true,
                ref: 'User'
            }
        }, {
            timestamps: true,
            toJSON: {
                virtuals: true
            }
        },
    ]

}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

tweetSchema.virtual('reply', {
    ref: 'Tweet',
    localField: '_id',
    foreignField: 'replyingTo'
})


tweetSchema.methods.toJSON = function () {
    const tweet = this
    const tweetobject = tweet.toObject()
    delete tweetobject.likes
    return tweetobject
}

// Export the model
module.exports = mongoose.model('Tweet', tweetSchema);
