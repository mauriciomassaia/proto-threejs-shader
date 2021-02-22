const express = require('express')
const fs = require('fs')
const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')

const PORT = 4000
const app = express()

// list all proto folders
const allProtos = fs.readdirSync('./src').filter(
  item => item.indexOf('proto-') > -1
)

console.log('allprotos', allProtos)
// enable webpack for the last prototype to speed up the building process
// as we dont need to deal with old prototypes
const latestProtos = allProtos.slice(-2)
console.log('lastestProtos', latestProtos)

// create a list with all proto-* webpack config files
const compiler = webpack(latestProtos.map(
  ID => require('./internals/webpack.base')({ ID })
))

app.use(webpackDevMiddleware(compiler, { publicPath: '/', logLevel: 'warn' }))

// add static folder if we have common assets
app.use(express.static('./docs'))

const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) =>
  res.sendFile('./docs/index.html')
)

app.listen(PORT, () => console.log(`Listening on port ${PORT}!`))
