fs = require 'fs'
Mustache = require 'mustache'

template = fs.readFileSync "#{__dirname}/document.html.mu", 'utf8'

defaultContent = (name) -> """
h1. This is a public document.

Anyone who accesses this url can see and edit what you're writing.

* Start writing by clicking the button *write* or by pressing the @Shift@ and @Tab@ keys together.
* Documents are not persistent for now. If you close your browser and no one is editing or viewing this document, it will disappear.

<div style="height:150px; border-bottom:1px dashed grey;"></div>

h3. This project wouldn't be possible without Open Source projects like:

* "NodeJS":http://nodejs.org/ - Evented I/O for V8 JavaScript
* "ShareJS":https://github.com/josephg/ShareJS/ - The collaborative editing engine by Joseph Gentle
* "Ace Editor":https://github.com/ajaxorg/ace/ - Textarea enriched by Mozilla
* "Markdown mode":https://github.com/fivesixty/notepages/ - Support added by Chris Spencer
* "Showdown":https://github.com/fivesixty/mdext/ - Markdown parser made by John Fraser
* "Textile parser":https://github.com/miebach/js-textile/ - Textile parser made by Ben Daglish
* "Google Caja":http://code.google.com/p/google-caja/ - HTML Sanitizer
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

