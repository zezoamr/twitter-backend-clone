const mongoose = require('mongoose')

const VerifyCodeSchema = new mongoose.Schema({
    
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
    code: {
        type: string,
        required: true,
    },
    
}, {
    timestamps: true
})

const VerifyCode = mongoose.model('VerifyCode', VerifyCodeSchema)

module.exports = VerifyCode