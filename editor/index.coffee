fs = require 'fs'
Mustache = require 'mustache'

template = fs.readFileSync "#{__dirname}/document.html.mu", 'utf8'

defaultContent = (name) -> """
# This wiki page is currently empty.

You can put some content in it with the editor on the right. As you do so, the document will update live on the left, and live for everyone else editing at the same time as you. Isn't that cool?

The text on the left is being rendered with markdown, so you can do all the usual markdown stuff like:

- Bullet
  - Points

[links](http://google.com)

[Go back to the main page](Main)
"""


render = (content, name, docName, res, port) ->
  html = Mustache.to_html template, {content, name, docName, port}
  res.writeHead 200, {'content-type': 'text/html'}
  res.end html

module.exports = (docName, model, res) ->
  name = docName
  docName = "doc:" + docName
  port = process.env.PORT || 3000

  model.getSnapshot docName, (data) ->
    if data == null
      model.create docName, 'text', ->
        content = defaultContent(name)
        model.applyOp docName, {op:[{i:content, p:0}], v:0}, ->
          render content, name, docName, res, port
    else
      render data.snapshot, name, docName, res, port

