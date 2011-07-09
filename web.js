(function() {
  var connect, crypto, options, rtg, server, sharejs, sys;
  connect = require('connect');
  sharejs = require('share').server;
  sys = require('sys');
  crypto = require('crypto');
  server = connect(connect.favicon(__dirname + '/public/favicon.ico'), connect.logger(), connect.static(__dirname + '/public'), connect.router(function(app) {
    var wiki;
    wiki = require('./editor');
    app.get('/doc/?', function(req, res, next) {
      var uid;
      uid = crypto.createHash('md5').update("" + (new Date()).getTime()).digest("hex").toString().substring(0, 9);
      res.writeHead(301, {
        location: "/doc/" + uid
      });
      return res.end();
    });
    return app.get('/doc/:docName', function(req, res, next) {
      var docName;
      docName = req.params.docName;
      return wiki(docName, server.model, res, next);
    });
  }));
  if (process.env.REDISTOGO_URL) {
    rtg = require("url").parse(process.env.REDISTOGO_URL);
    options = {
      db: {
        type: 'redis',
        hostname: rtg.port,
        port: rtg.hostname
      }
    };
  } else {
    options = {
      db: {
        type: 'redis'
      }
    };
  }
  sharejs.attach(server, options);
  server.listen(process.env.PORT || 3000);
  sys.puts("Escrito is running at " + process.env.PORT + "!");
}).call(this);
