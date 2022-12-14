"use strict"

global.__basedir = __dirname

// imports
const express = require('express')

// local imports
const util = require(__basedir + '/helpers/util')

// get config
const config = require(__basedir + '/config')
const {
  PORT: port,
} = config

// connect to the database
require(__basedir + '/helpers/mongoose')

// start express application
console.log(`starting application on port ${port}`)

// preparing express app
const app = express()

// Parse incoming json
app.use(express.json({ limit: '50mb' }))
// CORS
const cors = require('cors')
app.use(cors())


const expressHandlebars = require('express-handlebars')
var path = require('path')
app.engine('handlebars',expressHandlebars.engine({extname: '.hbs', defaultLayout: 'main', layoutsDir: __dirname + '/views'}))
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')


// Routers
const heroRouter = require(__basedir + '/routers/hero')
app.use(heroRouter)






// 404 Page
app.get('*', (req, res) => {
  res.status(404).send({
    "err": "not found!",
  })
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send({
    err: "Something broke!"
  })
})

app.listen(port, () => {
  console.log(`\nServer is up:\n\n\thttp://localhost:${port}\n\n`)
})

