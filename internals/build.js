/*
  Compile missing builds:
  $ node build
  Compile all builds:
  $ node build -all
  Compile selecteds protos builds:
  $ node build 34 41 14
 */

const fs = require('fs-extra')
const webpack = require('webpack')
const path = require('path')
const builds = process.argv.slice(2).filter(x => /^\d+$/.test(x))

// list all proto folders
const protos = fs.readdirSync('./src').filter(
  item => item.indexOf('proto-') > -1
)

let protosToBuild

if (process.argv.indexOf('-all') > -1) {
  protosToBuild = protos
} else if (builds.length > 0) {
  protosToBuild = builds.filter(
    num => protos.filter(id => id === `proto-${num}`)
  )
  protosToBuild = protosToBuild.map(v => `proto-${v}`)
} else {
  // remove filter protos that already have the bundles
  protosToBuild = protos.filter(id => {
    const builtFile = `../dist/bundle.${id}.js`
    const p = path.join(__dirname, builtFile)
    return !fs.existsSync(p)
  })
}

// create a list with all proto-* webpack config files
const compiler = webpack(protosToBuild.map(
  ID => require('./webpack.base')({ ID, mode: 'production' }))
)

compiler.run((err, stats) => {
  if (err || stats.hasErrors()) {
    console.log('Stats:', stats.toString({ colors: true }))
  } else {
    console.log('Webpack build completed without errors, nice one mate\n')
  }
})

console.log(`Building all prototypes, it may take several minutes...

###

  While you wait go out and get a coffee for Mauricio,
  he will give you a free hug.

###\n`)
