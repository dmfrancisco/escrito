fs = require 'fs'
Mustache = require 'mustache'

template = fs.readFileSync "#{__dirname}/document.html.mu", 'utf8'

defaultContent = (name) -> """
h1. This is a new public document.

Anyone who accesses this address will see what you're writing and can edit your document too.

* Start typing by clicking the button *write* or by pressing the @Shift@ and @Tab@ keys together.
* Documents are not persistent for now, while this is still a beta version. If you close your browser and no one is editing or viewing your document, it will disappear.
* The only browser this application works with is "Google Chrome":http://google.com/chrome/ for now.
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

