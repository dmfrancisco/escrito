(function() {
  var Mustache, defaultContent, fs, render, template;
  fs = require('fs');
  Mustache = require('mustache');
  template = fs.readFileSync("" + __dirname + "/document.html.mu", 'utf8');
  defaultContent = function(name) {
    return "# This wiki page is currently empty.\n\nYou can put some content in it with the editor on the right. As you do so, the document will update live on the left, and live for everyone else editing at the same time as you. Isn't that cool?\n\nThe text on the left is being rendered with markdown, so you can do all the usual markdown stuff like:\n\n- Bullet\n  - Points\n\n[links](http://google.com)\n\n[Go back to the main page](Main)";
  };
  render = function(content, name, docName, res, port) {
    var html;
    html = Mustache.to_html(template, {
      content: content,
      name: name,
      docName: docName,
      port: port
    });
    res.writeHead(200, {
      'content-type': 'text/html'
    });
    return res.end(html);
  };
  module.exports = function(docName, model, res) {
    var name, port;
    name = docName;
    docName = "doc:" + docName;
    port = process.env.PORT || 3000;
    return model.getSnapshot(docName, function(data) {
      if (data === null) {
        return model.create(docName, 'text', function() {
          var content;
          content = defaultContent(name);
          return model.applyOp(docName, {
            op: [
              {
                i: content,
                p: 0
              }
            ],
            v: 0
          }, function() {
            return render(content, name, docName, res, port);
          });
        });
      } else {
        return render(data.snapshot, name, docName, res, port);
      }
    });
  };
}).call(this);
