var MarkdownParser = Editor.Parser = (function() {
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

        // Titles
        if (ch == '#') {
            nextWhile(source, '#');
            return 'title';
        }
        if (ch == '=') {
            nextWhile(source, '=');
            return 'title';
        }
        // Rule
        if (ch == '-') {
            nextWhile(source, '-');
            return 'rule';
        }
        // Blockquote
        if (ch == '>' && startLine) {
            if (next(source, ' '))
                return 'blockquote';
        }
        // Unordered list of items
        if (ch == '*' && startLine) {
            nextWhile(source, /\*/);
            if (next(source, ' '))
                return 'unordered-list-item';
        }
        // Ordered list of items
        if (ch.match(/\d/) && startLine) {
            nextWhile(source, /\d/);
            if (next(source, '.'))
                return 'ordered-list-item';
        }
        // Bold
        if (ch == '*' && source.lookAhead('*')) {
            next(source, '*');
            if (nextWhile(source, an) && next(source, '*') && next(source, '*'))
                return 'bold';
        }
        if (ch == '_' && source.lookAhead('_')) {
            next(source, '_');
            if (nextWhile(source, an) && next(source, '_') && next(source, '_'))
                return 'bold';
        }
        // Italic
        if (ch == '*') {
            if (nextWhile(source, an) && next(source, '*'))
                return 'italic';
        }
        if (ch == '_') {
            if (nextWhile(source, an) && next(source, '_'))
                return 'italic';
        }
        // Link
        if (ch == '[' || ch == ']') {
            return 'link';
        }
        return 'nochange';
    }

    function tokenizeMarkdown(source) {
        var s = tokenize(source);
        startLine = source.endOfLine();
        return s;
    }

    return {
        make: function(source) {
            source = tokenizer(source, tokenizeMarkdown);
            var iter = {
                next: function() {
                    return source.next();
                },
                copy: function() {
                    return function(_source) {
                        source = tokenizer(_source, tokenizeMarkdown);
                        return iter;
                    };
                }
            };
            return iter;
        }
    };
})();