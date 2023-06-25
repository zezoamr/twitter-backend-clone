const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    
    notifiedUserId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    seen: {
        type: Boolean,
        default: false,
    },
    text: {
        type: String,
        required: true,
        trim: true
    },
    tweetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tweet',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tweet',
    }
}, {
    timestamps: true
})

const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification