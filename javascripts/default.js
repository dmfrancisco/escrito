
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

////////////////////////////////////////////////////////////////////////////////////////////////////

/* Parse written content and update the preview panel */
function render(val) {
    switch (renderMode)
    {
    case "plain":
        val = val.replace(/\r\n|\r|\n/g, "<br />"); // Newlines
        val = val.replace(/  /g, "&nbsp;&nbsp;"); // Whitespaces
        $('#paper').html("<p></p>" + val);
        $('#import-button').attr("title", strings['import-button-title-plain']);
        $('#export-text').text(strings['export-text-plain']);
        break;

    case "textile":
        editor.setParser('TextileParser');
        $('#paper').html(textile(val));
        $('#import-button').attr("title", strings['import-button-title-textile']);
        $('#export-text').text(strings['export-text-textile']);
        break;

    case "markdown":
        editor.setParser('MarkdownParser');
        $('#paper').html(markdownConverter.makeHtml(val));
        $('#import-button').attr("title", strings['import-button-title-markdown']);
        $('#export-text').text(strings['export-text-markdown']);
        break;

    case "latex":
        break;
    }
}

function previewOn() {
    $('.editor').hide();
    $('#preview').show();
    render(editor.getCode());
    $('#preview').css('top', '0px');
    $('#preview').focus();

    // Return to saved scroll position of the preview mode
    $('#preview').attr({ scrollTop: scrollPos });
}

function writeOn() {
    // Save scroll position of the preview mode
    scrollPos = $('#preview').attr('scrollTop');

    $('#preview').hide();
    $('.editor').show();
    $('.editor').focus();
}

/* Text file drag-and-drop */
function dropFile() {
    if (typeof window.FileReader === 'undefined') {
        alert('fail');
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
          editor.setCode(event.target.result);
          render(event.target.result);
        };
        reader.readAsText(file);
        return false;
    });
}

/* Save written content */
function saveText() {
    var uriContent = "data:application/octet-stream," + encodeURIComponent(editor.getCode());
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

/* Manage click events on the language menu */
function initLanguageMenu() {
    $('.language').click(function() {
        $('.language').each(function() {
            $(this).text($(this).text().replace(' ✓', ''));
        })
        $(this).append(" ✓");

        switch (this.id)
        {
        case "language-plain":
            renderMode = "plain";
            break;
        case "language-textile":
            renderMode = "textile";
            break;
        case "language-markdown":
            renderMode = "markdown";
            break;
        case "language-latex":
            renderMode = "latex";
            break;
        }
        render(editor.getCode());
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
    $('#toolbar-area').mouseover(function() {
        $('#toolbar').slideDown('fast');
    });
    $(editor.win.document).click(function() {
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
    $('.editor').hide(); // Hide editor panel
    initTipsy();
    markdownConverter = new Showdown.converter();

    renderMode = "textile"; // Current parser being used
    $('#language-textile').append(" ✓"); // Update the language menu

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
        editor.win.document, { switch_path: 'images/switch.png' });
}

$(document).ready(function()
{
    // Write panel
    editor = CodeMirror.fromTextArea('code', {
        parserfile: ["javascripts/modes/markdown.js", "javascripts/modes/textile.js"],
        stylesheet: "stylesheets/modes/default.css",
        basefiles: ["javascripts/codemirror/codemirror_base.js"],
        textWrapping: true,
        saveFunction: saveText,
        indentUnit: 4,
        parserConfig: { 'strictErrors': true },
        iframeClass: "editor",
        height: '100%',
        initCallback: init
    });

    whileLoading();
});