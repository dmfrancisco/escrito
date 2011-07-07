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

    wiki = require './wiki'
    app.get '/wiki/?', (req, res, next) ->
      res.writeHead 301, {location: '/wiki/Main'}
      res.end()

    app.get '/wiki/:docName', (req, res, next) ->
      docName = req.params.docName
      wiki docName, server.model, res, next

)

options = { db: { type: 'redis' } }

# Attach the sharejs REST and Socket.io interfaces to the server
sharejs.attach server, options

server.listen 8000
sys.puts 'Demos running at http://localhost:8000/'
