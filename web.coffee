# Run "npm install", "cake build" and "foreman start" or "node web.js"

# require.paths.push '/usr/local/node/lib/node_modules'
#!/usr/bin/env coffee

connect = require 'connect'
sharejs = require('share').server
sys = require 'sys'

server = connect(
  connect.favicon(__dirname + '/public/favicon.ico'),
  connect.logger(),
  connect.static(__dirname + '/public'),
  connect.router (app) ->

    wiki = require './editor'
    app.get '/doc/?', (req, res, next) ->
      res.writeHead 301, {location: '/doc/default'}
      res.end()

    app.get '/doc/:docName', (req, res, next) ->
      docName = req.params.docName
      wiki docName, server.model, res, next

)

options = { db: { type: 'mem' } }

# Attach the sharejs REST and Socket.io interfaces to the server
sharejs.attach server, options

server.listen(process.env.PORT || 3000)
sys.puts "Escrito is running at #{process.env.PORT}!"
