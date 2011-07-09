(function() {
  var Mustache, defaultContent, fs, template;
  fs = require('fs');
  Mustache = require('mustache');
  template = fs.readFileSync("" + __dirname + "/document.html.mu", 'utf8');
  defaultContent = function(name) {
    return "# " + name + " page\n\nThis wiki page is currently empty.\n\nYou can put some content in it with the editor on the right. As you do so, the document will update live on the left, and live for everyone else editing at the same time as you. Isn't that cool?\n\nThe text on the left is being rendered with markdown, so you can do all the usual markdown stuff like:\n\n- Bullet\n  - Points\n\n[links](http://google.com)\n\n[Go back to the main page](Main)";
  };
  module.exports = function(docName, model, res) {
    var name, port;
    name = docName;
    docName = "wiki:" + docName;
    port = process.env.PORT || 3000;
    return model.getSnapshot(docName, function(data) {
      var content, html;
      if (data === null || data.v === 0) {
        model.applyOp(docName, {
          op: {
            type: 'text'
          },
          v: 0
        });
        model.applyOp(docName, {
          op: [
            {
              i: defaultContent(name),
              p: 0
            }
          ],
          v: 1
        });
        content = '';
      } else {
        content = data.snapshot || '';
      }
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
    });
  };
}).call(this);
