<!doctype html>
<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>  <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>  <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>  <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

  <title>Escrito - Collaborative writing with Markdown &amp; Textile</title>
  <meta name="description" content="Escrito - Collaborative writing with Markdown &amp; Textile">
  <meta name="author" content="David Francisco">

  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <link rel="shortcut icon" href="/favicon.ico">
  <link rel="stylesheet" href="/css/style.css?v=2">
  <link rel="stylesheet" href="/css/theme-escrito.css">

  <script src="/js/libs/modernizr-1.7.min.js"></script>
</head>
<body>
  <div id="container">
    <header>
      <div id="toolbar">
        <div class="logo"></div>
        <span class="code">Write</span>
        <div id="switch"></div>
        <span class="preview">Preview</span>

        <div id="language-menu" class="menu right">
          <div>
          <a href="#" class="opener">Language</a>
          <ul class="popup">
            <li><a class="language" id="language-plain" href="#plain">Plain text</a></li>
            <li><a class="language" id="language-textile" href="#textile">Textile</a></li>
            <li><a class="language" id="language-markdown" href="#markdown">Markdown</a></li>
            <li><span class="language" id="language-latex">Latex</span></li>
          </ul>
          <div class="clear"></div>
          </div>
        </div>

        <span class="import-button">
          <a href="#" class="return-button return-button-left" id="import-button" title="Import a text file from your system">Import</a>
        </span>

        <div id="export-menu" class="menu right">
          <div>
          <a href="#" class="opener opener-right">Export</a>
          <ul class="popup">
            <li><a class="export" id="export-text" href="#">Text file</a></li>
            <li><a class="export" id="export-html" href="#">HTML file</a></li>
            <li><span class="export" id="export-pdf">PDF file</span></li>
          </ul>
          <div class="clear"></div>
          </div>
        </div>

        <span class="print-button">
          <a href="javascript:window.print()" class="return-button" id="print-button">Print</a>
        </span>
      </div>
    </header>

    <div id="main" role="main">
      <div id="editbox">
        <div id="editor">{{{content}}}</div>
      </div>

      <div id="preview">
        <div id="desk">
          <div id="toolbar-tip"></div>
          <div id="paper"></div>
        </div>
      </div>
    </div>
  </div>

  <noscript>
    <div class="blocking-warning">You should enable javascript to access this website.</div>
  </noscript>

  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.min.js"></script>
  <script>
    !window.jQuery && document.write(unescape('%3Cscript src="/js/libs/jquery-1.4.2.min.js"%3E%3C/script%3E'));
  </script>

  <script type="text/javascript">
    var docName = '{{{docName}}}';
    var port = {{{port}}};

    if ($("html").is('.ie6, .ie7, .ie8')) {
        $("body").html("<div class='blocking-warning'>We are sorry but this application does not work in your browser" +
                       " for now. <br/>If possible, try to access this website using a different browser, such as <a" +
                       " href='http://google.com/chrome/'>Google Chrome</a>, <a " +
                       " href='http://mozilla.com/firefox/'>Mozilla Firefox 4+</a> or <a " +
                       " href='http://beautyoftheweb.com/'>Internet Explorer 9+</a>.<br/></div>");
    } else {
        document.write("<script src='/js/libs/ace/ace.js'><\/script>");
        document.write("<script src='/socket.io/socket.io.js'><\/script>");
        document.write("<script src='/share/share.js'><\/script>");
        document.write("<script src='/share/share-ace.js'><\/script>");
        document.write("<script src='/js/plugins.js'><\/script>");
        document.write("<script src='/js/script.js'><\/script>");
    }
  </script>
</body>
</html>