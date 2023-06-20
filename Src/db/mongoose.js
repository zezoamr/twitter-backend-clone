const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOCONNECT || 'mongodb://127.0.0.1:27017/twitter', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})