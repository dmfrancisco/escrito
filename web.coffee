# Run "npm install", "cake build" and "foreman start" or "node web.js"

# require.paths.push '/usr/local/node/lib/node_modules'
#!/usr/bin/env coffee

connect = require 'connect'
sharejs = require('share').server
sys = require 'sys'
crypto = require('crypto')

server = connect(
  connect.favicon(__dirname + '/public/favicon.ico'),
  connect.logger(),
  connect.static(__dirname + '/public'),
  connect.router (app) ->

    wiki = require './editor'
    app.get '/doc/?', (req, res, next) ->
      uid = crypto.createHash('md5').update("" + (new Date()).getTime()).digest("hex").toString().substring(0, 9)
      res.writeHead 301, {location: "/doc/#{uid}"}
      res.end()

    app.get '/doc/:docName', (req, res, next) ->
      docName = req.params.docName
      wiki docName, server.model, res, next

)

if process.env.REDISTOGO_URL
  # Using RedisToGo Heroku Add-on
  rtg = require("url").parse(process.env.REDISTOGO_URL)
  options = { db: { type: 'redis', hostname: rtg.port, port: rtg.hostname } } # ShareJS has a bug and the params are swapped
else
  options = { db: { type: 'redis' } } # Local

# Attach the sharejs REST and Socket.io interfaces to the server
sharejs.attach server, options

server.listen(process.env.PORT || 3000)
sys.puts "Escrito is running at #{process.env.PORT}!"
