/*
 * Dropdown menus
 * by Raj Ramamurthy
 * http://mynameisraj.com/
 */
var dropdownMenus = function () {
    function hideWindow(startLink) {
        var popup = startLink.next('.popup');
        startLink.removeClass('open');
        popup.removeClass('open');
        popup.hide();
    }

    function showWindow(startLink) {
        var popup = startLink.next('.popup');
        popup.show();
        startLink.addClass('open');
        popup.addClass('open');
    }

    function makeOverlay() {
        var $body = $('body'), overlay = document.createElement('div');
        $body.css('overflow', 'hidden');
        overlay.id = 'overlay';
        $body.append(overlay);
        $(overlay).addClass('visible');
    }

    function close(windowName) {
        var $overlay = $('#overlay');
        $('body').css('overflow', 'auto');
        $(windowName).removeClass('visible');
        $overlay.removeClass('visible');
        $overlay.remove();
        $(windowName).hide();
    }

    function makeWindow(windowName) {
        makeOverlay();
        $(windowName).hide();
        $(windowName).show();
        $(windowName).addClass('visible');
        $('.close-button').click(function () {
            close(windowName);
        });
    }

    function init() {
        $(this).children('ul').hide();

        $('.window-button').click(function (e) {
            e.preventDefault();
            makeWindow('#window');
        });

        $('.opener').click(function (e) {
            e.stopPropagation();
            e.preventDefault();
            if ($(this).hasClass('open')) {
                hideWindow($(this));
            } else {
                showWindow($(this));
                var startLink = $(this);
            }
        });

        $('.opener').mouseenter(function (e) {
            var allMenus = $('.open');
            // Check if there is a menu open, or if there was and now the user
            // is reading the tipsy tooltip (menu-link class)
            if (allMenus.length !== 0 || $('.menu-link').length !== 0) {
                // Hide all the opened menus
                allMenus.each(function () {
                    hideWindow($(this));
                });
                // Remove the helper class
                $('.menu-link').each(function () {
                    $(this).removeClass('menu-link');
                });
                // Show this one
                showWindow($(this));
            }
        });

        $('.submenu').hover(function () {
            $(this).children('ul').show();
            $(this).children('ul').addClass('visible');
        }, function () {
            $(this).children('ul').removeClass('visible');
            $(this).children('ul').hide();
        });
    }

    return { init : init, hideWindow : hideWindow, showWindow : showWindow, makeWindow : makeWindow };
}();


/*
 * jQuery iphoneSwitch plugin
 * by Daniel LaBare and Ashley
 * http://papermashup.com/jquery-iphone-style-ajax-switch/
 */
jQuery.fn.iphoneSwitch = function (start_state, switched_on_callback, switched_off_callback, editor, button, options) {
    var state = start_state === 'on' ? start_state : 'off',
        settings = { // Define default settings
            mouse_over: 'pointer',
            mouse_out:  'default',
            // switch_on_container_path: 'iphone_switch_container_on.png',
            // switch_off_container_path: 'iphone_switch_container_off.png',
            switch_path: 'iphone_switch.png',
            switch_height: 24,
            switch_width: 80
        };

    if (options) {
        jQuery.extend(settings, options);
    }

    var switchPanel = function (additionalCallback) {
        if (state === 'on') {
            $(document).find('.iphone_switch').animate({backgroundPosition: -40}, 300, function () {
                // $(document).attr('src', settings.switch_off_container_path);
                switched_off_callback();
                if (typeof (additionalCallback) === "function") {
                    additionalCallback();
                }
            });
            state = 'off';
        } else {
            $(document).find('.iphone_switch').animate({backgroundPosition: 0}, 300, function () {
                switched_on_callback();
                if (typeof (additionalCallback) === "function") {
                    additionalCallback();
                }
            });
            // $(document).find('.iphone_switch').attr('src', settings.switch_on_container_path);
            state = 'on';
        }
    };

    // Click handling
    $(this).click(switchPanel);
    $(document).bind('keydown', 'Shift+tab', switchPanel);
    $(editor).bind('keydown', 'Shift+tab', switchPanel);
    $(button).live('click', function () {
        if (state === 'off') {
            switchPanel(function () {
                // This shouldn't be done here of course, but this is not a serious project so I'm not worried
                escrito.addImportInstructions();
            });
        }
    });

    // Create the switch
    return this.each(function () {
        var container, image;

        // Make the container
        container = $('<div class="iphone_switch_container" style="height:' + settings.switch_height + 'px; width:' +
                      settings.switch_width + 'px; position: relative; overflow: hidden"></div>');

        // Make the switch image based on starting state
        image = $('<div class="iphone_switch" style="height:' + settings.switch_height + 'px; width:' +
                  settings.switch_width + 'px; background-image:url(' + settings.switch_path +
                  '); background-repeat:none; background-position:' + (state === 'on' ? 0 : -40) +
                  'px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px;" /></div>');

        // Insert into placeholder
        $(this).html(jQuery(container).html(jQuery(image)));

        $(this).mouseover(function () {
            $(this).css("cursor", settings.mouse_over);
        });
        $(this).mouseout(function () {
            $(this).css("background", settings.mouse_out);
        });
    });
};


/*
 * Escrito
 * -------
 */
var escrito = function () {
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

    var renderMode, // Current parser being used
        scrollPos = 0, // Persist scroll position of the preview mode
        editor,
        $preview,
        $editbox,
        markdownConverter;

    var TextMode = require("ace/mode/text").Mode,
        textMode = new TextMode(),
        TextileMode = require("ace/mode/textile").Mode,
        textileMode = new TextileMode(),
        MarkdownMode = require("ace/mode/markdown").Mode,
        markdownMode = new MarkdownMode();

    function urlX(url) { if (/^https?:\/\//.test(url)) { return url } }
    function idX(id) { return id }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    /* Parse written content and update the preview panel */
    function render(val) {
        // This only needs to be done when the user is in preview mode
        if (!$preview.is(":visible")) {
            return;
        }

        if (!val) {
            val = editor.getSession().getValue();
        }
        // Sanitize the content
        val = html_sanitize(val, urlX, idX);

        switch (renderMode) {
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
        // $editbox.hide();
        $preview.show();

        render(editor.getSession().getValue());

        // Return to saved scroll position of the preview mode
        $preview.attr({ scrollTop: scrollPos });
        $preview.focus();
    }

    function writeOn() {
        // Save scroll position of the preview mode
        scrollPos = $preview.attr('scrollTop');

        $preview.hide();
        $editbox.show();
        $('textarea').focus();
    }

    function languageByFilename(filename) {
        switch (filename.split('.').pop()) {
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

    function changeSelectedLanguage(lang) {
        $('.language').each(function () {
            $(this).text($(this).text().replace(' ✓', ''));
        });

        switch (lang) {
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

    /* Text file drag-and-drop */
    function dropFile() {
        // Check for File API support
        // if (typeof window.File === 'undefined' ||
        //     typeof window.FileReader === 'undefined') {
        //   alert('The File APIs are not fully supported in this browser.');
        // }

        $("#preview").bind('dragover', function () {
            $("#paper").addClass('hover');
            return false;
        }).bind("dragend", function () {
            $("#paper").removeClass('hover');
            return false;
        }).bind("drop", function (e) {
            $("#paper").removeClass('hover');
            e.stopPropagation();
            e.preventDefault();

            renderImportedFile(e.originalEvent.dataTransfer.files[0]);
            return false;
        });
    }

    /* Upload a text file (with-out drag-and-drop) */
    function uploadFileClientSide() {
        // if (typeof window.FileReader === 'undefined') {
        //      alert('The File APIs are not fully supported in this browser.');
        // }
        var $upload = $("input:file");

        $upload.change(function (e) {
            e.stopPropagation();
            e.preventDefault();

            renderImportedFile($upload.get(0).files[0]);
            return false;
        });
    };

    function renderImportedFile(file) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var lang = languageByFilename(file.name);
            if (lang === 'unknown') {
                return false;
            } else {
                changeSelectedLanguage(lang);
            }
            editor.getSession().setValue(event.target.result);
            render(event.target.result);
        };
        reader.readAsText(file);
    }

    /* Print some instructions on how to upload files in the paper sheet */
    function addImportInstructions() {
        var importMessage = "";

        if (typeof window.File !== 'undefined' &&
            typeof window.FileReader !== 'undefined' &&
            Modernizr.draganddrop) { /* Chrome & Firefox 4+ */
            importMessage = "<p style='font-size:20px'><strong>Drag <em>&amp;</em> drop a file</strong>, " +
                            "from your system, into this paper sheet.</p><p>Alternatively, you can also " +
                            "upload it here: <input type=file></p>";

        } else if (typeof window.FileReader !== 'undefined') { /* Opera? */
            importMessage = "<p style='font-size:20px'><strong>Upload a file</strong>, " +
                            "from your system: <input type=file></p>";
        } else { /* IE */
            importMessage = "<p style='font-size:20px'>Currently, <strong>we don't support file uploads</strong> " +
                            "to our servers.</p><p>Please, copy <em>&amp;</em> paste your file's content or try a "+
                            "different browser, such as Chrome or Firefox.</p>";
        }

        $('#paper').html(importMessage);
        $("input:file").uniform({fileDefaultText: 'No file chosen'});
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
        ], uriContent = "data:application/octet-stream," +
            encodeURIComponent("<html>\n<head>\n  <meta charset=\"UTF-8\">\n"+ attrs.join("\n") +"\n<head>\n" +
                               "<body>\n"+ $('#paper').html() + "\n</body>\n</html>\n");
        document.location.href = uriContent;
    }

    /* Tooltips (http://onehackoranother.com/projects/jquery/tipsy) */
    function initTipsy() {
        var $importButton = $('#import-button');
        $importButton.tipsy({
            opacity: 1,
            trigger: 'manual'
        });
        $importButton.bind('mouseenter', function (e) {
            var allMenus = $('.opener'); // Check if there is a menu opened
            if (allMenus.filter('.open').length != 0) {
                // Hide all opened menus but add a class to enable linked menus
                allMenus.each(function () {
                    dropdownMenus.hideWindow($(this));
                    $(this).addClass('menu-link');
                });
            }
            $(this).tipsy("show");
        });
        $importButton.bind('mouseleave', function (e) {
            $(this).tipsy("hide");
        });
    }

    /* Manage click events on the language menu */
    function initLanguageMenu() {
        $('.language').click(function () {
            changeSelectedLanguage($(this).attr('id').replace('language-',''));
            render(editor.getSession().getValue());
        });
    }

    /* Manage click events on the export menu */
    function initExportMenu() {
        $('.export').click(function () {
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
        $('header').mouseover(function () {
            $('#toolbar').slideDown('fast');
        });
        $editbox.click(function () {
            window.setTimeout(function () {
                $('#toolbar').slideUp('fast');
            }, 500);
        });
        $preview.click(function () {
            window.setTimeout(function () {
                $('#toolbar').slideUp('fast');
            }, 500);
        });
    }

    function init() {
        $preview = $('#preview');
        $editbox = $('#editbox');
        $('#paper').activity({ segments: 12, align: 'left', valign: 'top', steps: 3,
                               width: 2, space: 1, length: 3, color: '#030303', speed: 1.5});

        initTipsy();
        dropdownMenus.init();
        markdownConverter = new Showdown.converter();

        // Set current parser being used
        changeSelectedLanguage(window.location.hash.replace("#", ""));

        // Hide all opened menus when clicking anywhere
        $(document).click(function (e) {
            var allMenus = $('.opener');
            allMenus.each(function () {
                dropdownMenus.hideWindow($(this));
            });
            $("#paper").removeClass('hover');
        });

        // When clicking the import button
        $('#import-button').click(function (e) {
            addImportInstructions();
            uploadFileClientSide();
        });

        initLanguageMenu(); // Manage click events on the language menu
        initExportMenu(); // Manage click events on the export menu
        dropFile(); // Allow drag-and-drop of text files

        // Handlers to show & hide toolbar
        initToolbar();

        /* Create the editor */
        editor = ace.edit("editor");

        /* Configure and start the editor */
        editor.setReadOnly(true);
        editor.session.setUseWrapMode(true);
        editor.setShowPrintMargin(false);
        editor.setTheme("ace/theme/escrito");

        if (window.location.hostname !== "localhost") {  // FIXME
            port = "80";
        }
        var connected = false;
        var connection;

        function openConnection() {
            connection = new sharejs.Connection(window.location.hostname, port);
            connection.open(docName, function (doc, error) {
                if (error) {
                    console.error(error);
                    return;
                }
                connected = true;
                doc.attach_ace(editor);
                editor.setReadOnly(false);

                window.doc = doc;
                render(doc.snapshot);

                // Iphone switch
                $('#switch').iphoneSwitch("on", previewOn, writeOn,
                    $('textarea'), $('#import-button'), { switch_path: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAYCAYAAAAxkDmIAAAACXBIWXMAAAsTAAALEwEAmpwYAAADX0lEQVRoBe1avU5yQRAdfsRgRUVoJCHEgCRgS0WBiYmBwEPgA8ATgG/gq0gDlYUtDSIx2GgslQRoQOVXzprlM3wXdBfQuQmbbO7dvTNzD3t2Znb3YplMJsS5XFxcFCqVSt7j8ZDFYmEBFWPWarXo6OjoPJvNFliAWgDCvqCfTXen08mfnZ1RKBQiORlBtLwnAumfk/Rr/6J7I3kVWQwM5O/u7qhUKuWnzQL6uBb2BLtcLgoEAvT09MRqDA8ODujm5oYVJiMwVqNObn1vb2/cIFG/32eHyQgQe4IRil9fX42w/2nf+/v7lzTxp1CWvpx9iAbBg8Fg6Y/4yUPkTVn+5W/Zo37dEqw+ZoYaIGM8Hhs++0mn1Wolu90uKu5hazgcirqKXeiuY6L85DesImMKD4a32Gw25d8JHafTSc/Pz3R1dUWNRoMODw8pHo+T2+0WoX80GinbhcLWg7WG7X8l6cGqBMNb9/b26PLyUpDrcDiEF9frdarVahSLxej09JS63a5WhDCLB5tikaUTSnd2doTnlstl4f0I0yAduRjX6+trajabBDmdsiVYZ9QW6KhuSUDi7u4ulUtl4bUg0SIORKZHItOcLgtIhtzXBZh89t1VFdN39jb13BQ5WNeDb+u3s9w9mZ52Tcaf5EqS7+/vtx68qZmlYlcSoqID2XA4LPIrFlJy5YwrJgxqMBhUNTmT18U0M/BLN+xzsG6uw945nU6L1S7CKdqoIBht1JOTE+09NgjWiSy/xOvsNewJxkCCFJUCHWxjfD4fJZNJoQ8vBiHymkgkaH9/X3u7o4pJBf86ZdnnYF0vgbdOv0RRJpOh4+NjKhaLhC1SJBKhVCpFXq9XrKIhp1t099C679PRY08wvBHbGtWCiYE9LvTxLTmXy4kFF0hB/8vLC/V6Pe0wC0ywzb2YgmCEW50iyYR+u90WEwXEI7yi6kYHYNmeZOkwsgEdkCgXWdK8GTxPYl31yt6D8QN1DiLmB2bdpK4D0zzGTbTVk9smUCyxCWJWCaVLTK/8aN2TZmVABgZMQTBHb+E66eY5Zh+isY15eHgQCyR5UIHBhfeggny0VVbaKvJSFu/BO/DRAmfbj4+P2sec8yRsss2eYL/ff16tVvP48sOlYGLhb7PRaPScC6ZFOD4AFNj+VItvRd8AAAAASUVORK5CYII=' }); // switch_path: '/images/switch.png'

                $preview.focus();
                $preview.activity(false);
                doc.on('change', function () {
                    render(doc.snapshot);
                });
            });
        }

        openConnection();
        setTimeout(function () { responseTimeout(); }, 8000);
        function responseTimeout() {
            // If it's taking too long, try again (this happens a lot because heroku doesn't support websockets)
            if (!connected) {
                console.log("Trying to connect one more time");
                openConnection();
                setTimeout(function () { responseTimeout(); }, 8000);
            }
        }
    }

    return { init : init, addImportInstructions: addImportInstructions };
}();

$(document).ready(function () {
    escrito.init();
});
