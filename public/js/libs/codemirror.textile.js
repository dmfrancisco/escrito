/*
 * Textile dummy parser
 * If you ever implemented a codemirror parser for Textile please email me at
 * hello [at] dmfranc [dot] com
 */
var TextileParser = Editor.Parser = (function() {
    var an = /[a-zA-Z0-9ßÄÖÜäöüÑñÉéÈèÁáÀàÂâŶĈĉĜĝŷÊêÔôÛûŴŵõãûêôâî,:.!()? ]/;
    var endLine = false;
    var startLine = true;

    function mustCompleteLine() {
        endLine = true;
    }

    function next(source, exp) {
        return (!source.endOfLine() && source.next() == exp);
    }

    function nextWhile(source, exp) {
        var i = -1;
        source.nextWhile(function(c) {
            i++;
            return (c != null && c != "\n" && c != "\r" && c.match(exp));
        });
        return i;
    }

    function completeTo(source, cls) {
        while (!source.endOfLine())
            source.next();
        return cls;
    }

    function tokenize(source) {
        if (endLine) {
            endLine = false;
            return completeTo(source, 'nochange');
        }
        var ch = source.next();

        // Paragraph
        if (ch == 'p' && startLine) {
            nextWhile(source, /\(/);
            if (next(source, '.'))
                return 'paragraph';
        }
        // Titles
        if (ch == 'h' && startLine) {
            nextWhile(source, /\d/);
            if (next(source, '.'))
                return 'title';
        }
        // Blockquote
        if (ch == 'b' && startLine) {
            if (next(source, 'q') && next(source, '.'))
                return 'blockquote';
        }
        // Unordered list of items
        if (ch == '*' && startLine) {
            // if (source.lookAhead('**')) {
            //     nextWhile(source, /\*/);
            //     if (next(source, ' ')) {
            //         mustCompleteLine();
            //         return 'unordered-list-third-level-item';
            //     }
            // }
            // else if (source.lookAhead('* ')) {
            //     nextWhile(source, /\*/);
            //     mustCompleteLine();
            //     return 'unordered-list-second-level-item';
            // }
            // else if (source.lookAhead(' ')) {
            //     mustCompleteLine();
            //     return 'unordered-list-first-level-item';
            // }
            nextWhile(source, /\*/);
            if (next(source, ' '))
                return 'unordered-list-item';
        }
        // Ordered list of items
        if (ch == '#' && startLine) {
            // if (source.lookAhead('##')) {
            //     nextWhile(source, '#');
            //     if (next(source, ' ')) {
            //         mustCompleteLine();
            //         return 'ordered-list-third-level-item';
            //     }
            // }
            // else if (source.lookAhead('# ')) {
            //     nextWhile(source, /\#/);
            //     mustCompleteLine();
            //     return 'ordered-list-second-level-item';
            // }
            // else if (source.lookAhead(' ')) {
            //     mustCompleteLine();
            //     return 'ordered-list-first-level-item';
            // }
            nextWhile(source, '#');
            if (next(source, ' '))
                return 'ordered-list-item';
        }
        // Bold
        if (ch == '*') {
            if (nextWhile(source, an) && next(source, '*'))
                return 'bold';
        }
        // Underline
        if (ch == '+') {
            if (nextWhile(source, an) && next(source, '+'))
                return 'underline';
        }
        // Strikethrough
        if (ch == '-') {
            if (nextWhile(source, an) && next(source, '-'))
                return 'strikethrough';
        }
        // Italic
        if (ch == '_') {
            if (nextWhile(source, an) && next(source, '_'))
                return 'italic';
        }
        // Subscript
        if (ch == '~') {
            if (nextWhile(source, an) && next(source, '~'))
                return 'subscript';
        }
        // Superscript
        if (ch == '^') {
            if (nextWhile(source, an) && next(source, '^'))
                return 'superscript';
        }
        return 'nochange';
    }

    function tokenizeTextile(source) {
        var s = tokenize(source);
        startLine = source.endOfLine();
        return s;
    }

    return {
        make: function(source) {
            source = tokenizer(source, tokenizeTextile);
            var iter = {
                next: function() {
                    return source.next();
                },
                copy: function() {
                    return function(_source) {
                        source = tokenizer(_source, tokenizeTextile);
                        return iter;
                    };
                }
            };
            return iter;
        }
    };
})();
