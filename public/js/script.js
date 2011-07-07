
/* Menus by Raj Ramamurthy (mynameisraj.com) */

$(document).ready(function() {
    $(this).children('ul').hide();

    $('.window-button').click(function(e) {
        e.preventDefault();
        makeWindow('#window');
    });

    $('.opener').click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        if ($(this).hasClass('open')) {
            hideWindow($(this));
        }
        else {
            showWindow($(this));
            var startLink = $(this);
            // $('.canvas').click(function() {
            //     hideWindow(startLink);
            // });
        }
    });
    $('.opener').bind('mouseenter',
    function(e) {
        var allMenus = $('.open');
        // Check if there is a menu open, or if there was and now the user
        // is reading the tipsy tooltip (menu-link class)
        if (allMenus.length != 0 || $('.menu-link').length != 0) {
            // Hide all the opened menus
            allMenus.each(function() {
                hideWindow($(this));
            });
            // Remove the helper class
            $('.menu-link').each(function() {
                $(this).removeClass('menu-link');
            });
            // Show this one
            showWindow($(this));
            var startLink = $(this);
            // $('.canvas').click(function() {
            //     hideWindow(startLink);
            // });
        }
    });

    $('.submenu').hover(function() {
        $(this).children('ul').show();
        $(this).children('ul').addClass('visible');
    },

    function() {
        $(this).children('ul').removeClass('visible');
        $(this).children('ul').hide();
    });
});

function hideWindow(startLink) {
    var popup = startLink.next('.popup');
    var openButton = startLink;
    openButton.removeClass('open');
    popup.removeClass('open');
    popup.hide();
    // $('.canvas').remove();
}

function showWindow(startLink) {
    var popup = startLink.next('.popup');
    popup.show();
    startLink.addClass('open');
    popup.addClass('open');
    // $('<div class="canvas"></div>').appendTo('body');
}

function makeOverlay() {

    $('body').css('overflow', 'hidden');
    var overlay = document.createElement('div');
    overlay.id = 'overlay';
    $('body').append(overlay);
    $('#overlay').addClass('visible');
};

function close(windowName) {
    $('body').css('overflow', 'auto');
    $(windowName).removeClass('visible');
    $('#overlay').removeClass('visible');
    $('#overlay').remove();
    $(windowName).hide();
}

function makeWindow(windowName) {
    makeOverlay();
    $(windowName).hide();
    $(windowName).show();
    $(windowName).addClass('visible');
    $('.close-button').click(function() {
        close(windowName);
    });
}



/* Escrito */

var strings = {
    // Titles
    "import-button-title-plain": "Import a text file from your system",
    "import-button-title-textile": "Import a Textile file from your system",
    "import-button-title-markdown": "Import a Markdown file from your system",
    // Menus
    "export-text-plain": "Text file",
    "export-text-textile": "Textile file",
    "export-text-markdown": "Markdown file"
}

var renderMode; // Current parser being used
var scrollPos = 0; // Persist scroll position of the preview mode
var editor;
var markdownConverter;

var TextMode = require("ace/mode/text").Mode;
var textMode = new TextMode();
var TextileMode = require("ace/mode/textile").Mode;
var textileMode = new TextileMode();
var MarkdownMode = require("ace/mode/markdown").Mode;
var markdownMode = new MarkdownMode();

////////////////////////////////////////////////////////////////////////////////////////////////////

/* Parse written content and update the preview panel */
function render(val) {
    if (!val) val = editor.getSession().getValue();

    switch (renderMode)
    {
    case "plain":
        editor.getSession().setMode(textMode);
        val = val.replace(/\r\n|\r|\n/g, "<br />"); // Newlines
        val = val.replace(/  /g, "&nbsp;&nbsp;"); // Whitespaces
        $('#paper').html("<p></p>" + val);
        $('#import-button').attr("title", strings['import-button-title-plain']);
        $('#export-text').text(strings['export-text-plain']);
        break;

    case "textile":
        editor.getSession().setMode(textileMode);
        $('#paper').html(textile(val));
        $('#import-button').attr("title", strings['import-button-title-textile']);
        $('#export-text').text(strings['export-text-textile']);
        break;

    case "markdown":
        editor.getSession().setMode(markdownMode);
        $('#paper').html(markdownConverter.makeHtml(val));
        $('#import-button').attr("title", strings['import-button-title-markdown']);
        $('#export-text').text(strings['export-text-markdown']);
        break;

    case "latex":
        break;
    }
}

function previewOn() {
    $('#editbox').hide();
    $('#editor').hide();
    $('#preview').show();
    render(editor.getSession().getValue());
    $('#preview').css('top', '0px');
    $('#preview').focus();

    // Return to saved scroll position of the preview mode
    $('#preview').attr({ scrollTop: scrollPos });
}

function writeOn() {
    // Save scroll position of the preview mode
    scrollPos = $('#preview').attr('scrollTop');

    $('#preview').hide();
    $('#editor').show();
    $('#editbox').show();
    $('textarea').focus();
}

/* Text file drag-and-drop */
function dropFile() {
    // Check for the various File API support.
    if (!window.File || !window.FileReader) {
      alert('The File APIs are not fully supported in this browser.');
    }

    $("#preview").bind('dragover', function() {
        $("#paper").addClass('hover');
        return false;
    }).bind("dragend", function() {
        $("#paper").removeClass('hover');
        return false;
    }).bind("drop", function (e) {
        $("#paper").removeClass('hover');
        e.stopPropagation();
        e.preventDefault();

        var file = e.originalEvent.dataTransfer.files[0], reader = new FileReader();
        reader.onload = function (event) {
            var lang = languageByFilename(file.name);
            if (lang === 'unknown')
                return false;
            else changeSelectedLanguage(lang);

            editor.getSession().setValue(event.target.result);
            render(event.target.result);
        };
        reader.readAsText(file);
        return false;
    });
}

/* Save written content */
function saveText() {
    var uriContent = "data:application/octet-stream," + encodeURIComponent(editor.getSession().getValue());
    document.location.href = uriContent;
}

function saveHtml() {
    var attrs = [
        "  <style type=\"text/css\">",
        "    body { margin: 50px; font: 16px 'Palatino Linotype', 'Book Antiqua', Palatino, FreeSerif, serif; }",
        "    p { text-align: justify; }",
        "    a { color: #261a3b; }",
        "    a:visited { color: #261a3b; }",
        "    pre, tt, code { font: 12px Menlo, Monaco, Consolas, 'Lucida Console', monospace; }",
        "  </style>"
    ];
    var uriContent = "data:application/octet-stream," +
        encodeURIComponent("<html>\n<head>\n"+ attrs.join("\n") +"\n<head>\n<body>\n"+ $('#paper').html() +"\n</body>\n</html>\n");
    document.location.href = uriContent;
}

////////////////////////////////////////////////////////////////////////////////////////////////////

/* Tooltips (http://onehackoranother.com/projects/jquery/tipsy) */
function initTipsy() {
    $('#import-button').tipsy({
        opacity: 1,
        trigger: 'manual'
    });
    $('#import-button').bind('mouseenter',
    function(e) {
        var allMenus = $('.opener'); // Check if there is a menu opened
        if (allMenus.filter('.open').length != 0) {
            // Hide all opened menus but add a class to enable linked menus
            allMenus.each(function() {
                hideWindow($(this));
                $(this).addClass('menu-link');
            });
        }
        $(this).tipsy("show");
    });
    $('#import-button').bind('mouseleave',
    function(e) {
        $(this).tipsy("hide");
    });
}

function changeSelectedLanguage(lang) {
    $('.language').each(function() {
        $(this).text($(this).text().replace(' ✓', ''));
    })

    renderMode = lang;
    switch (lang)
    {
    case "plain":
        renderMode = "plain";
        break;
    case "markdown":
        renderMode = "markdown";
        break;
    case "textile":
    default:
        renderMode = "textile";
    }
    $("#language-"+ renderMode).append(" ✓");
    window.location.hash = renderMode;
}

function languageByFilename(filename) {
    switch (filename.split('.').pop())
    {
    case "txt":
        return "plain";
    case "textile":
        return "textile";
    case "markdown":
    case "md":
        return "markdown";
    default:
        return "unknown";
    }
}

/* Manage click events on the language menu */
function initLanguageMenu() {
    $('.language').click(function() {
        changeSelectedLanguage($(this).attr('id').replace('language-',''));
        render(editor.getSession().getValue());
    });
}

/* Manage click events on the export menu */
function initExportMenu() {
    $('.export').click(function() {
        switch (this.id)
        {
        case "export-text":
            saveText();
            break;
        case "export-html":
            saveHtml();
            break;
        case "export-pdf":
            break;
        }
    });
}

/* Handlers to show & hide toolbar */
function initToolbar() {
    $('header').mouseover(function() {
        $('#toolbar').slideDown('fast');
    });
    $('#editbox').click(function() {
        setTimeout(function() {
            $('#toolbar').slideUp('fast');
        },
        500);
    });
    $('#preview').click(function() {
        setTimeout(function() {
            $('#toolbar').slideUp('fast');
        },
        500);
    });
}

/* While codemirror is being loaded */
function whileLoading() {
    initTipsy();
    markdownConverter = new Showdown.converter();

    // Set current parser being used
    changeSelectedLanguage(window.location.hash.replace("#",""));

    // jQuery uniform controls (http://pixelmatrixdesign.com/uniform)
    $("select, input:checkbox, input:radio, input:file").uniform();

    // Hide all opened menus when clicking anywhere
    $(document).click(function(e) {
        var allMenus = $('.opener');
        allMenus.each(function() {
            hideWindow($(this));
        });
        $("#paper").removeClass('hover');
    });

    // When clicking the import button
    $('#import-button').click(function(e) {
        $('#paper').html("<p style='font-size:20px'><strong>Drag <em>&amp;</em> drop a file</strong>, from your system, into this paper sheet.</p>");
    });

    initLanguageMenu(); // Manage click events on the language menu
    initExportMenu(); // Manage click events on the export menu
    dropFile(); // Allow drag-and-drop of text files
}

/* When codemirror is ready */
function init() {
    render($('#code').val()); // Render the current example text
    initToolbar(); // Handlers to show & hide toolbar

    // Iphone switch
    $('#switch').iphoneSwitch("on", previewOn, writeOn,
        $('textarea'), { switch_path: '/images/switch.png' });

    $('#editor').hide(); // Hide editor panel
    $('#editbox').hide();
}

$(document).ready(function()
{
    whileLoading();

    editor = ace.edit("editor");

    editor.setReadOnly(true);
    editor.session.setUseWrapMode(true);
    editor.setShowPrintMargin(false);
    editor.setTheme("ace/theme/escrito");

    var connection = new sharejs.Connection(window.location.hostname, port);

    connection.open(docName, function(doc, error) {
      if (error) {
        console.error(error);
        return;
      }
      doc.attach_ace(editor);
      editor.setReadOnly(false);

      window.doc = doc;

      render(doc.snapshot);
      doc.on('change', function() {
        render(doc.snapshot);
      });
    });

    init();
});
