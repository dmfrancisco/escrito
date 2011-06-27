// usage: log('inside coolFunc', this, arguments);
window.log = function(){
    log.history = log.history || []; // store logs to an array for reference
    log.history.push(arguments);
    arguments.callee = arguments.callee.caller;
    if(this.console) console.log( Array.prototype.slice.call(arguments) );
};
// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});


/*
 * jQuery Hotkeys Plugin
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 *
 * Based upon the plugin by Tzury Bar Yochay:
 * http://github.com/tzuryby/hotkeys
 *
 * Original idea by:
 * Binny V A, http://www.openjs.com/scripts/events/keyboard_shortcuts/
*/
(function(jQuery){
    jQuery.hotkeys = {
        version: "0.8",
        specialKeys: {
            8: "backspace", 9: "tab", 13: "return", 16: "shift", 17: "ctrl", 18: "alt", 19: "pause",
            20: "capslock", 27: "esc", 32: "space", 33: "pageup", 34: "pagedown", 35: "end", 36: "home",
            37: "left", 38: "up", 39: "right", 40: "down", 45: "insert", 46: "del",
            96: "0", 97: "1", 98: "2", 99: "3", 100: "4", 101: "5", 102: "6", 103: "7",
            104: "8", 105: "9", 106: "*", 107: "+", 109: "-", 110: ".", 111 : "/",
            112: "f1", 113: "f2", 114: "f3", 115: "f4", 116: "f5", 117: "f6", 118: "f7", 119: "f8",
            120: "f9", 121: "f10", 122: "f11", 123: "f12", 144: "numlock", 145: "scroll", 191: "/", 224: "meta"
        },
        shiftNums: {
            "`": "~", "1": "!", "2": "@", "3": "#", "4": "$", "5": "%", "6": "^", "7": "&",
            "8": "*", "9": "(", "0": ")", "-": "_", "=": "+", ";": ": ", "'": "\"", ",": "<",
            ".": ">",  "/": "?",  "\\": "|"
        }
    };
    function keyHandler( handleObj ) {
        // Only care when a possible input has been specified
        if ( typeof handleObj.data !== "string" ) {
            return;
        }

        var origHandler = handleObj.handler,
            keys = handleObj.data.toLowerCase().split(" ");

        handleObj.handler = function( event ) {
            // Don't fire in text-accepting inputs that we didn't directly bind to
            if ( this !== event.target && (/textarea|select/i.test( event.target.nodeName ) ||
                 event.target.type === "text") ) {
                return;
            }

            // Keypress represents characters, not special keys
            var special = event.type !== "keypress" && jQuery.hotkeys.specialKeys[ event.which ],
                character = String.fromCharCode( event.which ).toLowerCase(),
                key, modif = "", possible = {};

            // check combinations (alt|ctrl|shift+anything)
            if ( event.altKey && special !== "alt" ) {
                modif += "alt+";
            }
            if ( event.ctrlKey && special !== "ctrl" ) {
                modif += "ctrl+";
            }
            // TODO: Need to make sure this works consistently across platforms
            if ( event.metaKey && !event.ctrlKey && special !== "meta" ) {
                modif += "meta+";
            }
            if ( event.shiftKey && special !== "shift" ) {
                modif += "shift+";
            }
            if ( special ) {
                possible[ modif + special ] = true;
            } else {
                possible[ modif + character ] = true;
                possible[ modif + jQuery.hotkeys.shiftNums[ character ] ] = true;

                // "$" can be triggered as "Shift+4" or "Shift+$" or just "$"
                if ( modif === "shift+" ) {
                    possible[ jQuery.hotkeys.shiftNums[ character ] ] = true;
                }
            }
            for ( var i = 0, l = keys.length; i < l; i++ ) {
                if ( possible[ keys[i] ] ) {
                    return origHandler.apply( this, arguments );
                }
            }
        };
    }
    jQuery.each([ "keydown", "keyup", "keypress" ], function() {
        jQuery.event.special[ this ] = { add: keyHandler };
    });
})( jQuery );


/*
 * jQuery iphoneSwitch plugin
 * by Daniel LaBare
*/
jQuery.fn.iphoneSwitch = function(start_state, switched_on_callback, switched_off_callback, editor, options) {

    var state = start_state == 'on' ? start_state : 'off';

    // define default settings
    var settings = {
        mouse_over: 'pointer',
        mouse_out:  'default',
        switch_on_container_path: 'iphone_switch_container_on.png',
        switch_off_container_path: 'iphone_switch_container_off.png',
        switch_path: 'iphone_switch.png',
        switch_height: 24,
        switch_width: 80
    };

    if(options) {
        jQuery.extend(settings, options);
    }

    // click handling
    var switchPanel = function() {
        if(state == 'on') {
            jQuery(document).find('.iphone_switch').animate({backgroundPosition: -40}, 300, function() {
                jQuery(document).attr('src', settings.switch_off_container_path);
                switched_off_callback();
            });
            state = 'off';
        }
        else {
            jQuery(document).find('.iphone_switch').animate({backgroundPosition: 0}, 300, function() {
                switched_on_callback();
            });
            jQuery(document).find('.iphone_switch').attr('src', settings.switch_on_container_path);
            state = 'on';
        }
    }

    // click handling
    jQuery(this).click(switchPanel);
    jQuery(document).bind('keydown', 'Shift+tab',switchPanel);
    jQuery(editor).bind('keydown', 'Shift+tab', switchPanel);
    // jQuery(document).bind('keydown', 'tab',switchPanel);
    // jQuery(editor).bind('keydown', 'tab', switchPanel);

    // create the switch
    return this.each(function() {
        var container;
        var image;

        // make the container
        container = jQuery('<div class="iphone_switch_container" style="height:'+settings.switch_height+'px; width:'+settings.switch_width+'px; position: relative; overflow: hidden"></div>');

        // make the switch image based on starting state
        image = jQuery('<div class="iphone_switch" style="height:'+settings.switch_height+'px; width:'+settings.switch_width+'px; background-image:url('+settings.switch_path+'); background-repeat:none; background-position:'+(state == 'on' ? 0 : -40)+'px; border-radius: 3px; -webkit-border-radius: 3px; -moz-border-radius: 3px;" /></div>');

        // insert into placeholder
        jQuery(this).html(jQuery(container).html(jQuery(image)));

        jQuery(this).mouseover(function(){
            jQuery(this).css("cursor", settings.mouse_over);
        });

        jQuery(this).mouseout(function(){
            jQuery(this).css("background", settings.mouse_out);
        });
    });
};


/*
 * tipsy, facebook style tooltips for jquery
 * version 1.0.0a
 * (c) 2008-2010 jason frame [jason@onehackoranother.com]
 * released under the MIT license
*/
(function($) {

    function maybeCall(thing, ctx) {
        return (typeof thing == 'function') ? (thing.call(ctx)) : thing;
    };

    function Tipsy(element, options) {
        this.$element = $(element);
        this.options = options;
        this.enabled = true;
        this.fixTitle();
    };

    Tipsy.prototype = {
        show: function() {
            var title = this.getTitle();
            if (title && this.enabled) {
                var $tip = this.tip();

                $tip.find('.tipsy-inner')[this.options.html ? 'html' : 'text'](title);
                $tip[0].className = 'tipsy'; // reset classname in case of dynamic gravity
                $tip.remove().css({top: 0, left: 0, visibility: 'hidden', display: 'block'}).prependTo(document.body);

                var pos = $.extend({}, this.$element.offset(), {
                    width: this.$element[0].offsetWidth,
                    height: this.$element[0].offsetHeight
                });

                var actualWidth = $tip[0].offsetWidth,
                    actualHeight = $tip[0].offsetHeight,
                    gravity = maybeCall(this.options.gravity, this.$element[0]);

                var tp;
                switch (gravity.charAt(0)) {
                    case 'n':
                        tp = {top: pos.top + pos.height + this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 's':
                        tp = {top: pos.top - actualHeight - this.options.offset, left: pos.left + pos.width / 2 - actualWidth / 2};
                        break;
                    case 'e':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth - this.options.offset};
                        break;
                    case 'w':
                        tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width + this.options.offset};
                        break;
                }

                if (gravity.length == 2) {
                    if (gravity.charAt(1) == 'w') {
                        tp.left = pos.left + pos.width / 2 - 15;
                    } else {
                        tp.left = pos.left + pos.width / 2 - actualWidth + 15;
                    }
                }

                $tip.css(tp).addClass('tipsy-' + gravity);
                $tip.find('.tipsy-arrow')[0].className = 'tipsy-arrow tipsy-arrow-' + gravity.charAt(0);
                if (this.options.className) {
                    $tip.addClass(maybeCall(this.options.className, this.$element[0]));
                }

                if (this.options.fade) {
                    $tip.stop().css({opacity: 0, display: 'block', visibility: 'visible'}).animate({opacity: this.options.opacity});
                } else {
                    $tip.css({visibility: 'visible', opacity: this.options.opacity});
                }
            }
        },

        hide: function() {
            if (this.options.fade) {
                this.tip().stop().fadeOut(function() { $(this).remove(); });
            } else {
                this.tip().remove();
            }
        },

        fixTitle: function() {
            var $e = this.$element;
            if ($e.attr('title') || typeof($e.attr('original-title')) != 'string') {
                $e.attr('original-title', $e.attr('title') || '').removeAttr('title');
            }
        },

        getTitle: function() {
            var title, $e = this.$element, o = this.options;
            this.fixTitle();
            var title, o = this.options;
            if (typeof o.title == 'string') {
                title = $e.attr(o.title == 'title' ? 'original-title' : o.title);
            } else if (typeof o.title == 'function') {
                title = o.title.call($e[0]);
            }
            title = ('' + title).replace(/(^\s*|\s*$)/, "");
            return title || o.fallback;
        },

        tip: function() {
            if (!this.$tip) {
                this.$tip = $('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');
            }
            return this.$tip;
        },

        validate: function() {
            if (!this.$element[0].parentNode) {
                this.hide();
                this.$element = null;
                this.options = null;
            }
        },

        enable: function() { this.enabled = true; },
        disable: function() { this.enabled = false; },
        toggleEnabled: function() { this.enabled = !this.enabled; }
    };

    $.fn.tipsy = function(options) {

        if (options === true) {
            return this.data('tipsy');
        } else if (typeof options == 'string') {
            var tipsy = this.data('tipsy');
            if (tipsy) tipsy[options]();
            return this;
        }

        options = $.extend({}, $.fn.tipsy.defaults, options);

        function get(ele) {
            var tipsy = $.data(ele, 'tipsy');
            if (!tipsy) {
                tipsy = new Tipsy(ele, $.fn.tipsy.elementOptions(ele, options));
                $.data(ele, 'tipsy', tipsy);
            }
            return tipsy;
        }

        function enter() {
            var tipsy = get(this);
            tipsy.hoverState = 'in';
            if (options.delayIn == 0) {
                tipsy.show();
            } else {
                tipsy.fixTitle();
                setTimeout(function() { if (tipsy.hoverState == 'in') tipsy.show(); }, options.delayIn);
            }
        };

        function leave() {
            var tipsy = get(this);
            tipsy.hoverState = 'out';
            if (options.delayOut == 0) {
                tipsy.hide();
            } else {
                setTimeout(function() { if (tipsy.hoverState == 'out') tipsy.hide(); }, options.delayOut);
            }
        };

        if (!options.live) this.each(function() { get(this); });

        if (options.trigger != 'manual') {
            var binder   = options.live ? 'live' : 'bind',
                eventIn  = options.trigger == 'hover' ? 'mouseenter' : 'focus',
                eventOut = options.trigger == 'hover' ? 'mouseleave' : 'blur';
            this[binder](eventIn, enter)[binder](eventOut, leave);
        }

        return this;

    };

    $.fn.tipsy.defaults = {
        className: null,
        delayIn: 0,
        delayOut: 0,
        fade: false,
        fallback: '',
        gravity: 'n',
        html: false,
        live: false,
        offset: 0,
        opacity: 0.8,
        title: 'title',
        trigger: 'hover'
    };

    // Overwrite this method to provide options on a per-element basis.
    // For example, you could store the gravity in a 'tipsy-gravity' attribute:
    // return $.extend({}, options, {gravity: $(ele).attr('tipsy-gravity') || 'n' });
    // (remember - do not modify 'options' in place!)
    $.fn.tipsy.elementOptions = function(ele, options) {
        return $.metadata ? $.extend({}, options, $(ele).metadata()) : options;
    };

    $.fn.tipsy.autoNS = function() {
        return $(this).offset().top > ($(document).scrollTop() + $(window).height() / 2) ? 's' : 'n';
    };

    $.fn.tipsy.autoWE = function() {
        return $(this).offset().left > ($(document).scrollLeft() + $(window).width() / 2) ? 'e' : 'w';
    };

    /**
     * yields a closure of the supplied parameters, producing a function that takes
     * no arguments and is suitable for use as an autogravity function like so:
     *
     * @param margin (int) - distance from the viewable region edge that an
     *        element should be before setting its tooltip's gravity to be away
     *        from that edge.
     * @param prefer (string, e.g. 'n', 'sw', 'w') - the direction to prefer
     *        if there are no viewable region edges effecting the tooltip's
     *        gravity. It will try to vary from this minimally, for example,
     *        if 'sw' is preferred and an element is near the right viewable
     *        region edge, but not the top edge, it will set the gravity for
     *        that element's tooltip to be 'se', preserving the southern
     *        component.
     */
     $.fn.tipsy.autoBounds = function(margin, prefer) {
        return function() {
            var dir = {ns: prefer[0], ew: (prefer.length > 1 ? prefer[1] : false)},
                boundTop = $(document).scrollTop() + margin,
                boundLeft = $(document).scrollLeft() + margin,
                $this = $(this);

            if ($this.offset().top < boundTop) dir.ns = 'n';
            if ($this.offset().left < boundLeft) dir.ew = 'w';
            if ($(window).width() + $(document).scrollLeft() - $this.offset().left < margin) dir.ew = 'e';
            if ($(window).height() + $(document).scrollTop() - $this.offset().top < margin) dir.ns = 's';

            return dir.ns + (dir.ew ? dir.ew : '');
        }
    };

})(jQuery);



/***************************************
*
*	Javascript Textile->HTML conversion
*
*	ben@ben-daglish.net (with thanks to John Hughes for improvements)
*   Issued under the "do what you like with it - I take no respnsibility" licence
*
****************************************/
var inpr,inbq,inbqq,html;var aliases=new Array;var alg={'>':'right','<':'left','=':'center','<>':'justify','~':'bottom','^':'top'};var ent={"'":"&#8217;"," - ":" &#8211; ","--":"&#8212;"," x ":" &#215; ","\\.\\.\\.":"&#8230;","\\(C\\)":"&#169;","\\(R\\)":"&#174;","\\(TM\\)":"&#8482;"};var tags={"b":"\\*\\*","i":"__","em":"_","strong":"\\*","cite":"\\?\\?","sup":"\\^","sub":"~","span":"\\%","del":"-","code":"@","ins":"\\+","del":"-"};var le="\n\n";var lstlev=0,lst="",elst="",intable=0,mm="";var para=/^p(\S*)\.\s*(.*)/;var rfn=/^fn(\d+)\.\s*(.*)/;var bq=/^bq\.(\.)?\s*/;var table=/^table\s*{(.*)}\..*/;var trstyle=/^\{(\S+)\}\.\s*\|/;function textile(t){var lines=t.split(/\r?\n/);html="";inpr=inbq=inbqq=0;for(var i=0;i<lines.length;i++){if(lines[i].indexOf("[")==0){var m=lines[i].indexOf("]");aliases[lines[i].substring(1,m)]=lines[i].substring(m+1)}}for(i=0;i<lines.length;i++){if(lines[i].indexOf("[")==0){continue}if(mm=para.exec(lines[i])){stp(1);inpr=1;html+=lines[i].replace(para,"<p"+make_attr(mm[1])+">"+prep(mm[2]));continue}if(mm=/^h(\d)(\S*)\.\s*(.*)/.exec(lines[i])){stp(1);html+=tag("h"+mm[1],make_attr(mm[2]),prep(mm[3]))+le;continue}if(mm=rfn.exec(lines[i])){stp(1);inpr=1;html+=lines[i].replace(rfn,'<p id="fn'+mm[1]+'"><sup>'+mm[1]+'<\/sup>'+prep(mm[2]));continue}if(lines[i].indexOf("*")==0){lst="<ul>";elst="<\/ul>"}else if(lines[i].indexOf("#")==0){lst="<\ol>";elst="<\/ol>"}else{while(lstlev>0){html+=elst;if(lstlev>1){html+="<\/li>"}else{html+="\n"}html+="\n";lstlev--}lst=""}if(lst){stp(1);var m=/^([*#]+)\s*(.*)/.exec(lines[i]);var lev=m[1].length;while(lev<lstlev){html+=elst+"<\/li>\n";lstlev--}while(lstlev<lev){html=html.replace(/<\/li>\n$/,"\n");html+=lst;lstlev++}html+=tag("li","",prep(m[2]))+"\n";continue}if(lines[i].match(table)){stp(1);intable=1;html+=lines[i].replace(table,'<table style="$1;">\n');continue}if((lines[i].indexOf("|")==0)||(lines[i].match(trstyle))){stp(1);if(!intable){html+="<table>\n";intable=1}var rowst="";var trow="";var ts=trstyle.exec(lines[i]);if(ts){rowst=qat('style',ts[1]);lines[i]=lines[i].replace(trstyle,"\|")}var cells=lines[i].split("|");for(j=1;j<cells.length-1;j++){var ttag="td";if(cells[j].indexOf("_.")==0){ttag="th";cells[j]=cells[j].substring(2)}cells[j]=prep(cells[j]);var al=/^([<>=^~\/\\\{]+.*?)\.(.*)/.exec(cells[j]);var at="",st="";if(al!=null){cells[j]=al[2];var cs=/\\(\d+)/.exec(al[1]);if(cs!=null){at+=qat('colspan',cs[1])}var rs=/\/(\d+)/.exec(al[1]);if(rs!=null){at+=qat('rowspan',rs[1])}var va=/([\^~])/.exec(al[1]);if(va!=null){st+="vertical-align:"+alg[va[1]]+";"}var ta=/(<>|=|<|>)/.exec(al[1]);if(ta!=null){st+="text-align:"+alg[ta[1]]+";"}var is=/\{([^\}]+)\}/.exec(al[1]);if(is!=null){st+=is[1]}if(st!=""){at+=qat('style',st)}}trow+=tag(ttag,at,cells[j])}html+="\t"+tag("tr",rowst,trow)+"\n";continue}if(intable){html+="<\/table>"+le;intable=0}if(lines[i]==""){stp()}else if(!inpr){if(mm=bq.exec(lines[i])){lines[i]=lines[i].replace(bq,"");html+="<blockquote>";inbq=1;if(mm[1]){inbqq=1}}html+="<p>"+prep(lines[i]);inpr=1}else{html+=prep(lines[i])}}stp();return html}function prep(m){for(i in ent){m=m.replace(new RegExp(i,"g"),ent[i])}for(i in tags){m=make_tag(m,RegExp("^"+tags[i]+"(.+?)"+tags[i]),i,"");m=make_tag(m,RegExp(" "+tags[i]+"(.+?)"+tags[i]),i," ")}m=m.replace(/\[(\d+)\]/g,'<sup><a href="#fn$1">$1<\/a><\/sup>');m=m.replace(/([A-Z]+)\((.*?)\)/g,'<acronym title="$2">$1<\/acronym>');m=m.replace(/\"([^\"]+)\":((http|https|mailto):\S+)/g,'<a href="$2">$1<\/a>');m=make_image(m,/!([^!\s]+)!:(\S+)/);m=make_image(m,/!([^!\s]+)!/);m=m.replace(/"([^\"]+)":(\S+)/g,function($0,$1,$2){return tag("a",qat('href',aliases[$2]),$1)});m=m.replace(/(=)?"([^\"]+)"/g,function($0,$1,$2){return($1)?$0:"&#8220;"+$2+"&#8221;"});return m}function make_tag(s,re,t,sp){while(m=re.exec(s)){var st=make_attr(m[1]);m[1]=m[1].replace(/^[\[\{\(]\S+[\]\}\)]/g,"");m[1]=m[1].replace(/^[<>=()]+/,"");s=s.replace(re,sp+tag(t,st,m[1]))}return s}function make_image(m,re){var ma=re.exec(m);if(ma!=null){var attr="";var st="";var at=/\((.*)\)$/.exec(ma[1]);if(at!=null){attr=qat('alt',at[1])+qat("title",at[1]);ma[1]=ma[1].replace(/\((.*)\)$/,"")}if(ma[1].match(/^[><]/)){st="float:"+((ma[1].indexOf(">")==0)?"right;":"left;");ma[1]=ma[1].replace(/^[><]/,"")}var pdl=/(\(+)/.exec(ma[1]);if(pdl){st+="padding-left:"+pdl[1].length+"em;"}var pdr=/(\)+)/.exec(ma[1]);if(pdr){st+="padding-right:"+pdr[1].length+"em;"}if(st){attr+=qat('style',st)}var im='<img src="'+ma[1]+'"'+attr+" />";if(ma.length>2){im=tag('a',qat('href',ma[2]),im)}m=m.replace(re,im)}return m}function make_attr(s){var st="";var at="";if(!s){return""}var l=/\[(\w\w)\]/.exec(s);if(l!=null){at+=qat('lang',l[1])}var ci=/\((\S+)\)/.exec(s);if(ci!=null){s=s.replace(/\((\S+)\)/,"");at+=ci[1].replace(/#(.*)$/,' id="$1"').replace(/^(\S+)/,' class="$1"')}var ta=/(<>|=|<|>)/.exec(s);if(ta){st+="text-align:"+alg[ta[1]]+";"}var ss=/\{(\S+)\}/.exec(s);if(ss){st+=ss[1];if(!ss[1].match(/;$/)){st+=";"}}var pdl=/(\(+)/.exec(s);if(pdl){st+="padding-left:"+pdl[1].length+"em;"}var pdr=/(\)+)/.exec(s);if(pdr){st+="padding-right:"+pdr[1].length+"em;"}if(st){at+=qat('style',st)}return at}function qat(a,v){return' '+a+'="'+v+'"'}function tag(t,a,c){return"<"+t+a+">"+c+"</"+t+">"}function stp(b){if(b){inbqq=0}if(inpr){html+="<\/p>"+le;inpr=0}if(inbq&&!inbqq){html+="<\/blockquote>"+le;inbq=0}}



//
// showdown.js -- A javascript port of Markdown.
//
// Copyright (c) 2007 John Fraser.
//
// Original Markdown Copyright (c) 2004-2005 John Gruber
//   <http://daringfireball.net/projects/markdown/>
//
// Redistributable under a BSD-style open source license.
// See license.txt for more information.
//
// The full source distribution is at:
//   <http://www.attacklab.net/>
//
//
// Showdown namespace
//
var Showdown = {};

//
// converter
//
// Wraps all "globals" so that the only thing
// exposed is makeHtml().
//
Showdown.converter = function() {

//
// Globals:
//

// Global hashes, used by various utility routines
var g_urls;
var g_titles;
var g_html_blocks;

// Used to track when we're inside an ordered or unordered list
// (see _ProcessListItems() for details):
var g_list_level = 0;


this.makeHtml = function(text) {
//
// Main function. The order in which other subs are called here is
// essential. Link and image substitutions need to happen before
// _EscapeSpecialCharsWithinTagAttributes(), so that any *'s or _'s in the <a>
// and <img> tags get encoded.
//

    // Clear the global hashes. If we don't clear these, you get conflicts
    // from other articles when generating a page which contains more than
    // one article (e.g. an index page that shows the N most recent
    // articles):
    g_urls = new Array();
    g_titles = new Array();
    g_html_blocks = new Array();

    // attacklab: Replace ~ with ~T
    // This lets us use tilde as an escape char to avoid md5 hashes
    // The choice of character is arbitray; anything that isn't
    // magic in Markdown will work.
    text = text.replace(/~/g,"~T");

    // attacklab: Replace $ with ~D
    // RegExp interprets $ as a special character
    // when it's in a replacement string
    text = text.replace(/\$/g,"~D");

    // Standardize line endings
    text = text.replace(/\r\n/g,"\n"); // DOS to Unix
    text = text.replace(/\r/g,"\n"); // Mac to Unix

    // Make sure text begins and ends with a couple of newlines:
    text = "\n\n" + text + "\n\n";

    // Convert all tabs to spaces.
    text = _Detab(text);

    // Strip any lines consisting only of spaces and tabs.
    // This makes subsequent regexen easier to write, because we can
    // match consecutive blank lines with /\n+/ instead of something
    // contorted like /[ \t]*\n+/ .
    text = text.replace(/^[ \t]+$/mg,"");

    // Turn block-level HTML blocks into hash entries
    text = _HashHTMLBlocks(text);

    // Strip link definitions, store in hashes.
    text = _StripLinkDefinitions(text);

    text = _RunBlockGamut(text);

    text = _UnescapeSpecialChars(text);

    // attacklab: Restore dollar signs
    text = text.replace(/~D/g,"$$");

    // attacklab: Restore tildes
    text = text.replace(/~T/g,"~");

    return text;
}


var _StripLinkDefinitions = function(text) {
//
// Strips link definitions from text, stores the URLs and titles in
// hash references.
//

    // Link defs are in the form: ^[id]: url "optional title"

    /*
        var text = text.replace(/
                ^[ ]{0,3}\[(.+)\]:  // id = $1  attacklab: g_tab_width - 1
                  [ \t]*
                  \n?                // maybe *one* newline
                  [ \t]*
                <?(\S+?)>?            // url = $2
                  [ \t]*
                  \n?                // maybe one newline
                  [ \t]*
                (?:
                  (\n*)                // any lines skipped = $3 attacklab: lookbehind removed
                  ["(]
                  (.+?)                // title = $4
                  [")]
                  [ \t]*
                )?                    // title is optional
                (?:\n+|$)
              /gm,
              function(){...});
    */
    var text = text.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|\Z)/gm,
        function (wholeMatch,m1,m2,m3,m4) {
            m1 = m1.toLowerCase();
            g_urls[m1] = _EncodeAmpsAndAngles(m2);  // Link IDs are case-insensitive
            if (m3) {
                // Oops, found blank lines, so it's not a title.
                // Put back the parenthetical statement we stole.
                return m3+m4;
            } else if (m4) {
                g_titles[m1] = m4.replace(/"/g,"&quot;");
            }

            // Completely remove the definition from the text
            return "";
        }
    );

    return text;
}


var _HashHTMLBlocks = function(text) {
    // attacklab: Double up blank lines to reduce lookaround
    text = text.replace(/\n/g,"\n\n");

    // Hashify HTML blocks:
    // We only want to do this for block-level HTML tags, such as headers,
    // lists, and tables. That's because we still want to wrap <p>s around
    // "paragraphs" that are wrapped in non-block-level tags, such as anchors,
    // phrase emphasis, and spans. The list of tags we're looking for is
    // hard-coded:
    var block_tags_a = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del"
    var block_tags_b = "p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math"

    // First, look for nested blocks, e.g.:
    //   <div>
    //     <div>
    //     tags for inner block must be indented.
    //     </div>
    //   </div>
    //
    // The outermost tags must start at the left margin for this to match, and
    // the inner nested divs must be indented.
    // We need to do this before the next, more liberal match, because the next
    // match will start at the first `<div>` and stop at the first `</div>`.

    // attacklab: This regex can be expensive when it fails.
    /*
        var text = text.replace(/
        (                        // save in $1
            ^                    // start of line  (with /m)
            <($block_tags_a)    // start tag = $2
            \b                    // word break
                                // attacklab: hack around khtml/pcre bug...
            [^\r]*?\n            // any number of lines, minimally matching
            </\2>                // the matching end tag
            [ \t]*                // trailing spaces/tabs
            (?=\n+)                // followed by a newline
        )                        // attacklab: there are sentinel newlines at end of document
        /gm,function(){...}};
    */
    text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,hashElement);

    //
    // Now match more liberally, simply from `\n<tag>` to `</tag>\n`
    //

    /*
        var text = text.replace(/
        (                        // save in $1
            ^                    // start of line  (with /m)
            <($block_tags_b)    // start tag = $2
            \b                    // word break
                                // attacklab: hack around khtml/pcre bug...
            [^\r]*?                // any number of lines, minimally matching
            .*</\2>                // the matching end tag
            [ \t]*                // trailing spaces/tabs
            (?=\n+)                // followed by a newline
        )                        // attacklab: there are sentinel newlines at end of document
        /gm,function(){...}};
    */
    text = text.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm,hashElement);

    // Special case just for <hr />. It was easier to make a special case than
    // to make the other regex more complicated.

    /*
        text = text.replace(/
        (                        // save in $1
            \n\n                // Starting after a blank line
            [ ]{0,3}
            (<(hr)                // start tag = $2
            \b                    // word break
            ([^<>])*?            //
            \/?>)                // the matching end tag
            [ \t]*
            (?=\n{2,})            // followed by a blank line
        )
        /g,hashElement);
    */
    text = text.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,hashElement);

    // Special case for standalone HTML comments:

    /*
        text = text.replace(/
        (                        // save in $1
            \n\n                // Starting after a blank line
            [ ]{0,3}            // attacklab: g_tab_width - 1
            <!
            (--[^\r]*?--\s*)+
            >
            [ \t]*
            (?=\n{2,})            // followed by a blank line
        )
        /g,hashElement);
    */
    text = text.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,hashElement);

    // PHP and ASP-style processor instructions (<?...?> and <%...%>)

    /*
        text = text.replace(/
        (?:
            \n\n                // Starting after a blank line
        )
        (                        // save in $1
            [ ]{0,3}            // attacklab: g_tab_width - 1
            (?:
                <([?%])            // $2
                [^\r]*?
                \2>
            )
            [ \t]*
            (?=\n{2,})            // followed by a blank line
        )
        /g,hashElement);
    */
    text = text.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,hashElement);

    // attacklab: Undo double lines (see comment at top of this function)
    text = text.replace(/\n\n/g,"\n");
    return text;
}

var hashElement = function(wholeMatch,m1) {
    var blockText = m1;

    // Undo double lines
    blockText = blockText.replace(/\n\n/g,"\n");
    blockText = blockText.replace(/^\n/,"");

    // strip trailing blank lines
    blockText = blockText.replace(/\n+$/g,"");

    // Replace the element text with a marker ("~KxK" where x is its key)
    blockText = "\n\n~K" + (g_html_blocks.push(blockText)-1) + "K\n\n";

    return blockText;
};

var _RunBlockGamut = function(text) {
//
// These are all the transformations that form block-level
// tags like paragraphs, headers, and list items.
//
    text = _DoHeaders(text);

    // Do Horizontal Rules:
    var key = hashBlock("<hr />");
    text = text.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,key);
    text = text.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm,key);
    text = text.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm,key);

    text = _DoLists(text);
    text = _DoCodeBlocks(text);
    text = _DoBlockQuotes(text);

    // We already ran _HashHTMLBlocks() before, in Markdown(), but that
    // was to escape raw HTML in the original Markdown source. This time,
    // we're escaping the markup we've just created, so that we don't wrap
    // <p> tags around block-level tags.
    text = _HashHTMLBlocks(text);
    text = _FormParagraphs(text);

    return text;
}


var _RunSpanGamut = function(text) {
//
// These are all the transformations that occur *within* block-level
// tags like paragraphs, headers, and list items.
//

    text = _DoCodeSpans(text);
    text = _EscapeSpecialCharsWithinTagAttributes(text);
    text = _EncodeBackslashEscapes(text);

    // Process anchor and image tags. Images must come first,
    // because ![foo][f] looks like an anchor.
    text = _DoImages(text);
    text = _DoAnchors(text);

    // Make links out of things like `<http://example.com/>`
    // Must come after _DoAnchors(), because you can use < and >
    // delimiters in inline links like [this](<url>).
    text = _DoAutoLinks(text);
    text = _EncodeAmpsAndAngles(text);
    text = _DoItalicsAndBold(text);

    // Do hard breaks:
    text = text.replace(/  +\n/g," <br />\n");

    return text;
}

var _EscapeSpecialCharsWithinTagAttributes = function(text) {
//
// Within tags -- meaning between < and > -- encode [\ ` * _] so they
// don't conflict with their use in Markdown for code, italics and strong.
//

    // Build a regex to find HTML tags and comments.  See Friedl's
    // "Mastering Regular Expressions", 2nd Ed., pp. 200-201.
    var regex = /(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;

    text = text.replace(regex, function(wholeMatch) {
        var tag = wholeMatch.replace(/(.)<\/?code>(?=.)/g,"$1`");
        tag = escapeCharacters(tag,"\\`*_");
        return tag;
    });

    return text;
}

var _DoAnchors = function(text) {
//
// Turn Markdown link shortcuts into XHTML <a> tags.
//
    //
    // First, handle reference-style links: [link text] [id]
    //

    /*
        text = text.replace(/
        (                            // wrap whole match in $1
            \[
            (
                (?:
                    \[[^\]]*\]        // allow brackets nested one level
                    |
                    [^\[]            // or anything else
                )*
            )
            \]

            [ ]?                    // one optional space
            (?:\n[ ]*)?                // one optional newline followed by spaces

            \[
            (.*?)                    // id = $3
            \]
        )()()()()                    // pad remaining backreferences
        /g,_DoAnchors_callback);
    */
    text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,writeAnchorTag);

    //
    // Next, inline-style links: [link text](url "optional title")
    //

    /*
        text = text.replace(/
            (                        // wrap whole match in $1
                \[
                (
                    (?:
                        \[[^\]]*\]    // allow brackets nested one level
                    |
                    [^\[\]]            // or anything else
                )
            )
            \]
            \(                        // literal paren
            [ \t]*
            ()                        // no id, so leave $3 empty
            <?(.*?)>?                // href = $4
            [ \t]*
            (                        // $5
                (['"])                // quote char = $6
                (.*?)                // Title = $7
                \6                    // matching quote
                [ \t]*                // ignore any spaces/tabs between closing quote and )
            )?                        // title is optional
            \)
        )
        /g,writeAnchorTag);
    */
    text = text.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,writeAnchorTag);

    //
    // Last, handle reference-style shortcuts: [link text]
    // These must come last in case you've also got [link test][1]
    // or [link test](/foo)
    //

    /*
        text = text.replace(/
        (                             // wrap whole match in $1
            \[
            ([^\[\]]+)                // link text = $2; can't contain '[' or ']'
            \]
        )()()()()()                    // pad rest of backreferences
        /g, writeAnchorTag);
    */
    text = text.replace(/(\[([^\[\]]+)\])()()()()()/g, writeAnchorTag);

    return text;
}

var writeAnchorTag = function(wholeMatch,m1,m2,m3,m4,m5,m6,m7) {
    if (m7 == undefined) m7 = "";
    var whole_match = m1;
    var link_text   = m2;
    var link_id     = m3.toLowerCase();
    var url        = m4;
    var title    = m7;

    if (url == "") {
        if (link_id == "") {
            // lower-case and turn embedded newlines into spaces
            link_id = link_text.toLowerCase().replace(/ ?\n/g," ");
        }
        url = "#"+link_id;

        if (g_urls[link_id] != undefined) {
            url = g_urls[link_id];
            if (g_titles[link_id] != undefined) {
                title = g_titles[link_id];
            }
        }
        else {
            if (whole_match.search(/\(\s*\)$/m)>-1) {
                // Special case for explicit empty url
                url = "";
            } else {
                return whole_match;
            }
        }
    }

    url = escapeCharacters(url,"*_");
    var result = "<a href=\"" + url + "\"";

    if (title != "") {
        title = title.replace(/"/g,"&quot;");
        title = escapeCharacters(title,"*_");
        result +=  " title=\"" + title + "\"";
    }

    result += ">" + link_text + "</a>";

    return result;
}


var _DoImages = function(text) {
//
// Turn Markdown image shortcuts into <img> tags.
//

    //
    // First, handle reference-style labeled images: ![alt text][id]
    //

    /*
        text = text.replace(/
        (                        // wrap whole match in $1
            !\[
            (.*?)                // alt text = $2
            \]

            [ ]?                // one optional space
            (?:\n[ ]*)?            // one optional newline followed by spaces

            \[
            (.*?)                // id = $3
            \]
        )()()()()                // pad rest of backreferences
        /g,writeImageTag);
    */
    text = text.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,writeImageTag);

    //
    // Next, handle inline images:  ![alt text](url "optional title")
    // Don't forget: encode * and _

    /*
        text = text.replace(/
        (                        // wrap whole match in $1
            !\[
            (.*?)                // alt text = $2
            \]
            \s?                    // One optional whitespace character
            \(                    // literal paren
            [ \t]*
            ()                    // no id, so leave $3 empty
            <?(\S+?)>?            // src url = $4
            [ \t]*
            (                    // $5
                (['"])            // quote char = $6
                (.*?)            // title = $7
                \6                // matching quote
                [ \t]*
            )?                    // title is optional
        \)
        )
        /g,writeImageTag);
    */
    text = text.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,writeImageTag);

    return text;
}

var writeImageTag = function(wholeMatch,m1,m2,m3,m4,m5,m6,m7) {
    var whole_match = m1;
    var alt_text   = m2;
    var link_id     = m3.toLowerCase();
    var url        = m4;
    var title    = m7;

    if (!title) title = "";

    if (url == "") {
        if (link_id == "") {
            // lower-case and turn embedded newlines into spaces
            link_id = alt_text.toLowerCase().replace(/ ?\n/g," ");
        }
        url = "#"+link_id;

        if (g_urls[link_id] != undefined) {
            url = g_urls[link_id];
            if (g_titles[link_id] != undefined) {
                title = g_titles[link_id];
            }
        }
        else {
            return whole_match;
        }
    }

    alt_text = alt_text.replace(/"/g,"&quot;");
    url = escapeCharacters(url,"*_");
    var result = "<img src=\"" + url + "\" alt=\"" + alt_text + "\"";

    // attacklab: Markdown.pl adds empty title attributes to images.
    // Replicate this bug.

    //if (title != "") {
        title = title.replace(/"/g,"&quot;");
        title = escapeCharacters(title,"*_");
        result +=  " title=\"" + title + "\"";
    //}

    result += " />";

    return result;
}


var _DoHeaders = function(text) {

    // Setext-style headers:
    //    Header 1
    //    ========
    //
    //    Header 2
    //    --------
    //
    text = text.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,
        function(wholeMatch,m1){return hashBlock("<h1>" + _RunSpanGamut(m1) + "</h1>");});

    text = text.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,
        function(matchFound,m1){return hashBlock("<h2>" + _RunSpanGamut(m1) + "</h2>");});

    // atx-style headers:
    //  # Header 1
    //  ## Header 2
    //  ## Header 2 with closing hashes ##
    //  ...
    //  ###### Header 6
    //

    /*
        text = text.replace(/
            ^(\#{1,6})                // $1 = string of #'s
            [ \t]*
            (.+?)                    // $2 = Header text
            [ \t]*
            \#*                        // optional closing #'s (not counted)
            \n+
        /gm, function() {...});
    */

    text = text.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,
        function(wholeMatch,m1,m2) {
            var h_level = m1.length;
            return hashBlock("<h" + h_level + ">" + _RunSpanGamut(m2) + "</h" + h_level + ">");
        });

    return text;
}

// This declaration keeps Dojo compressor from outputting garbage:
var _ProcessListItems;

var _DoLists = function(text) {
//
// Form HTML ordered (numbered) and unordered (bulleted) lists.
//

    // attacklab: add sentinel to hack around khtml/safari bug:
    // http://bugs.webkit.org/show_bug.cgi?id=11231
    text += "~0";

    // Re-usable pattern to match any entirel ul or ol list:

    /*
        var whole_list = /
        (                                    // $1 = whole list
            (                                // $2
                [ ]{0,3}                    // attacklab: g_tab_width - 1
                ([*+-]|\d+[.])                // $3 = first list item marker
                [ \t]+
            )
            [^\r]+?
            (                                // $4
                ~0                            // sentinel for workaround; should be $
            |
                \n{2,}
                (?=\S)
                (?!                            // Negative lookahead for another list item marker
                    [ \t]*
                    (?:[*+-]|\d+[.])[ \t]+
                )
            )
        )/g
    */
    var whole_list = /^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;

    if (g_list_level) {
        text = text.replace(whole_list,function(wholeMatch,m1,m2) {
            var list = m1;
            var list_type = (m2.search(/[*+-]/g)>-1) ? "ul" : "ol";

            // Turn double returns into triple returns, so that we can make a
            // paragraph for the last item in a list, if necessary:
            list = list.replace(/\n{2,}/g,"\n\n\n");;
            var result = _ProcessListItems(list);

            // Trim any trailing whitespace, to put the closing `</$list_type>`
            // up on the preceding line, to get it past the current stupid
            // HTML block parser. This is a hack to work around the terrible
            // hack that is the HTML block parser.
            result = result.replace(/\s+$/,"");
            result = "<"+list_type+">" + result + "</"+list_type+">\n";
            return result;
        });
    } else {
        whole_list = /(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g;
        text = text.replace(whole_list,function(wholeMatch,m1,m2,m3) {
            var runup = m1;
            var list = m2;

            var list_type = (m3.search(/[*+-]/g)>-1) ? "ul" : "ol";
            // Turn double returns into triple returns, so that we can make a
            // paragraph for the last item in a list, if necessary:
            var list = list.replace(/\n{2,}/g,"\n\n\n");;
            var result = _ProcessListItems(list);
            result = runup + "<"+list_type+">\n" + result + "</"+list_type+">\n";
            return result;
        });
    }

    // attacklab: strip sentinel
    text = text.replace(/~0/,"");

    return text;
}

_ProcessListItems = function(list_str) {
//
//  Process the contents of a single ordered or unordered list, splitting it
//  into individual list items.
//
    // The $g_list_level global keeps track of when we're inside a list.
    // Each time we enter a list, we increment it; when we leave a list,
    // we decrement. If it's zero, we're not in a list anymore.
    //
    // We do this because when we're not inside a list, we want to treat
    // something like this:
    //
    //    I recommend upgrading to version
    //    8. Oops, now this line is treated
    //    as a sub-list.
    //
    // As a single paragraph, despite the fact that the second line starts
    // with a digit-period-space sequence.
    //
    // Whereas when we're inside a list (or sub-list), that line will be
    // treated as the start of a sub-list. What a kludge, huh? This is
    // an aspect of Markdown's syntax that's hard to parse perfectly
    // without resorting to mind-reading. Perhaps the solution is to
    // change the syntax rules such that sub-lists must start with a
    // starting cardinal number; e.g. "1." or "a.".

    g_list_level++;

    // trim trailing blank lines:
    list_str = list_str.replace(/\n{2,}$/,"\n");

    // attacklab: add sentinel to emulate \z
    list_str += "~0";

    /*
        list_str = list_str.replace(/
            (\n)?                            // leading line = $1
            (^[ \t]*)                        // leading whitespace = $2
            ([*+-]|\d+[.]) [ \t]+            // list marker = $3
            ([^\r]+?                        // list item text   = $4
            (\n{1,2}))
            (?= \n* (~0 | \2 ([*+-]|\d+[.]) [ \t]+))
        /gm, function(){...});
    */
    list_str = list_str.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,
        function(wholeMatch,m1,m2,m3,m4){
            var item = m4;
            var leading_line = m1;
            var leading_space = m2;

            if (leading_line || (item.search(/\n{2,}/)>-1)) {
                item = _RunBlockGamut(_Outdent(item));
            }
            else {
                // Recursion for sub-lists:
                item = _DoLists(_Outdent(item));
                item = item.replace(/\n$/,""); // chomp(item)
                item = _RunSpanGamut(item);
            }

            return  "<li>" + item + "</li>\n";
        }
    );

    // attacklab: strip sentinel
    list_str = list_str.replace(/~0/g,"");

    g_list_level--;
    return list_str;
}


var _DoCodeBlocks = function(text) {
//
//  Process Markdown `<pre><code>` blocks.
//

    /*
        text = text.replace(text,
            /(?:\n\n|^)
            (                                // $1 = the code block -- one or more lines, starting with a space/tab
                (?:
                    (?:[ ]{4}|\t)            // Lines must start with a tab or a tab-width of spaces - attacklab: g_tab_width
                    .*\n+
                )+
            )
            (\n*[ ]{0,3}[^ \t\n]|(?=~0))    // attacklab: g_tab_width
        /g,function(){...});
    */

    // attacklab: sentinel workarounds for lack of \A and \Z, safari\khtml bug
    text += "~0";

    text = text.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,
        function(wholeMatch,m1,m2) {
            var codeblock = m1;
            var nextChar = m2;

            codeblock = _EncodeCode( _Outdent(codeblock));
            codeblock = _Detab(codeblock);
            codeblock = codeblock.replace(/^\n+/g,""); // trim leading newlines
            codeblock = codeblock.replace(/\n+$/g,""); // trim trailing whitespace

            codeblock = "<pre><code>" + codeblock + "\n</code></pre>";

            return hashBlock(codeblock) + nextChar;
        }
    );

    // attacklab: strip sentinel
    text = text.replace(/~0/,"");

    return text;
}

var hashBlock = function(text) {
    text = text.replace(/(^\n+|\n+$)/g,"");
    return "\n\n~K" + (g_html_blocks.push(text)-1) + "K\n\n";
}


var _DoCodeSpans = function(text) {
//
//   *  Backtick quotes are used for <code></code> spans.
//
//   *  You can use multiple backticks as the delimiters if you want to
//     include literal backticks in the code span. So, this input:
//
//         Just type ``foo `bar` baz`` at the prompt.
//
//       Will translate to:
//
//         <p>Just type <code>foo `bar` baz</code> at the prompt.</p>
//
//    There's no arbitrary limit to the number of backticks you
//    can use as delimters. If you need three consecutive backticks
//    in your code, use four for delimiters, etc.
//
//  *  You can use spaces to get literal backticks at the edges:
//
//         ... type `` `bar` `` ...
//
//       Turns to:
//
//         ... type <code>`bar`</code> ...
//

    /*
        text = text.replace(/
            (^|[^\\])                    // Character before opening ` can't be a backslash
            (`+)                        // $2 = Opening run of `
            (                            // $3 = The code block
                [^\r]*?
                [^`]                    // attacklab: work around lack of lookbehind
            )
            \2                            // Matching closer
            (?!`)
        /gm, function(){...});
    */

    text = text.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,
        function(wholeMatch,m1,m2,m3,m4) {
            var c = m3;
            c = c.replace(/^([ \t]*)/g,"");    // leading whitespace
            c = c.replace(/[ \t]*$/g,"");    // trailing whitespace
            c = _EncodeCode(c);
            return m1+"<code>"+c+"</code>";
        });

    return text;
}


var _EncodeCode = function(text) {
//
// Encode/escape certain characters inside Markdown code runs.
// The point is that in code, these characters are literals,
// and lose their special Markdown meanings.
//
    // Encode all ampersands; HTML entities are not
    // entities within a Markdown code span.
    text = text.replace(/&/g,"&amp;");

    // Do the angle bracket song and dance:
    text = text.replace(/</g,"&lt;");
    text = text.replace(/>/g,"&gt;");

    // Now, escape characters that are magic in Markdown:
    text = escapeCharacters(text,"\*_{}[]\\",false);

// jj the line above breaks this:
//---

//* Item

//   1. Subitem

//            special char: *
//---

    return text;
}


var _DoItalicsAndBold = function(text) {

    // <strong> must go first:
    text = text.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,
        "<strong>$2</strong>");

    text = text.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g,
        "<em>$2</em>");

    return text;
}


var _DoBlockQuotes = function(text) {

    /*
        text = text.replace(/
        (                                // Wrap whole match in $1
            (
                ^[ \t]*>[ \t]?            // '>' at the start of a line
                .+\n                    // rest of the first line
                (.+\n)*                    // subsequent consecutive lines
                \n*                        // blanks
            )+
        )
        /gm, function(){...});
    */

    text = text.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,
        function(wholeMatch,m1) {
            var bq = m1;

            // attacklab: hack around Konqueror 3.5.4 bug:
            // "----------bug".replace(/^-/g,"") == "bug"

            bq = bq.replace(/^[ \t]*>[ \t]?/gm,"~0");    // trim one level of quoting

            // attacklab: clean up hack
            bq = bq.replace(/~0/g,"");

            bq = bq.replace(/^[ \t]+$/gm,"");        // trim whitespace-only lines
            bq = _RunBlockGamut(bq);                // recurse

            bq = bq.replace(/(^|\n)/g,"$1  ");
            // These leading spaces screw with <pre> content, so we need to fix that:
            bq = bq.replace(
                    /(\s*<pre>[^\r]+?<\/pre>)/gm,
                function(wholeMatch,m1) {
                    var pre = m1;
                    // attacklab: hack around Konqueror 3.5.4 bug:
                    pre = pre.replace(/^  /mg,"~0");
                    pre = pre.replace(/~0/g,"");
                    return pre;
                });

            return hashBlock("<blockquote>\n" + bq + "\n</blockquote>");
        });
    return text;
}


var _FormParagraphs = function(text) {
//
//  Params:
//    $text - string to process with html <p> tags
//

    // Strip leading and trailing lines:
    text = text.replace(/^\n+/g,"");
    text = text.replace(/\n+$/g,"");

    var grafs = text.split(/\n{2,}/g);
    var grafsOut = new Array();

    //
    // Wrap <p> tags.
    //
    var end = grafs.length;
    for (var i=0; i<end; i++) {
        var str = grafs[i];

        // if this is an HTML marker, copy it
        if (str.search(/~K(\d+)K/g) >= 0) {
            grafsOut.push(str);
        }
        else if (str.search(/\S/) >= 0) {
            str = _RunSpanGamut(str);
            str = str.replace(/^([ \t]*)/g,"<p>");
            str += "</p>"
            grafsOut.push(str);
        }

    }

    //
    // Unhashify HTML blocks
    //
    end = grafsOut.length;
    for (var i=0; i<end; i++) {
        // if this is a marker for an html block...
        while (grafsOut[i].search(/~K(\d+)K/) >= 0) {
            var blockText = g_html_blocks[RegExp.$1];
            blockText = blockText.replace(/\$/g,"$$$$"); // Escape any dollar signs
            grafsOut[i] = grafsOut[i].replace(/~K\d+K/,blockText);
        }
    }

    return grafsOut.join("\n\n");
}


var _EncodeAmpsAndAngles = function(text) {
// Smart processing for ampersands and angle brackets that need to be encoded.

    // Ampersand-encoding based entirely on Nat Irons's Amputator MT plugin:
    //   http://bumppo.net/projects/amputator/
    text = text.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;");

    // Encode naked <'s
    text = text.replace(/<(?![a-z\/?\$!])/gi,"&lt;");

    return text;
}


var _EncodeBackslashEscapes = function(text) {
//
//   Parameter:  String.
//   Returns:    The string, with after processing the following backslash
//               escape sequences.
//

    // attacklab: The polite way to do this is with the new
    // escapeCharacters() function:
    //
    //     text = escapeCharacters(text,"\\",true);
    //     text = escapeCharacters(text,"`*_{}[]()>#+-.!",true);
    //
    // ...but we're sidestepping its use of the (slow) RegExp constructor
    // as an optimization for Firefox.  This function gets called a LOT.

    text = text.replace(/\\(\\)/g,escapeCharacters_callback);
    text = text.replace(/\\([`*_{}\[\]()>#+-.!])/g,escapeCharacters_callback);
    return text;
}


var _DoAutoLinks = function(text) {

    text = text.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi,"<a href=\"$1\">$1</a>");

    // Email addresses: <address@domain.foo>

    /*
        text = text.replace(/
            <
            (?:mailto:)?
            (
                [-.\w]+
                \@
                [-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+
            )
            >
        /gi, _DoAutoLinks_callback());
    */
    text = text.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,
        function(wholeMatch,m1) {
            return _EncodeEmailAddress( _UnescapeSpecialChars(m1) );
        }
    );

    return text;
}


var _EncodeEmailAddress = function(addr) {
//
//  Input: an email address, e.g. "foo@example.com"
//
//  Output: the email address as a mailto link, with each character
//    of the address encoded as either a decimal or hex entity, in
//    the hopes of foiling most address harvesting spam bots. E.g.:
//
//    <a href="&#x6D;&#97;&#105;&#108;&#x74;&#111;:&#102;&#111;&#111;&#64;&#101;
//       x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;">&#102;&#111;&#111;
//       &#64;&#101;x&#x61;&#109;&#x70;&#108;&#x65;&#x2E;&#99;&#111;&#109;</a>
//
//  Based on a filter by Matthew Wickline, posted to the BBEdit-Talk
//  mailing list: <http://tinyurl.com/yu7ue>
//

    // attacklab: why can't javascript speak hex?
    function char2hex(ch) {
        var hexDigits = '0123456789ABCDEF';
        var dec = ch.charCodeAt(0);
        return(hexDigits.charAt(dec>>4) + hexDigits.charAt(dec&15));
    }

    var encode = [
        function(ch){return "&#"+ch.charCodeAt(0)+";";},
        function(ch){return "&#x"+char2hex(ch)+";";},
        function(ch){return ch;}
    ];

    addr = "mailto:" + addr;

    addr = addr.replace(/./g, function(ch) {
        if (ch == "@") {
               // this *must* be encoded. I insist.
            ch = encode[Math.floor(Math.random()*2)](ch);
        } else if (ch !=":") {
            // leave ':' alone (to spot mailto: later)
            var r = Math.random();
            // roughly 10% raw, 45% hex, 45% dec
            ch =  (
                    r > .9  ?    encode[2](ch)   :
                    r > .45 ?    encode[1](ch)   :
                                encode[0](ch)
                );
        }
        return ch;
    });

    addr = "<a href=\"" + addr + "\">" + addr + "</a>";
    addr = addr.replace(/">.+:/g,"\">"); // strip the mailto: from the visible part

    return addr;
}


var _UnescapeSpecialChars = function(text) {
//
// Swap back in all the special characters we've hidden.
//
    text = text.replace(/~E(\d+)E/g,
        function(wholeMatch,m1) {
            var charCodeToReplace = parseInt(m1);
            return String.fromCharCode(charCodeToReplace);
        }
    );
    return text;
}


var _Outdent = function(text) {
//
// Remove one level of line-leading tabs or spaces
//

    // attacklab: hack around Konqueror 3.5.4 bug:
    // "----------bug".replace(/^-/g,"") == "bug"

    text = text.replace(/^(\t|[ ]{1,4})/gm,"~0"); // attacklab: g_tab_width

    // attacklab: clean up hack
    text = text.replace(/~0/g,"")

    return text;
}

var _Detab = function(text) {
// attacklab: Detab's completely rewritten for speed.
// In perl we could fix it by anchoring the regexp with \G.
// In javascript we're less fortunate.

    // expand first n-1 tabs
    text = text.replace(/\t(?=\t)/g,"    "); // attacklab: g_tab_width

    // replace the nth with two sentinels
    text = text.replace(/\t/g,"~A~B");

    // use the sentinel to anchor our regex so it doesn't explode
    text = text.replace(/~B(.+?)~A/g,
        function(wholeMatch,m1,m2) {
            var leadingText = m1;
            var numSpaces = 4 - leadingText.length % 4;  // attacklab: g_tab_width

            // there *must* be a better way to do this:
            for (var i=0; i<numSpaces; i++) leadingText+=" ";

            return leadingText;
        }
    );

    // clean up sentinels
    text = text.replace(/~A/g,"    ");  // attacklab: g_tab_width
    text = text.replace(/~B/g,"");

    return text;
}


//
//  attacklab: Utility functions
//


var escapeCharacters = function(text, charsToEscape, afterBackslash) {
    // First we have to escape the escape characters so that
    // we can build a character class out of them
    var regexString = "([" + charsToEscape.replace(/([\[\]\\])/g,"\\$1") + "])";

    if (afterBackslash) {
        regexString = "\\\\" + regexString;
    }

    var regex = new RegExp(regexString,"g");
    text = text.replace(regex,escapeCharacters_callback);

    return text;
}


var escapeCharacters_callback = function(wholeMatch,m1) {
    var charCodeToEscape = m1.charCodeAt(0);
    return "~E"+charCodeToEscape+"E";
}

} // end of Showdown.converter