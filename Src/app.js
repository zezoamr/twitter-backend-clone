const express = require('express')
require('./db/mongoose')//? if you seed comment this line    
//require('./db/seeding')  //? if want to seed uncomment this line

const NotificationsRouter =require('./routes/Notifications')
const UserRouter =require('./routes/User')
const TweetRouter = require('./routes/Tweet')
const authRouter = require('./routes/auth')
const ReportRouter = require('./routes/Report')

const app = express()
app.use(express.json())

const cors = require("cors")
app.use(cors())

app.set('trust proxy', 1)

const session = require('cookie-session')
app.use(session({
    secret: "SESSION_SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false ,
      httpOnly: true,
      maxAge: 3000000,
    }}))

app.use('/user', UserRouter)
app.use('/tweet', TweetRouter)
app.use('/Notification', NotificationsRouter)
app.use('/auth', authRouter)
app.use('/Report', ReportRouter)


module.exports = app