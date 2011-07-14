#!/usr/bin/env node

# Run "npm install", "cake build" and "node web.js"
connect = require('connect')
sharejs = require('share').server
sys     = require('sys')
crypto  = require('crypto')


# Processing the command line parameters
opt = require('optimist')
  .usage('Collaborative writing with Markdown & Textile.\nUsage: $0 [-p port -d database]')
  .options('p', {
      alias: 'port',
      default: process.env.PORT || process.env.npm_package_config_port || 3000,
      describe: 'Runs escrito on the specified port.'
  })
  .options('d', {
      alias: 'database',
      default: process.env.npm_package_config_database || 'memory',
      describe: "Uses the specified database type. Supported values are 'memory' and 'redis'."
  })
  .alias('h', 'help')

if opt.argv.h
  opt.showHelp()
  process.exit()


server = connect(
  connect.favicon(__dirname + '/public/favicon.ico'),
  connect.logger(),
  connect.static(__dirname + '/public'),
  connect.router (app) ->

    editor = require './editor'
    app.get '/?', (req, res, next) ->
      uid = crypto.createHash('md5').update("" + (new Date()).getTime()).digest("hex").toString().substring(0, 9)
      res.writeHead 301, {location: "/#{uid}"}
      res.end()

    app.get '/:docName', (req, res, next) ->
      docName = req.params.docName
      editor opt.argv.p, docName, server.model, res, next
)


# # If you're hosting this on Heroku and you're using RedisToGo
# if process.env.REDISTOGO_URL
#   rtg = require("url").parse(process.env.REDISTOGO_URL)
#   # ShareJS has a bug and the params are swapped
#   options = { db: { type: 'redis', hostname: rtg.port, port: rtg.hostname } }

options = { db: { type: opt.argv.d } }
sharejs.attach server, options
server.listen(opt.argv.p)

sys.puts "Escrito is running at http://localhost:#{opt.argv.p}/"
