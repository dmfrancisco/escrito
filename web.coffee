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

    editor = require './editor'
    app.get '/?', (req, res, next) ->
      uid = crypto.createHash('md5').update("" + (new Date()).getTime()).digest("hex").toString().substring(0, 9)
      res.writeHead 301, {location: "/#{uid}"}
      res.end()

    app.get '/:docName', (req, res, next) ->
      docName = req.params.docName
      editor docName, server.model, res, next

    # The 404 route
    # app.get '/*', (req, res, next) ->
    #   fs.readFile './public/404.html', encoding = 'utf8', (err, data) ->
    #     console.log(data)
    #     res.writeHead 200, {'Content-Type': 'text/html'}
    #     res.write data
    #     res.end()
)

# if process.env.REDISTOGO_URL
#   # Using RedisToGo Heroku Add-on
#   rtg = require("url").parse(process.env.REDISTOGO_URL)
#   options = { db: { type: 'redis', hostname: rtg.port, port: rtg.hostname } } # ShareJS has a bug and the params are swapped
# else
#   options = { db: { type: 'redis' } } # Local

options = { db: { type: 'memory' } }

# Attach the sharejs REST and Socket.io interfaces to the server
sharejs.attach server, options

server.listen(process.env.PORT || 3000)
sys.puts "Escrito is running at #{process.env.PORT}!"
