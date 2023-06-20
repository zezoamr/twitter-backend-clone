const express = require('express')
require('./db/mongoose')//? if you seed comment this line    
//require('./db/seeding')  //? if want to seed uncomment this line

const app = express()

app.use(express.json())


module.exports = app