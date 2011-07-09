/*
 * Dropdown menus
 * by Raj Ramamurthy
 * http://mynameisraj.com/
 */
dropdownMenus = function() {
    function init() {
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
            }
        });

        $('.opener').mouseenter(function(e) {
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
    };

    function hideWindow(startLink) {
        var popup = startLink.next('.popup');
        var openButton = startLink;
        openButton.removeClass('open');
        popup.removeClass('open');
        popup.hide();
    };

    function showWindow(startLink) {
        var popup = startLink.next('.popup');
        popup.show();
        startLink.addClass('open');
        popup.addClass('open');
    };

    function makeOverlay() {
        var body = $('body');
        body.css('overflow', 'hidden');
        var overlay = document.createElement('div');
        overlay.id = 'overlay';
        body.append(overlay);
        $(overlay).addClass('visible');
    };

    function close(windowName) {
        var overlay = $('#overlay');
        $('body').css('overflow', 'auto');
        $(windowName).removeClass('visible');
        overlay.removeClass('visible');
        overlay.remove();
        $(windowName).hide();
    };

    function makeWindow(windowName) {
        makeOverlay();
        $(windowName).hide();
        $(windowName).show();
        $(windowName).addClass('visible');
        $('.close-button').click(function() {
            close(windowName);
        });
    };

    return { init:init, hideWindow:hideWindow, showWindow:showWindow, makeWindow:makeWindow }
}();


/*
 * jQuery iphoneSwitch plugin
 * by Daniel LaBare and Ashley
 * http://papermashup.com/jquery-iphone-style-ajax-switch/
 */
jQuery.fn.iphoneSwitch = function(start_state, switched_on_callback, switched_off_callback, editor, button, options) {
    var state = start_state == 'on' ? start_state : 'off';

    // Define default settings
    var settings = {
        mouse_over: 'pointer',
        mouse_out:  'default',
        switch_on_container_path: 'iphone_switch_container_on.png',
        switch_off_container_path: 'iphone_switch_container_off.png',
        switch_path: 'iphone_switch.png',
        switch_height: 24,
        switch_width: 80
    };

    if (options) {
        jQuery.extend(settings, options);
    }

    var switchPanel = function(additionalCallback) {
        if (state == 'on') {
            $(document).find('.iphone_switch').animate({backgroundPosition: -40}, 300, function() {
                jQuery(document).attr('src', settings.switch_off_container_path);
                switched_off_callback();
                if (typeof(additionalCallback) == "function") additionalCallback();
            });
            state = 'off';
        }
        else {
            $(document).find('.iphone_switch').animate({backgroundPosition: 0}, 300, function() {
                switched_on_callback();
                if (typeof(additionalCallback) == "function") additionalCallback();
            });
            $(document).find('.iphone_switch').attr('src', settings.switch_on_container_path);
            state = 'on';
        }
    }

    // Click handling
    $(this).click(switchPanel);
    $(document).bind('keydown', 'Shift+tab',switchPanel);
    $(editor).bind('keydown', 'Shift+tab', switchPanel);
    $(button).live('click', function() {
        if (state == 'off') {
            switchPanel(function() {
                // This shouldn't be done here of course, but this is not a serious project so I'm not worried
                $('#paper').html("<p style='font-size:20px'><strong>Drag <em>&amp;</em> drop a file</strong>, from " +
                                 "your system, into this paper sheet.</p>");
            });
        }
    });

    // Create the switch
    return this.each(function() {
        var container;
        var image;

        // Make the container
        container = $('<div class="iphone_switch_container" style="height:' + settings.switch_height + 'px; width:' +
                      settings.switch_width + 'px; position: relative; overflow: hidden"></div>');

        // Make the switch image based on starting state
        image = $('<div class="iphone_switch" style="height:' + settings.switch_height + 'px; width:' +
                  settings.switch_width + 'px; background-image:url(' + settings.switch_path +
                  '); background-repeat:none; background-position:' + (state == 'on' ? 0 : -40) +
                  'px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px;" /></div>');

        // Insert into placeholder
        $(this).html(jQuery(container).html(jQuery(image)));

        $(this).mouseover(function() {
            $(this).css("cursor", settings.mouse_over);
        });
        $(this).mouseout(function() {
            $(this).css("background", settings.mouse_out);
        });
    });
};


/*
 * Escrito
 * -------
 */
escrito = function() {
    var strings = {
        // Titles
        "import-button-title-plain": "Import a text file from your system",
        "import-button-title-textile": "Import a Textile file from your system",
        "import-button-title-markdown": "Import a Markdown file from your system",
        // Menus
        "export-text-plain": "Text file",
        "export-text-textile": "Textile file",
        "export-text-markdown": "Markdown file"
    };

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
        if (!val) {
            val = editor.getSession().getValue();
        }

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
    };

    function previewOn() {
        var $preview = $('#preview');

        $('#editbox').hide();
        $preview.show();
        render(editor.getSession().getValue());

        // Return to saved scroll position of the preview mode
        $preview.attr({ scrollTop: scrollPos });
    };

    function writeOn() {
        var $preview = $('#preview');

        // Save scroll position of the preview mode
        scrollPos = $preview.attr('scrollTop');

        $preview.hide();
        $('#editbox').show();
        $('textarea').focus();
    };

    /* Text file drag-and-drop */
    function dropFile() {
        // Check for File API support
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
                if (lang === 'unknown') {
                    return false;
                }
                else {
                    changeSelectedLanguage(lang);
                }
                editor.getSession().setValue(event.target.result);
                render(event.target.result);
            };
            reader.readAsText(file);
            return false;
        });
    };

    /* Save written content */
    function saveText() {
        var uriContent = "data:application/octet-stream," + encodeURIComponent(editor.getSession().getValue());
        document.location.href = uriContent;
    };

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
            encodeURIComponent("<html>\n<head>\n"+ attrs.join("\n") +"\n<head>\n<body>\n"+ $('#paper').html() +
                               "\n</body>\n</html>\n");
        document.location.href = uriContent;
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    /* Tooltips (http://onehackoranother.com/projects/jquery/tipsy) */
    function initTipsy() {
        var $importButton = $('#import-button');
        $importButton.tipsy({
            opacity: 1,
            trigger: 'manual'
        });
        $importButton.bind('mouseenter', function(e) {
            var allMenus = $('.opener'); // Check if there is a menu opened
            if (allMenus.filter('.open').length != 0) {
                // Hide all opened menus but add a class to enable linked menus
                allMenus.each(function() {
                    dropdownMenus.hideWindow($(this));
                    $(this).addClass('menu-link');
                });
            }
            $(this).tipsy("show");
        });
        $importButton.bind('mouseleave', function(e) {
            $(this).tipsy("hide");
        });
    };

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
    };

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
    };

    /* Manage click events on the language menu */
    function initLanguageMenu() {
        $('.language').click(function() {
            changeSelectedLanguage($(this).attr('id').replace('language-',''));
            render(editor.getSession().getValue());
        });
    };

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
    };

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
    };

    /* While codemirror is being loaded */
    function whileLoading() {
        initTipsy();
        markdownConverter = new Showdown.converter();

        // Set current parser being used
        changeSelectedLanguage(window.location.hash.replace("#",""));

        // Hide all opened menus when clicking anywhere
        $(document).click(function(e) {
            var allMenus = $('.opener');
            allMenus.each(function() {
                dropdownMenus.hideWindow($(this));
            });
            $("#paper").removeClass('hover');
        });

        // When clicking the import button
        $('#import-button').click(function(e) {
            $('#paper').html("<p style='font-size:20px'><strong>Drag <em>&amp;</em> drop a file</strong>, from your" +
                             " system, into this paper sheet.</p>");
        });

        initLanguageMenu(); // Manage click events on the language menu
        initExportMenu(); // Manage click events on the export menu
        dropFile(); // Allow drag-and-drop of text files
    };

    /* When codemirror is ready */
    function complete() {
        render($('#code').val()); // Render the current example text
        initToolbar(); // Handlers to show & hide toolbar

        // Iphone switch
        $('#switch').iphoneSwitch("on", previewOn, writeOn,
            $('textarea'), $('#import-button'), { switch_path: '/images/switch.png' });

        $('#editbox').hide(); // Hide editor panel
    };

    function init() {
        dropdownMenus.init();
        whileLoading();

        editor = ace.edit("editor");

        editor.setReadOnly(true);
        editor.session.setUseWrapMode(true);
        editor.setShowPrintMargin(false);
        editor.setTheme("ace/theme/escrito");

        if (window.location.hostname != "localhost") {  // FIXME
            port = "80"
        }
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

        complete();
    };

    return { init:init }
}();

$(document).ready(function()
{
    escrito.init();
});
