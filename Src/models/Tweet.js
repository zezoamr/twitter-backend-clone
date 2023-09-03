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
    isReply: {
        type: boolean,
        default: false
    },
    isRetweet: {
        type: boolean,
        default: false
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    gallery: [
        {
            photo: {
                type: Buffer
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
    ],
    textEdited: {
        type: boolean,
        default: false
    },
    pinned: {
        type: boolean,
        default: false
    }

}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    },
    toObject: {
        virtuals: true
    }
});

tweetSchema.virtual('replies', {
    ref: 'Tweet',
    localField: '_id',
    foreignField: 'replyingTo'
})

tweetSchema.virtual('popularity').get(function () {
    return this.likeCount * 0.7 + this.retweetCount + this.replyCount * 0.8;
})

tweetSchema.methods.toJSON = function () {
    const tweet = this
    const tweetobject = tweet.toObject()
    delete tweetobject.likes
    return tweetobject
}

// Export the model
module.exports = mongoose.model('Tweet', tweetSchema);
