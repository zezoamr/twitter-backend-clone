const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
        ref: 'User'
    },
    type:{
        type:String,
        enum:["Tweet","User"],
        required:true
    },
    reportedId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
}, {
    timestamps: true
})

const Report = mongoose.model('Report', reportSchema)

module.exports = Report