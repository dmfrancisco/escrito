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
//
//				A A L
//				T C A
//				T K B
//
//   <http://www.attacklab.net/>
//
var Showdown={};typeof exports=="object"&&(Showdown=exports,Showdown.parse=function(a,b){var c=new Showdown.converter;return c.makeHtml(a,b)});var GitHub;Showdown.converter=function(){var a,b,c,d=0;this.makeHtml=function(d,h){typeof h!="undefined"&&(typeof h=="string"&&(h={nameWithOwner:h}),GitHub=h),a=[],b=[],c=[],d=d.replace(/~/g,"~T"),d=d.replace(/\$/g,"~D"),d=d.replace(/\r\n/g,"\n"),d=d.replace(/\r/g,"\n"),d="\n\n"+d+"\n\n",d=F(d),d=d.replace(/^[ \t]+$/mg,""),d=g(d),d=f(d),d=i(d),d=D(d),d=d.replace(/~D/g,"$$"),d=d.replace(/~T/g,"~"),d=d.replace(/https?\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!]/g,function(a,b){var c=d.slice(0,b),e=d.slice(b);if(c.match(/<[^>]+$/)&&e.match(/^[^>]*>/))return a;return"<a href='"+a+"'>"+a+"</a>"}),d=d.replace(/[a-z0-9_\-+=.]+@[a-z0-9\-]+(\.[a-z0-9-]+)+/ig,function(a){return"<a href='mailto:"+a+"'>"+a+"</a>"}),d=d.replace(/[a-f0-9]{40}/ig,function(a,b){if(typeof GitHub=="undefined"||typeof GitHub.nameWithOwner=="undefined")return a;var c=d.slice(0,b),e=d.slice(b);if(c.match(/@$/)||c.match(/<[^>]+$/)&&e.match(/^[^>]*>/))return a;return"<a href='http://github.com/"+GitHub.nameWithOwner+"/commit/"+a+"'>"+a.substring(0,7)+"</a>"}),d=d.replace(/([a-z0-9_\-+=.]+)@([a-f0-9]{40})/ig,function(a,b,c,f){if(typeof GitHub=="undefined"||typeof GitHub.nameWithOwner=="undefined")return a;GitHub.repoName=GitHub.repoName||e();var g=d.slice(0,f),h=d.slice(f);if(g.match(/\/$/)||g.match(/<[^>]+$/)&&h.match(/^[^>]*>/))return a;return"<a href='http://github.com/"+b+"/"+GitHub.repoName+"/commit/"+c+"'>"+b+"@"+c.substring(0,7)+"</a>"}),d=d.replace(/([a-z0-9_\-+=.]+\/[a-z0-9_\-+=.]+)@([a-f0-9]{40})/ig,function(a,b,c){return"<a href='http://github.com/"+b+"/commit/"+c+"'>"+b+"@"+c.substring(0,7)+"</a>"}),d=d.replace(/#([0-9]+)/ig,function(a,b,c){if(typeof GitHub=="undefined"||typeof GitHub.nameWithOwner=="undefined")return a;var e=d.slice(0,c),f=d.slice(c);if(e==""||e.match(/[a-z0-9_\-+=.]$/)||e.match(/<[^>]+$/)&&f.match(/^[^>]*>/))return a;return"<a href='http://github.com/"+GitHub.nameWithOwner+"/issues/#issue/"+b+"'>"+a+"</a>"}),d=d.replace(/([a-z0-9_\-+=.]+)#([0-9]+)/ig,function(a,b,c,f){if(typeof GitHub=="undefined"||typeof GitHub.nameWithOwner=="undefined")return a;GitHub.repoName=GitHub.repoName||e();var g=d.slice(0,f),h=d.slice(f);if(g.match(/\/$/)||g.match(/<[^>]+$/)&&h.match(/^[^>]*>/))return a;return"<a href='http://github.com/"+b+"/"+GitHub.repoName+"/issues/#issue/"+c+"'>"+a+"</a>"}),d=d.replace(/([a-z0-9_\-+=.]+\/[a-z0-9_\-+=.]+)#([0-9]+)/ig,function(a,b,c){return"<a href='http://github.com/"+b+"/issues/#issue/"+c+"'>"+a+"</a>"});return d};var e=function(){return GitHub.nameWithOwner.match(/^.+\/(.+)$/)[1]},f=function(c){var c=c.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|\Z)/gm,function(c,d,e,f,g){d=d.toLowerCase(),a[d]=z(e);if(f)return f+g;g&&(b[d]=g.replace(/"/g,"&quot;"));return""});return c},g=function(a){a=a.replace(/\n/g,"\n\n");var b="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del",c="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math";a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,h),a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm,h),a=a.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,h),a=a.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,h),a=a.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,h),a=a.replace(/\n\n/g,"\n");return a},h=function(a,b){var d=b;d=d.replace(/\n\n/g,"\n"),d=d.replace(/^\n/,""),d=d.replace(/\n+$/g,""),d="\n\n~K"+(c.push(d)-1)+"K\n\n";return d},i=function(a){a=p(a);var b=t("<hr />");a=a.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,b),a=a.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm,b),a=a.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm,b),a=r(a),a=s(a),a=x(a),a=g(a),a=y(a);return a},j=function(a){a=u(a),a=k(a),a=A(a),a=n(a),a=l(a),a=B(a),a=z(a),a=w(a),a=a.replace(/  +\n/g," <br />\n");return a},k=function(a){var b=/(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;a=a.replace(b,function(a){var b=a.replace(/(.)<\/?code>(?=.)/g,"$1`");b=G(b,"\\`*_");return b});return a},l=function(a){a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,m),a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,m),a=a.replace(/(\[([^\[\]]+)\])()()()()()/g,m);return a},m=function(c,d,e,f,g,h,i,j){j==undefined&&(j="");var k=d,l=e,m=f.toLowerCase(),n=g,o=j;if(n==""){m==""&&(m=l.toLowerCase().replace(/ ?\n/g," ")),n="#"+m;if(a[m]!=undefined)n=a[m],b[m]!=undefined&&(o=b[m]);else if(k.search(/\(\s*\)$/m)>-1)n="";else return k}n=G(n,"*_");var p='<a href="'+n+'"';o!=""&&(o=o.replace(/"/g,"&quot;"),o=G(o,"*_"),p+=' title="'+o+'"'),p+=">"+l+"</a>";return p},n=function(a){a=a.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,o),a=a.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,o);return a},o=function(c,d,e,f,g,h,i,j){var k=d,l=e,m=f.toLowerCase(),n=g,o=j;o||(o="");if(n==""){m==""&&(m=l.toLowerCase().replace(/ ?\n/g," ")),n="#"+m;if(a[m]!=undefined)n=a[m],b[m]!=undefined&&(o=b[m]);else return k}l=l.replace(/"/g,"&quot;"),n=G(n,"*_");var p='<img src="'+n+'" alt="'+l+'"';o=o.replace(/"/g,"&quot;"),o=G(o,"*_"),p+=' title="'+o+'"',p+=" />";return p},p=function(a){a=a.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,function(a,b){return t("<h1>"+j(b)+"</h1>")}),a=a.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,function(a,b){return t("<h2>"+j(b)+"</h2>")}),a=a.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,function(a,b,c){var d=b.length;return t("<h"+d+">"+j(c)+"</h"+d+">")});return a},q,r=function(a){a+="~0";var b=/^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;d?a=a.replace(b,function(a,b,c){var d=b,e=c.search(/[*+-]/g)>-1?"ul":"ol";d=d.replace(/\n{2,}/g,"\n\n\n");var f=q(d);f=f.replace(/\s+$/,""),f="<"+e+">"+f+"</"+e+">\n";return f}):(b=/(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g,a=a.replace(b,function(a,b,c,d){var e=b,f=c,g=d.search(/[*+-]/g)>-1?"ul":"ol",f=f.replace(/\n{2,}/g,"\n\n\n"),h=q(f);h=e+"<"+g+">\n"+h+"</"+g+">\n";return h})),a=a.replace(/~0/,"");return a};q=function(a){d++,a=a.replace(/\n{2,}$/,"\n"),a+="~0",a=a.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,function(a,b,c,d,e){var f=e,g=b,h=c;g||f.search(/\n{2,}/)>-1?f=i(E(f)):(f=r(E(f)),f=f.replace(/\n$/,""),f=j(f));return"<li>"+f+"</li>\n"}),a=a.replace(/~0/g,""),d--;return a};var s=function(a){a+="~0",a=a.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,function(a,b,c){var d=b,e=c;d=v(E(d)),d=F(d),d=d.replace(/^\n+/g,""),d=d.replace(/\n+$/g,""),d="<pre><code>"+d+"\n</code></pre>";return t(d)+e}),a=a.replace(/~0/,"");return a},t=function(a){a=a.replace(/(^\n+|\n+$)/g,"");return"\n\n~K"+(c.push(a)-1)+"K\n\n"},u=function(a){a=a.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,function(a,b,c,d,e){var f=d;f=f.replace(/^([ \t]*)/g,""),f=f.replace(/[ \t]*$/g,""),f=v(f);return b+"<code>"+f+"</code>"});return a},v=function(a){a=a.replace(/&/g,"&amp;"),a=a.replace(/</g,"&lt;"),a=a.replace(/>/g,"&gt;"),a=G(a,"*_{}[]\\",!1);return a},w=function(a){a=a.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,"<strong>$2</strong>"),a=a.replace(/(\w)_(\w)/g,"$1~E95E$2"),a=a.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g,"<em>$2</em>");return a},x=function(a){a=a.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,function(a,b){var c=b;c=c.replace(/^[ \t]*>[ \t]?/gm,"~0"),c=c.replace(/~0/g,""),c=c.replace(/^[ \t]+$/gm,""),c=i(c),c=c.replace(/(^|\n)/g,"$1  "),c=c.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm,function(a,b){var c=b;c=c.replace(/^  /mg,"~0"),c=c.replace(/~0/g,"");return c});return t("<blockquote>\n"+c+"\n</blockquote>")});return a},y=function(a){a=a.replace(/^\n+/g,""),a=a.replace(/\n+$/g,"");var b=a.split(/\n{2,}/g),d=[],e=b.length;for(var f=0;f<e;f++){var g=b[f];g.search(/~K(\d+)K/g)>=0?d.push(g):g.search(/\S/)>=0&&(g=j(g),g=g.replace(/\n/g,"<br />"),g=g.replace(/^([ \t]*)/g,"<p>"),g+="</p>",d.push(g))}e=d.length;for(var f=0;f<e;f++)while(d[f].search(/~K(\d+)K/)>=0){var h=c[RegExp.$1];h=h.replace(/\$/g,"$$$$"),d[f]=d[f].replace(/~K\d+K/,h)}return d.join("\n\n")},z=function(a){a=a.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;"),a=a.replace(/<(?![a-z\/?\$!])/gi,"&lt;");return a},A=function(a){a=a.replace(/\\(\\)/g,H),a=a.replace(/\\([`*_{}\[\]()>#+-.!])/g,H);return a},B=function(a){a=a.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi,'<a href="$1">$1</a>'),a=a.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,function(a,b){return C(D(b))});return a},C=function(a){function b(a){var b="0123456789ABCDEF",c=a.charCodeAt(0);return b.charAt(c>>4)+b.charAt(c&15)}var c=[function(a){return"&#"+a.charCodeAt(0)+";"},function(a){return"&#x"+b(a)+";"},function(a){return a}];a="mailto:"+a,a=a.replace(/./g,function(a){if(a=="@")a=c[Math.floor(Math.random()*2)](a);else if(a!=":"){var b=Math.random();a=b>.9?c[2](a):b>.45?c[1](a):c[0](a)}return a}),a='<a href="'+a+'">'+a+"</a>",a=a.replace(/">.+:/g,'">');return a},D=function(a){a=a.replace(/~E(\d+)E/g,function(a,b){var c=parseInt(b);return String.fromCharCode(c)});return a},E=function(a){a=a.replace(/^(\t|[ ]{1,4})/gm,"~0"),a=a.replace(/~0/g,"");return a},F=function(a){a=a.replace(/\t(?=\t)/g,"    "),a=a.replace(/\t/g,"~A~B"),a=a.replace(/~B(.+?)~A/g,function(a,b,c){var d=b,e=4-d.length%4;for(var f=0;f<e;f++)d+=" ";return d}),a=a.replace(/~A/g,"    "),a=a.replace(/~B/g,"");return a},G=function(a,b,c){var d="(["+b.replace(/([\[\]\\])/g,"\\$1")+"])";c&&(d="\\\\"+d);var e=new RegExp(d,"g");a=a.replace(e,H);return a},H=function(a,b){var c=b.charCodeAt(0);return"~E"+c+"E"}}
