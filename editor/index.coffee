fs = require 'fs'
Mustache = require 'mustache'

template = fs.readFileSync "#{__dirname}/document.html.mu", 'utf8'

defaultContent = (name) -> """
# #{name} page

This wiki page is currently empty.

You can put some content in it with the editor on the right. As you do so, the document will update live on the left, and live for everyone else editing at the same time as you. Isn't that cool?

The text on the left is being rendered with markdown, so you can do all the usual markdown stuff like:

- Bullet
  - Points

[links](http://google.com)

[Go back to the main page](Main)
"""

module.exports = (docName, model, res) ->
  name = docName
  docName = "wiki:" + docName
  port = process.env.PORT || 3000

  model.getSnapshot docName, (data) ->
    if data == null || data.v == 0
      model.applyOp docName, {op:{type:'text'}, v:0}
      model.applyOp docName, {op:[{i:defaultContent(name), p:0}], v:1}
      content = ''
    else
      content = data.snapshot || ''

    html = Mustache.to_html template, {content, name, docName, port}
    res.writeHead 200, {'content-type': 'text/html'}
    res.end html
