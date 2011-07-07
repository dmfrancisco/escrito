(function() {
  var connect, options, server, sharejs, sys;
  connect = require('connect');
  sharejs = require('share').server;
  sys = require('sys');
  server = connect(connect.favicon(__dirname + '/public/favicon.ico'), connect.logger(), connect.static(__dirname + '/public'), connect.router(function(app) {
    var wiki;
    wiki = require('./editor');
    app.get('/doc/?', function(req, res, next) {
      res.writeHead(301, {
        location: '/doc/default'
      });
      return res.end();
    });
    return app.get('/doc/:docName', function(req, res, next) {
      var docName;
      docName = req.params.docName;
      return wiki(docName, server.model, res, next);
    });
  }));
  options = {
    db: {
      type: 'memory'
    }
  };
  sharejs.attach(server, options);
  server.listen(process.env.PORT || 3000);
  sys.puts("Escrito is running at " + process.env.PORT + "!");
}).call(this);
