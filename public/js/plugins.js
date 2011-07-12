// usage: log('inside coolFunc', this, arguments);
window.log = function(){
    log.history = log.history || []; // store logs to an array for reference
    log.history.push(arguments);
    arguments.callee = arguments.callee.caller;
    if(this.console) console.log( Array.prototype.slice.call(arguments) );
};
// make it safe to use console.log always
(function(b){function c(){}for(var d="assert,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profileEnd,time,timeEnd,trace,warn".split(","),a;a=d.pop();)b[a]=b[a]||c})(window.console=window.console||{});


/* Function that doesn't seem to exist in IE, and Ace was complaining about */
if (!String.prototype.trimRight) {
    /* based on http://blog.stevenlevithan.com/archives/faster-trim-javascript */
    var trimBeginRegexp = /^\s\s*/;
    var trimEndRegexp = /\s\s*$/;
    String.prototype.trimRight = function () {
        return String(this).replace(trimBeginRegexp, '');
    };
}


/*
 * NETEYE Activity Indicator jQuery Plugin
 *
 * Copyright (c) 2010 NETEYE GmbH
 * Licensed under the MIT license
 *
 * Author: Felix Gnass [fgnass at neteye dot de]
 * Version: 1.0.0
 */
(function($){$.fn.activity=function(opts){this.each(function(){var $this=$(this);var el=$this.data("activity");if(el){clearInterval(el.data("interval"));el.remove();$this.removeData("activity");}if(opts!==false){opts=$.extend({color:$this.css("color")},$.fn.activity.defaults,opts);el=render($this,opts).css("position","absolute").prependTo(opts.outside?"body":$this);var h=$this.outerHeight()-el.height();var w=$this.outerWidth()-el.width();var margin={top:opts.valign=="top"?opts.padding:opts.valign=="bottom"?h-opts.padding:Math.floor(h/2),left:opts.align=="left"?opts.padding:opts.align=="right"?w-opts.padding:Math.floor(w/2)};var offset=$this.offset();if(opts.outside){el.css({top:offset.top+"px",left:offset.left+"px"});}else{margin.top-=el.offset().top-offset.top;margin.left-=el.offset().left-offset.left;}el.css({marginTop:margin.top+"px",marginLeft:margin.left+"px"});animate(el,opts.segments,Math.round(10/opts.speed)/10);$this.data("activity",el);}});return this;};$.fn.activity.defaults={segments:12,space:3,length:7,width:4,speed:1.2,align:"center",valign:"center",padding:4};$.fn.activity.getOpacity=function(opts,i){var steps=opts.steps||opts.segments-1;var end=opts.opacity!==undefined?opts.opacity:1/steps;return 1-Math.min(i,steps)*(1-end)/steps;};var render=function(){return $("<div>").addClass("busy");};var animate=function(){};function svg(tag,attr){var el=document.createElementNS("http://www.w3.org/2000/svg",tag||"svg");if(attr){$.each(attr,function(k,v){el.setAttributeNS(null,k,v);});}return $(el);}if(document.createElementNS&&document.createElementNS("http://www.w3.org/2000/svg","svg").createSVGRect){render=function(target,d){var innerRadius=d.width*2+d.space;var r=(innerRadius+d.length+Math.ceil(d.width/2)+1);var el=svg().width(r*2).height(r*2);var g=svg("g",{"stroke-width":d.width,"stroke-linecap":"round",stroke:d.color}).appendTo(svg("g",{transform:"translate("+r+","+r+")"}).appendTo(el));for(var i=0;i<d.segments;i++){g.append(svg("line",{x1:0,y1:innerRadius,x2:0,y2:innerRadius+d.length,transform:"rotate("+(360/d.segments*i)+", 0, 0)",opacity:$.fn.activity.getOpacity(d,i)}));}return $("<div>").append(el).width(2*r).height(2*r);};if(document.createElement("div").style.WebkitAnimationName!==undefined){var animations={};animate=function(el,steps,duration){if(!animations[steps]){var name="spin"+steps;var rule="@-webkit-keyframes "+name+" {";for(var i=0;i<steps;i++){var p1=Math.round(100000/steps*i)/1000;var p2=Math.round(100000/steps*(i+1)-1)/1000;var value="% { -webkit-transform:rotate("+Math.round(360/steps*i)+"deg); }\n";rule+=p1+value+p2+value;}rule+="100% { -webkit-transform:rotate(100deg); }\n}";document.styleSheets[0].insertRule(rule);animations[steps]=name;}el.css("-webkit-animation",animations[steps]+" "+duration+"s linear infinite");};}else{animate=function(el,steps,duration){var rotation=0;var g=el.find("g g").get(0);el.data("interval",setInterval(function(){g.setAttributeNS(null,"transform","rotate("+(++rotation%steps*(360/steps))+")");},duration*1000/steps));};}}else{var s=$("<shape>").css("behavior","url(#default#VML)").appendTo("body");if(s.get(0).adj){var sheet=document.createStyleSheet();$.each(["group","shape","stroke"],function(){sheet.addRule(this,"behavior:url(#default#VML);");});render=function(target,d){var innerRadius=d.width*2+d.space;var r=(innerRadius+d.length+Math.ceil(d.width/2)+1);var s=r*2;var o=-Math.ceil(s/2);var el=$("<group>",{coordsize:s+" "+s,coordorigin:o+" "+o}).css({top:o,left:o,width:s,height:s});for(var i=0;i<d.segments;i++){el.append($("<shape>",{path:"m "+innerRadius+",0  l "+(innerRadius+d.length)+",0"}).css({width:s,height:s,rotation:(360/d.segments*i)+"deg"}).append($("<stroke>",{color:d.color,weight:d.width+"px",endcap:"round",opacity:$.fn.activity.getOpacity(d,i)})));}return $("<group>",{coordsize:s+" "+s}).css({width:s,height:s,overflow:"hidden"}).append(el);};animate=function(el,steps,duration){var rotation=0;var g=el.get(0);el.data("interval",setInterval(function(){g.style.rotation=++rotation%steps*(360/steps);},duration*1000/steps));};}$(s).remove();}})(jQuery);


/* ace behaviour.js */

/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Chris Spencer <chris.ag.spencer AT googlemail DOT com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
define("ace/mode/behaviour",[],function(a,b,c){var d=function(){this.$behaviours={}};(function(){this.add=function(a,b,c){switch(undefined){case this.$behaviours:this.$behaviours={};case this.$behaviours[a]:this.$behaviours[a]={}}this.$behaviours[a][b]=c},this.addBehaviours=function(a){for(var b in a)for(var c in a[b])this.add(b,c,a[b][c])},this.remove=function(a){this.$behaviours&&this.$behaviours[a]&&delete this.$behaviours[a]},this.inherit=function(a,b){if(typeof a=="function")var c=(new a).getBehaviours(b);else var c=a.getBehaviours(b);this.addBehaviours(c)},this.getBehaviours=function(a){if(!a)return this.$behaviours;var b={};for(var c=0;c<a.length;c++)this.$behaviours[a[c]]&&(b[a[c]]=this.$behaviours[a[c]]);return b}}).call(d.prototype),b.Behaviour=d})


/* ace mode-text.js */

/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *      Mihai Sucan <mihai DOT sucan AT gmail DOT com>
 *      Chris Spencer <chris.ag.spencer AT googlemail DOT com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
define("ace/mode/text",["require","exports","module","pilot/oop","ace/tokenizer","ace/mode/behaviour","ace/mode/text_highlight_rules"],function(a,b,c){var d=a("ace/tokenizer").Tokenizer,e=a("ace/mode/text_highlight_rules").TextHighlightRules,f=a("ace/mode/behaviour").Behaviour,g=function(){this.$tokenizer=new d((new e).getRules()),this.$behaviour=new f};(function(){this.getTokenizer=function(){return this.$tokenizer},this.toggleCommentLines=function(a,b,c,d){},this.getNextLineIndent=function(a,b,c){return""},this.checkOutdent=function(a,b,c){return!1},this.autoOutdent=function(a,b,c){},this.$getIndent=function(a){var b=a.match(/^(\s+)/);if(b)return b[1];return""},this.createWorker=function(a){return null},this.highlightSelection=function(a){var b=a.session;b.$selectionOccurrences||(b.$selectionOccurrences=[]),b.$selectionOccurrences.length&&this.clearSelectionHighlight(a);var c=a.getSelectionRange();if(!c.isEmpty()&&!c.isMultiLine()){var d=c.start.column-1,e=c.end.column+1,f=b.getLine(c.start.row),g=f.length,h=f.substring(Math.max(d,0),Math.min(e,g));if(d>=0&&/^[\w\d]/.test(h)||e<=g&&/[\w\d]$/.test(h))return;h=f.substring(c.start.column,c.end.column);if(!/^[\w\d]+$/.test(h))return;var i=a.getCursorPosition(),j={wrap:!0,wholeWord:!0,caseSensitive:!0,needle:h},k=a.$search.getOptions();a.$search.set(j);var l=a.$search.findAll(b);l.forEach(function(a){if(!a.contains(i.row,i.column)){var c=b.addMarker(a,"ace_selected_word");b.$selectionOccurrences.push(c)}}),a.$search.set(k)}},this.clearSelectionHighlight=function(a){!a.session.$selectionOccurrences||(a.session.$selectionOccurrences.forEach(function(b){a.session.removeMarker(b)}),a.session.$selectionOccurrences=[])},this.createModeDelegates=function(a){if(!!this.$embeds){this.$modes={};for(var b=0;b<this.$embeds.length;b++)a[this.$embeds[b]]&&(this.$modes[this.$embeds[b]]=new a[this.$embeds[b]]);var c=["toggleCommentLines","getNextLineIndent","checkOutdent","autoOutdent","transformAction"];for(var b=0;b<c.length;b++)(function(a){var d=c[b],e=a[d];a[c[b]]=function(){return this.$delegator(d,arguments,e)}})(this)}},this.$delegator=function(a,b,c){var d=b[0];for(var e=0;e<this.$embeds.length;e++){if(!this.$modes[this.$embeds[e]])continue;var f=d.split(this.$embeds[e]);if(!f[0]&&f[1]){b[0]=f[1];var g=this.$modes[this.$embeds[e]];return g[a].apply(g,b)}}var h=c.apply(this,b);return c?h:undefined},this.transformAction=function(a,b,c,d,e){if(this.$behaviour){var f=this.$behaviour.getBehaviours();for(var g in f)if(f[g][b]){var h=f[g][b].apply(this,arguments);if(h!==!1)return h}}return!1}}).call(g.prototype),b.Mode=g})
define("ace/mode/text_highlight_rules",["require","exports","module","pilot/oop"],function(a,b,c){var d=a("pilot/lang"),e=function(){this.$rules={start:[{token:"empty_line",regex:"^$"},{token:"text",regex:".+"}]}};(function(){this.addRules=function(a,b){for(var c in a){var d=a[c];for(var e=0;e<d.length;e++){var f=d[e];f.next?f.next=b+f.next:f.next=b+c}this.$rules[b+c]=d}},this.getRules=function(){return this.$rules},this.embedRules=function(a,b,c,e){var f=(new a).getRules();if(e)for(var g=0;g<e.length;g++)e[g]=b+e[g];else{e=[];for(var h in f)e.push(b+h)}this.addRules(f,b);for(var g=0;g<e.length;g++)Array.prototype.unshift.apply(this.$rules[e[g]],d.deepCopy(c));this.$embeds||(this.$embeds=[]),this.$embeds.push(b)},this.getEmbeds=function(){return this.$embeds}}).call(e.prototype),b.TextHighlightRules=e})


/* ace mode-textile.js */

/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Kelley van Evert <kelley.vanevert@gmail.com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
define("ace/mode/textile",["require","exports","module","pilot/oop","ace/mode/text","ace/tokenizer","ace/mode/textile_highlight_rules"],function(a,b,c){var d=a("pilot/oop"),e=a("ace/mode/text").Mode,f=a("ace/tokenizer").Tokenizer,g=a("ace/mode/textile_highlight_rules").TextileHighlightRules,h=a("ace/mode/matching_brace_outdent").MatchingBraceOutdent,i=a("ace/range").Range,j=function(){this.$tokenizer=new f((new g).getRules()),this.$outdent=new h};d.inherits(j,e),function(){this.getNextLineIndent=function(a,b,c){if(a=="intag")return c;return""},this.checkOutdent=function(a,b,c){return this.$outdent.checkOutdent(b,c)},this.autoOutdent=function(a,b,c){this.$outdent.autoOutdent(b,c)}}.call(j.prototype),b.Mode=j}),define("ace/mode/textile_highlight_rules",["require","exports","module","pilot/oop","ace/mode/text_highlight_rules"],function(a,b,c){var d=a("pilot/oop"),e=a("ace/mode/text_highlight_rules").TextHighlightRules,f=function(){this.$rules={start:[{token:"keyword",regex:"h1|h2|h3|h4|h5|h6|bq|p|bc|pre",next:"blocktag"},{token:"keyword",regex:"[\\*]+|[#]+"},{token:"text",regex:".+"}],blocktag:[{token:"keyword",regex:"\\. ",next:"start"},{token:"keyword",regex:"\\(",next:"blocktagproperties"}],blocktagproperties:[{token:"keyword",regex:"\\)",next:"blocktag"},{token:"string",regex:"[a-zA-Z0-9\\-_]+"},{token:"keyword",regex:"#"}]}};d.inherits(f,e),b.TextileHighlightRules=f})


/* ace mode-markdown.js */

/* vim:ts=4:sts=4:sw=4:
 * ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *      Mihai Sucan <mihai DOT sucan AT gmail DOT com>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */
define("ace/mode/markdown",["require","exports","module","pilot/oop","ace/mode/text","ace/tokenizer","ace/mode/markdown_highlight_rules"],function(a,b,c){var d=a("pilot/oop"),e=a("ace/mode/text").Mode,f=a("ace/tokenizer").Tokenizer,g=a("ace/mode/markdown_highlight_rules").MarkdownHighlightRules,h=function(){this.$tokenizer=new f((new g).getRules())};d.inherits(h,e),function(){this.getNextLineIndent=function(a,b,c){var d=this.$getIndent(b);return d}}.call(h.prototype),b.Mode=h}),define("ace/mode/markdown_highlight_rules",["require","exports","module","pilot/oop","ace/mode/text_highlight_rules"],function(a,b,c){var d=a("pilot/oop"),e=a("ace/mode/text_highlight_rules").TextHighlightRules,f=function(a){return{token:a,regex:a}},g=function(){this.$rules={start:[{token:"empty_line",regex:"^$"},{token:"support.function",regex:"`[^\\r]*?[^`]`"},{token:"support.function",regex:"^[ ]{4}.+"},{token:"constant",regex:"^#{1,6}",next:"header"},{token:"text",regex:'^[ ]{0,3}\\[(?=[^\\]]+\\]:\\s*[^ ]+\\s*(?:["][^"]+["])?\\s*$)',next:"reference"},{token:"text",regex:"\\[(?=(?:[[^\\]]*\\]|[^\\[\\]])*\\][ ]?(?:\\n[ ]*)?\\[(?:.*?)\\])",next:"linkref"},{token:"text",regex:'\\[(?=(?:\\[[^\\]]*\\]|[^\\[\\]])*\\]\\([ \\t]*<?(?:(?:[^\\(]*?\\([^\\)]*?\\)\\S*?)|(?:.*?))>?[ \t]*(?:"(.*?)"[ \\t]*)?\\))',next:"linkurl"},{token:"constant",regex:"^[ ]{0,2}(?:[ ]?\\*[ ]?){3,}[ \\t]*$"},{token:"constant",regex:"^[ ]{0,2}(?:[ ]?\\-[ ]?){3,}[ \\t]*$"},{token:"constant",regex:"^[ ]{0,2}(?:[ ]?\\_[ ]?){3,}[ \\t]*$"},{token:"keyword",regex:"[\\%]{2}.+[\\%]{2}"},{token:"keyword",regex:"[\\$]{2}.+[\\$]{2}"},{token:"string",regex:"[*]{2}(?=\\S)(?:[^\\r]*?\\S[*_]*)[*]{2}"},{token:"string",regex:"[*](?=\\S)(?:[^\\r]*?\\S[*_]*)[*]"},{token:"string",regex:"[_]{2}(?=\\S)(?:[^\\r]*?\\S[*_]*)[_]{2}"},{token:"string",regex:"[_](?=\\S)(?:[^\\r]*?\\S[*_]*)[_]"},{token:"text",regex:"[^\\*_%$`\\[#]+"}],linkurl:[{token:"string",regex:"(?:\\[[^\\]]*\\]|[^\\[\\]])+"},{token:"text",regex:"\\]\\([ \\t]*<?",next:"linkurl-mid"}],"linkurl-mid":[{token:"url",regex:"[^\\s\\)]+"},{token:"string",regex:'\\s*["][^"]+["]',next:"linkurl-end"},{token:"text",regex:"\\s*\\)",next:"start"},{token:"text",regex:".",next:"start"}],"linkurl-end":[{token:"text",regex:"\\s*\\)",next:"start"}],linkref:[{token:"string",regex:"[^\\]]+",next:"linkref-mid"}],"linkref-mid":[{token:"text",regex:"\\][ ]?(?:\\n[ ]*)?\\["},{token:"constant",regex:"[^\\]]+"},{token:"text",regex:"\\]",next:"start"}],header:[{token:"keyword",regex:".+$",next:"start"},{token:"text",regex:".",next:"start"}],reference:[{token:"constant",regex:"[^\\]]+",next:"reflink"},{token:"text",regex:".",next:"start"}],reflink:[{token:"text",regex:"\\]:\\s*"},{token:"url",regex:"[^ ]+$",next:"start"},{token:"url",regex:"[^ ]+"},{token:"string",regex:'\\s*["][^"]+["]\\s*$',next:"start"},{token:"text",regex:"\\s*$",next:"start"}]}};d.inherits(g,e),b.MarkdownHighlightRules=g})

/* theme-escrito.js */

define("ace/theme/escrito",["require","exports","module"],function(require,exports,module){var dom=require("pilot/dom");var cssText="";dom.importCssString(cssText);exports.cssClass="ace-escrito";});



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
(function(jQuery){jQuery.hotkeys={version:"0.8",specialKeys:{8:"backspace",9:"tab",13:"return",16:"shift",17:"ctrl",18:"alt",19:"pause",20:"capslock",27:"esc",32:"space",33:"pageup",34:"pagedown",35:"end",36:"home",37:"left",38:"up",39:"right",40:"down",45:"insert",46:"del",96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9",106:"*",107:"+",109:"-",110:".",111:"/",112:"f1",113:"f2",114:"f3",115:"f4",116:"f5",117:"f6",118:"f7",119:"f8",120:"f9",121:"f10",122:"f11",123:"f12",144:"numlock",145:"scroll",191:"/",224:"meta"},shiftNums:{"`":"~","1":"!","2":"@","3":"#","4":"$","5":"%","6":"^","7":"&","8":"*","9":"(","0":")","-":"_","=":"+",";":": ","'":"\"",",":"<",".":">","/":"?","\\":"|"}};function keyHandler(handleObj){if(typeof handleObj.data!=="string"){return;}
var origHandler=handleObj.handler,keys=handleObj.data.toLowerCase().split(" ");handleObj.handler=function(event){if(this!==event.target&&(/textarea|select/i.test(event.target.nodeName)||event.target.type==="text")){return;}
var special=event.type!=="keypress"&&jQuery.hotkeys.specialKeys[event.which],character=String.fromCharCode(event.which).toLowerCase(),key,modif="",possible={};if(event.altKey&&special!=="alt"){modif+="alt+";}
if(event.ctrlKey&&special!=="ctrl"){modif+="ctrl+";}
if(event.metaKey&&!event.ctrlKey&&special!=="meta"){modif+="meta+";}
if(event.shiftKey&&special!=="shift"){modif+="shift+";}
if(special){possible[modif+special]=true;}else{possible[modif+character]=true;possible[modif+jQuery.hotkeys.shiftNums[character]]=true;if(modif==="shift+"){possible[jQuery.hotkeys.shiftNums[character]]=true;}}
for(var i=0,l=keys.length;i<l;i++){if(possible[keys[i]]){return origHandler.apply(this,arguments);}}};}
jQuery.each(["keydown","keyup","keypress"],function(){jQuery.event.special[this]={add:keyHandler};});})(jQuery);


/*
 * tipsy, facebook style tooltips for jquery
 * version 1.0.0a
 * (c) 2008-2010 jason frame [jason@onehackoranother.com]
 * released under the MIT license
*/
(function($){function maybeCall(thing,ctx){return(typeof thing=='function')?(thing.call(ctx)):thing;};function Tipsy(element,options){this.$element=$(element);this.options=options;this.enabled=true;this.fixTitle();};Tipsy.prototype={show:function(){var title=this.getTitle();if(title&&this.enabled){var $tip=this.tip();$tip.find('.tipsy-inner')[this.options.html?'html':'text'](title);$tip[0].className='tipsy';$tip.remove().css({top:0,left:0,visibility:'hidden',display:'block'}).prependTo(document.body);var pos=$.extend({},this.$element.offset(),{width:this.$element[0].offsetWidth,height:this.$element[0].offsetHeight});var actualWidth=$tip[0].offsetWidth,actualHeight=$tip[0].offsetHeight,gravity=maybeCall(this.options.gravity,this.$element[0]);var tp;switch(gravity.charAt(0)){case'n':tp={top:pos.top+pos.height+this.options.offset,left:pos.left+pos.width/2-actualWidth/2};break;case's':tp={top:pos.top-actualHeight-this.options.offset,left:pos.left+pos.width/2-actualWidth/2};break;case'e':tp={top:pos.top+pos.height/2-actualHeight/2,left:pos.left-actualWidth-this.options.offset};break;case'w':tp={top:pos.top+pos.height/2-actualHeight/2,left:pos.left+pos.width+this.options.offset};break;}
if(gravity.length==2){if(gravity.charAt(1)=='w'){tp.left=pos.left+pos.width/2-15;}else{tp.left=pos.left+pos.width/2-actualWidth+15;}}
$tip.css(tp).addClass('tipsy-'+gravity);$tip.find('.tipsy-arrow')[0].className='tipsy-arrow tipsy-arrow-'+gravity.charAt(0);if(this.options.className){$tip.addClass(maybeCall(this.options.className,this.$element[0]));}
if(this.options.fade){$tip.stop().css({opacity:0,display:'block',visibility:'visible'}).animate({opacity:this.options.opacity});}else{$tip.css({visibility:'visible',opacity:this.options.opacity});}}},hide:function(){if(this.options.fade){this.tip().stop().fadeOut(function(){$(this).remove();});}else{this.tip().remove();}},fixTitle:function(){var $e=this.$element;if($e.attr('title')||typeof($e.attr('original-title'))!='string'){$e.attr('original-title',$e.attr('title')||'').removeAttr('title');}},getTitle:function(){var title,$e=this.$element,o=this.options;this.fixTitle();var title,o=this.options;if(typeof o.title=='string'){title=$e.attr(o.title=='title'?'original-title':o.title);}else if(typeof o.title=='function'){title=o.title.call($e[0]);}
title=(''+title).replace(/(^\s*|\s*$)/,"");return title||o.fallback;},tip:function(){if(!this.$tip){this.$tip=$('<div class="tipsy"></div>').html('<div class="tipsy-arrow"></div><div class="tipsy-inner"></div>');}
return this.$tip;},validate:function(){if(!this.$element[0].parentNode){this.hide();this.$element=null;this.options=null;}},enable:function(){this.enabled=true;},disable:function(){this.enabled=false;},toggleEnabled:function(){this.enabled=!this.enabled;}};$.fn.tipsy=function(options){if(options===true){return this.data('tipsy');}else if(typeof options=='string'){var tipsy=this.data('tipsy');if(tipsy)tipsy[options]();return this;}
options=$.extend({},$.fn.tipsy.defaults,options);function get(ele){var tipsy=$.data(ele,'tipsy');if(!tipsy){tipsy=new Tipsy(ele,$.fn.tipsy.elementOptions(ele,options));$.data(ele,'tipsy',tipsy);}
return tipsy;}
function enter(){var tipsy=get(this);tipsy.hoverState='in';if(options.delayIn==0){tipsy.show();}else{tipsy.fixTitle();setTimeout(function(){if(tipsy.hoverState=='in')tipsy.show();},options.delayIn);}};function leave(){var tipsy=get(this);tipsy.hoverState='out';if(options.delayOut==0){tipsy.hide();}else{setTimeout(function(){if(tipsy.hoverState=='out')tipsy.hide();},options.delayOut);}};if(!options.live)this.each(function(){get(this);});if(options.trigger!='manual'){var binder=options.live?'live':'bind',eventIn=options.trigger=='hover'?'mouseenter':'focus',eventOut=options.trigger=='hover'?'mouseleave':'blur';this[binder](eventIn,enter)[binder](eventOut,leave);}
return this;};$.fn.tipsy.defaults={className:null,delayIn:0,delayOut:0,fade:false,fallback:'',gravity:'n',html:false,live:false,offset:0,opacity:0.8,title:'title',trigger:'hover'};$.fn.tipsy.elementOptions=function(ele,options){return $.metadata?$.extend({},options,$(ele).metadata()):options;};$.fn.tipsy.autoNS=function(){return $(this).offset().top>($(document).scrollTop()+$(window).height()/2)?'s':'n';};$.fn.tipsy.autoWE=function(){return $(this).offset().left>($(document).scrollLeft()+$(window).width()/2)?'e':'w';};$.fn.tipsy.autoBounds=function(margin,prefer){return function(){var dir={ns:prefer[0],ew:(prefer.length>1?prefer[1]:false)},boundTop=$(document).scrollTop()+margin,boundLeft=$(document).scrollLeft()+margin,$this=$(this);if($this.offset().top<boundTop)dir.ns='n';if($this.offset().left<boundLeft)dir.ew='w';if($(window).width()+$(document).scrollLeft()-$this.offset().left<margin)dir.ew='e';if($(window).height()+$(document).scrollTop()-$this.offset().top<margin)dir.ns='s';return dir.ns+(dir.ew?dir.ew:'');}};})(jQuery);



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
var Showdown={};Showdown.converter=function(){var a,b,c,d=0;this.makeHtml=function(d){a=[],b=[],c=[],d=d.replace(/~/g,"~T"),d=d.replace(/\$/g,"~D"),d=d.replace(/\r\n/g,"\n"),d=d.replace(/\r/g,"\n"),d="\n\n"+d+"\n\n",d=F(d),d=d.replace(/^[ \t]+$/mg,""),d=g(d),d=f(d),d=i(d),d=D(d),d=d.replace(/~D/g,"$$"),d=d.replace(/~T/g,"~"),d=d.replace(/https?\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!]/g,function(a,b){var c=d.slice(0,b),e=d.slice(b);if(c.match(/<[^>]+$/)&&e.match(/^[^>]*>/))return a;href=a.replace(/^http:\/\/github.com\//,"https://github.com/");return"<a href='"+href+"'>"+a+"</a>"}),d=d.replace(/[a-z0-9_\-+=.]+@[a-z0-9\-]+(\.[a-z0-9-]+)+/ig,function(a){return"<a href='mailto:"+a+"'>"+a+"</a>"}),d=d.replace(/[a-f0-9]{40}/ig,function(a,b){if(typeof GitHub=="undefined"||typeof GitHub.nameWithOwner=="undefined")return a;var c=d.slice(0,b),e=d.slice(b);if(c.match(/@$/)||c.match(/<[^>]+$/)&&e.match(/^[^>]*>/))return a;return"<a href='http://github.com/"+GitHub.nameWithOwner+"/commit/"+a+"'>"+a.substring(0,7)+"</a>"}),d=d.replace(/([a-z0-9_\-+=.]+)@([a-f0-9]{40})/ig,function(a,b,c,f){if(typeof GitHub=="undefined"||typeof GitHub.nameWithOwner=="undefined")return a;GitHub.repoName=GitHub.repoName||e();var g=d.slice(0,f),h=d.slice(f);if(g.match(/\/$/)||g.match(/<[^>]+$/)&&h.match(/^[^>]*>/))return a;return"<a href='http://github.com/"+b+"/"+GitHub.repoName+"/commit/"+c+"'>"+b+"@"+c.substring(0,7)+"</a>"}),d=d.replace(/([a-z0-9_\-+=.]+\/[a-z0-9_\-+=.]+)@([a-f0-9]{40})/ig,function(a,b,c){return"<a href='http://github.com/"+b+"/commit/"+c+"'>"+b+"@"+c.substring(0,7)+"</a>"}),d=d.replace(/#([0-9]+)/ig,function(a,b,c){if(typeof GitHub=="undefined"||typeof GitHub.nameWithOwner=="undefined")return a;var e=d.slice(0,c),f=d.slice(c);if(e==""||e.match(/[a-z0-9_\-+=.]$/)||e.match(/<[^>]+$/)&&f.match(/^[^>]*>/))return a;return"<a href='http://github.com/"+GitHub.nameWithOwner+"/issues/#issue/"+b+"'>"+a+"</a>"}),d=d.replace(/([a-z0-9_\-+=.]+)#([0-9]+)/ig,function(a,b,c,f){if(typeof GitHub=="undefined"||typeof GitHub.nameWithOwner=="undefined")return a;GitHub.repoName=GitHub.repoName||e();var g=d.slice(0,f),h=d.slice(f);if(g.match(/\/$/)||g.match(/<[^>]+$/)&&h.match(/^[^>]*>/))return a;return"<a href='http://github.com/"+b+"/"+GitHub.repoName+"/issues/#issue/"+c+"'>"+a+"</a>"}),d=d.replace(/([a-z0-9_\-+=.]+\/[a-z0-9_\-+=.]+)#([0-9]+)/ig,function(a,b,c){return"<a href='http://github.com/"+b+"/issues/#issue/"+c+"'>"+a+"</a>"});return d};var e=function(){return GitHub.nameWithOwner.match(/^.+\/(.+)$/)[1]},f=function(c){var c=c.replace(/^[ ]{0,3}\[(.+)\]:[ \t]*\n?[ \t]*<?(\S+?)>?[ \t]*\n?[ \t]*(?:(\n*)["(](.+?)[")][ \t]*)?(?:\n+|\Z)/gm,function(c,d,e,f,g){d=d.toLowerCase(),a[d]=z(e);if(f)return f+g;g&&(b[d]=g.replace(/"/g,"&quot;"));return""});return c},g=function(a){a=a.replace(/\n/g,"\n\n");var b="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del",c="p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math";a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math|ins|del)\b[^\r]*?\n<\/\2>[ \t]*(?=\n+))/gm,h),a=a.replace(/^(<(p|div|h[1-6]|blockquote|pre|table|dl|ol|ul|script|noscript|form|fieldset|iframe|math)\b[^\r]*?.*<\/\2>[ \t]*(?=\n+)\n)/gm,h),a=a.replace(/(\n[ ]{0,3}(<(hr)\b([^<>])*?\/?>)[ \t]*(?=\n{2,}))/g,h),a=a.replace(/(\n\n[ ]{0,3}<!(--[^\r]*?--\s*)+>[ \t]*(?=\n{2,}))/g,h),a=a.replace(/(?:\n\n)([ ]{0,3}(?:<([?%])[^\r]*?\2>)[ \t]*(?=\n{2,}))/g,h),a=a.replace(/\n\n/g,"\n");return a},h=function(a,b){var d=b;d=d.replace(/\n\n/g,"\n"),d=d.replace(/^\n/,""),d=d.replace(/\n+$/g,""),d="\n\n~K"+(c.push(d)-1)+"K\n\n";return d},i=function(a){a=p(a);var b=t("<hr />");a=a.replace(/^[ ]{0,2}([ ]?\*[ ]?){3,}[ \t]*$/gm,b),a=a.replace(/^[ ]{0,2}([ ]?\-[ ]?){3,}[ \t]*$/gm,b),a=a.replace(/^[ ]{0,2}([ ]?\_[ ]?){3,}[ \t]*$/gm,b),a=r(a),a=s(a),a=x(a),a=g(a),a=y(a);return a},j=function(a){a=u(a),a=k(a),a=A(a),a=n(a),a=l(a),a=B(a),a=z(a),a=w(a),a=a.replace(/  +\n/g," <br />\n");return a},k=function(a){var b=/(<[a-z\/!$]("[^"]*"|'[^']*'|[^'">])*>|<!(--.*?--\s*)+>)/gi;a=a.replace(b,function(a){var b=a.replace(/(.)<\/?code>(?=.)/g,"$1`");b=G(b,"\\`*_");return b});return a},l=function(a){a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,m),a=a.replace(/(\[((?:\[[^\]]*\]|[^\[\]])*)\]\([ \t]*()<?(.*?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,m),a=a.replace(/(\[([^\[\]]+)\])()()()()()/g,m);return a},m=function(c,d,e,f,g,h,i,j){j==undefined&&(j="");var k=d,l=e,m=f.toLowerCase(),n=g,o=j;if(n==""){m==""&&(m=l.toLowerCase().replace(/ ?\n/g," ")),n="#"+m;if(a[m]!=undefined)n=a[m],b[m]!=undefined&&(o=b[m]);else if(k.search(/\(\s*\)$/m)>-1)n="";else return k}n=G(n,"*_");var p='<a href="'+n+'"';o!=""&&(o=o.replace(/"/g,"&quot;"),o=G(o,"*_"),p+=' title="'+o+'"'),p+=">"+l+"</a>";return p},n=function(a){a=a.replace(/(!\[(.*?)\][ ]?(?:\n[ ]*)?\[(.*?)\])()()()()/g,o),a=a.replace(/(!\[(.*?)\]\s?\([ \t]*()<?(\S+?)>?[ \t]*((['"])(.*?)\6[ \t]*)?\))/g,o);return a},o=function(c,d,e,f,g,h,i,j){var k=d,l=e,m=f.toLowerCase(),n=g,o=j;o||(o="");if(n==""){m==""&&(m=l.toLowerCase().replace(/ ?\n/g," ")),n="#"+m;if(a[m]!=undefined)n=a[m],b[m]!=undefined&&(o=b[m]);else return k}l=l.replace(/"/g,"&quot;"),n=G(n,"*_");var p='<img src="'+n+'" alt="'+l+'"';o=o.replace(/"/g,"&quot;"),o=G(o,"*_"),p+=' title="'+o+'"',p+=" />";return p},p=function(a){a=a.replace(/^(.+)[ \t]*\n=+[ \t]*\n+/gm,function(a,b){return t("<h1>"+j(b)+"</h1>")}),a=a.replace(/^(.+)[ \t]*\n-+[ \t]*\n+/gm,function(a,b){return t("<h2>"+j(b)+"</h2>")}),a=a.replace(/^(\#{1,6})[ \t]*(.+?)[ \t]*\#*\n+/gm,function(a,b,c){var d=b.length;return t("<h"+d+">"+j(c)+"</h"+d+">")});return a},q,r=function(a){a+="~0";var b=/^(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/gm;d?a=a.replace(b,function(a,b,c){var d=b,e=c.search(/[*+-]/g)>-1?"ul":"ol";d=d.replace(/\n{2,}/g,"\n\n\n");var f=q(d);f=f.replace(/\s+$/,""),f="<"+e+">"+f+"</"+e+">\n";return f}):(b=/(\n\n|^\n?)(([ ]{0,3}([*+-]|\d+[.])[ \t]+)[^\r]+?(~0|\n{2,}(?=\S)(?![ \t]*(?:[*+-]|\d+[.])[ \t]+)))/g,a=a.replace(b,function(a,b,c,d){var e=b,f=c,g=d.search(/[*+-]/g)>-1?"ul":"ol",f=f.replace(/\n{2,}/g,"\n\n\n"),h=q(f);h=e+"<"+g+">\n"+h+"</"+g+">\n";return h})),a=a.replace(/~0/,"");return a};q=function(a){d++,a=a.replace(/\n{2,}$/,"\n"),a+="~0",a=a.replace(/(\n)?(^[ \t]*)([*+-]|\d+[.])[ \t]+([^\r]+?(\n{1,2}))(?=\n*(~0|\2([*+-]|\d+[.])[ \t]+))/gm,function(a,b,c,d,e){var f=e,g=b,h=c;g||f.search(/\n{2,}/)>-1?f=i(E(f)):(f=r(E(f)),f=f.replace(/\n$/,""),f=j(f));return"<li>"+f+"</li>\n"}),a=a.replace(/~0/g,""),d--;return a};var s=function(a){a+="~0",a=a.replace(/(?:\n\n|^)((?:(?:[ ]{4}|\t).*\n+)+)(\n*[ ]{0,3}[^ \t\n]|(?=~0))/g,function(a,b,c){var d=b,e=c;d=v(E(d)),d=F(d),d=d.replace(/^\n+/g,""),d=d.replace(/\n+$/g,""),d="<pre><code>"+d+"\n</code></pre>";return t(d)+e}),a=a.replace(/~0/,"");return a},t=function(a){a=a.replace(/(^\n+|\n+$)/g,"");return"\n\n~K"+(c.push(a)-1)+"K\n\n"},u=function(a){a=a.replace(/(^|[^\\])(`+)([^\r]*?[^`])\2(?!`)/gm,function(a,b,c,d,e){var f=d;f=f.replace(/^([ \t]*)/g,""),f=f.replace(/[ \t]*$/g,""),f=v(f);return b+"<code>"+f+"</code>"});return a},v=function(a){a=a.replace(/&/g,"&amp;"),a=a.replace(/</g,"&lt;"),a=a.replace(/>/g,"&gt;"),a=G(a,"*_{}[]\\",!1);return a},w=function(a){a=a.replace(/(\*\*|__)(?=\S)([^\r]*?\S[*_]*)\1/g,"<strong>$2</strong>"),a=a.replace(/(\w)_(\w)/g,"$1~E95E$2"),a=a.replace(/(\*|_)(?=\S)([^\r]*?\S)\1/g,"<em>$2</em>");return a},x=function(a){a=a.replace(/((^[ \t]*>[ \t]?.+\n(.+\n)*\n*)+)/gm,function(a,b){var c=b;c=c.replace(/^[ \t]*>[ \t]?/gm,"~0"),c=c.replace(/~0/g,""),c=c.replace(/^[ \t]+$/gm,""),c=i(c),c=c.replace(/(^|\n)/g,"$1  "),c=c.replace(/(\s*<pre>[^\r]+?<\/pre>)/gm,function(a,b){var c=b;c=c.replace(/^  /mg,"~0"),c=c.replace(/~0/g,"");return c});return t("<blockquote>\n"+c+"\n</blockquote>")});return a},y=function(a){a=a.replace(/^\n+/g,""),a=a.replace(/\n+$/g,"");var b=a.split(/\n{2,}/g),d=[],e=b.length;for(var f=0;f<e;f++){var g=b[f];g.search(/~K(\d+)K/g)>=0?d.push(g):g.search(/\S/)>=0&&(g=j(g),g=g.replace(/\n/g,"<br />"),g=g.replace(/^([ \t]*)/g,"<p>"),g+="</p>",d.push(g))}e=d.length;for(var f=0;f<e;f++)while(d[f].search(/~K(\d+)K/)>=0){var h=c[RegExp.$1];h=h.replace(/\$/g,"$$$$"),d[f]=d[f].replace(/~K\d+K/,h)}return d.join("\n\n")},z=function(a){a=a.replace(/&(?!#?[xX]?(?:[0-9a-fA-F]+|\w+);)/g,"&amp;"),a=a.replace(/<(?![a-z\/?\$!])/gi,"&lt;");return a},A=function(a){a=a.replace(/\\(\\)/g,H),a=a.replace(/\\([`*_{}\[\]()>#+-.!])/g,H);return a},B=function(a){a=a.replace(/<((https?|ftp|dict):[^'">\s]+)>/gi,'<a href="$1">$1</a>'),a=a.replace(/<(?:mailto:)?([-.\w]+\@[-a-z0-9]+(\.[-a-z0-9]+)*\.[a-z]+)>/gi,function(a,b){return C(D(b))});return a},C=function(a){function b(a){var b="0123456789ABCDEF",c=a.charCodeAt(0);return b.charAt(c>>4)+b.charAt(c&15)}var c=[function(a){return"&#"+a.charCodeAt(0)+";"},function(a){return"&#x"+b(a)+";"},function(a){return a}];a="mailto:"+a,a=a.replace(/./g,function(a){if(a=="@")a=c[Math.floor(Math.random()*2)](a);else if(a!=":"){var b=Math.random();a=b>.9?c[2](a):b>.45?c[1](a):c[0](a)}return a}),a='<a href="'+a+'">'+a+"</a>",a=a.replace(/">.+:/g,'">');return a},D=function(a){a=a.replace(/~E(\d+)E/g,function(a,b){var c=parseInt(b);return String.fromCharCode(c)});return a},E=function(a){a=a.replace(/^(\t|[ ]{1,4})/gm,"~0"),a=a.replace(/~0/g,"");return a},F=function(a){a=a.replace(/\t(?=\t)/g,"    "),a=a.replace(/\t/g,"~A~B"),a=a.replace(/~B(.+?)~A/g,function(a,b,c){var d=b,e=4-d.length%4;for(var f=0;f<e;f++)d+=" ";return d}),a=a.replace(/~A/g,"    "),a=a.replace(/~B/g,"");return a},G=function(a,b,c){var d="(["+b.replace(/([\[\]\\])/g,"\\$1")+"])";c&&(d="\\\\"+d);var e=new RegExp(d,"g");a=a.replace(e,H);return a},H=function(a,b){var c=b.charCodeAt(0);return"~E"+c+"E"}}



// Copyright (C) 2006 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/**
 * @fileoverview
 * An HTML sanitizer that can satisfy a variety of security policies.
 *
 * <p>
 * The HTML sanitizer is built around a SAX parser and HTML element and
 * attributes schemas.
 *
 * @author mikesamuel@gmail.com
 * @requires html4
 * @provides html, html_sanitize
 */
{{var css={'properties':(function(){var c=[/^\s*inherit\s+$/i,/^\s*(?:#(?:[0-9a-f]{3}){1,2}|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|purple|red|silver|teal|white|yellow|transparent|inherit)\s+$/i,/^\s*(?:none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset|inherit)\s+$/i,/^\s*(?:thin|medium|thick|0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)|inherit)\s+$/i,/^\s*(?:none|inherit)\s+$/i,/^\s*(?:url\("[^\(\)\\\"\r\n]+"\)|none|inherit)\s+$/i,/^\s*(?:0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)|0|(?:\d+(?:\.\d+)?)%|auto|inherit)\s+$/i,/^\s*(?:0|(?:\d+(?:\.\d+)?)(?:em|ex|px|in|cm|mm|pt|pc)|0|[+-]?\d+(?:\.\d+)?%|none|inherit)\s+$/i,/^\s*(?:0|(?:\d+(?:\.\d+)?)(?:em|ex|px|in|cm|mm|pt|pc)|0|[+-]?\d+(?:\.\d+)?%|inherit)\s+$/i,/^\s*(?:auto|always|avoid|left|right|inherit)\s+$/i,/^\s*(?:0|[+-]?\d+(?:\.\d+)?m?s|0|(?:\d+(?:\.\d+)?)%|inherit)\s+$/i,/^\s*(?:0|[+-]?\d+(?:\.\d+)?|inherit)\s+$/i,/^\s*(?:normal|0|(?:\d+(?:\.\d+)?)(?:em|ex|px|in|cm|mm|pt|pc)|inherit)\s+$/i];return{'azimuth':/^\s*(?:0|[+-]?\d+(?:\.\d+)?(?:deg|g?rad)|leftwards|rightwards|inherit)\s+$/i,'background':c[0],'backgroundAttachment':/^\s*(?:scroll|fixed|inherit)\s+$/i,'backgroundColor':c[1],'backgroundImage':c[5],'backgroundPosition':/^\s*(?:(?:0|(?:\d+(?:\.\d+)?)%|0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)|left|center|right)\s+(?:(?:0|(?:\d+(?:\.\d+)?)%|0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)|top|center|bottom)\s+)?|inherit\s+)$/i,'backgroundRepeat':/^\s*(?:repeat|repeat-x|repeat-y|no-repeat|inherit)\s+$/i,'border':c[0],'borderBottom':c[0],'borderBottomColor':c[1],'borderBottomStyle':c[2],'borderBottomWidth':c[3],'borderCollapse':/^\s*(?:collapse|separate|inherit)\s+$/i,'borderColor':/^\s*(?:(?:(?:#(?:[0-9a-f]{3}){1,2}|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|purple|red|silver|teal|white|yellow|transparent)\s+){1,4}|inherit\s+)$/i,'borderLeft':c[0],'borderLeftColor':c[1],'borderLeftStyle':c[2],'borderLeftWidth':c[3],'borderRadius':/^\s*0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)\s+(?:0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)\s+)?$/i,'borderRight':c[0],'borderRightColor':c[1],'borderRightStyle':c[2],'borderRightWidth':c[3],'borderSpacing':/^\s*(?:0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)\s+(?:0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)\s+)?|inherit\s+)$/i,'borderStyle':/^\s*(?:(?:(?:none|hidden|dotted|dashed|solid|double|groove|ridge|inset|outset)\s+){1,4}|inherit\s+)$/i,'borderTop':c[0],'borderTopColor':c[1],'borderTopStyle':c[2],'borderTopWidth':c[3],'borderWidth':/^\s*(?:(?:(?:thin|medium|thick|0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc))\s+){1,4}|inherit\s+)$/i,'bottom':c[6],'captionSide':/^\s*(?:top|bottom|inherit)\s+$/i,'clear':/^\s*(?:none|left|right|both|inherit)\s+$/i,'clip':/^\s*(?:auto|inherit)\s+$/i,'color':/^\s*(?:#(?:[0-9a-f]{3}){1,2}|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|purple|red|silver|teal|white|yellow|inherit)\s+$/i,'counterIncrement':c[4],'counterReset':c[4],'cssFloat':/^\s*(?:left|right|none|inherit)\s+$/i,'cue':c[0],'cueAfter':c[5],'cueBefore':c[5],'cursor':/^\s*(?:(?:url\("[^\(\)\\\"\r\n]+"\)\s+,\s+)*(?:auto|crosshair|default|pointer|move|e-resize|ne-resize|nw-resize|n-resize|se-resize|sw-resize|s-resize|w-resize|text|wait|help|progress|all-scroll|col-resize|hand|no-drop|not-allowed|row-resize|vertical-text)|inherit)\s+$/i,'direction':/^\s*(?:ltr|rtl|inherit)\s+$/i,'display':/^\s*(?:inline|block|list-item|run-in|inline-block|table|inline-table|table-row-group|table-header-group|table-footer-group|table-row|table-column-group|table-column|table-cell|table-caption|none|inherit)\s+$/i,'elevation':/^\s*(?:0|[+-]?\d+(?:\.\d+)?(?:deg|g?rad)|below|level|above|higher|lower|inherit)\s+$/i,'emptyCells':/^\s*(?:show|hide|inherit)\s+$/i,'font':/^\s*(?:caption|icon|menu|message-box|small-caption|status-bar|inherit)\s+$/i,'fontFamily':/^\s*(?:(?:"\w(?:[\w-]*\w)(?:\s+\w([\w-]*\w))*"|serif|sans-serif|cursive|fantasy|monospace)\s+(?:,\s+(?:"\w(?:[\w-]*\w)(?:\s+\w([\w-]*\w))*"|serif|sans-serif|cursive|fantasy|monospace)\s+)*|inherit\s+)$/i,'fontSize':/^\s*(?:xx-small|x-small|small|medium|large|x-large|xx-large|(?:small|larg)er|0|(?:\d+(?:\.\d+)?)(?:em|ex|px|in|cm|mm|pt|pc)|0|[+-]?\d+(?:\.\d+)?%|inherit)\s+$/i,'fontStyle':/^\s*(?:normal|italic|oblique|inherit)\s+$/i,'fontVariant':/^\s*(?:normal|small-caps|inherit)\s+$/i,'fontWeight':/^\s*(?:normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit)\s+$/i,'height':c[6],'left':c[6],'letterSpacing':c[12],'lineHeight':/^\s*(?:normal|0|(?:\d+(?:\.\d+)?)|0|(?:\d+(?:\.\d+)?)(?:em|ex|px|in|cm|mm|pt|pc)|0|[+-]?\d+(?:\.\d+)?%|inherit)\s+$/i,'listStyle':c[0],'listStyleImage':c[5],'listStylePosition':/^\s*(?:inside|outside|inherit)\s+$/i,'listStyleType':/^\s*(?:disc|circle|square|decimal|decimal-leading-zero|lower-roman|upper-roman|lower-greek|lower-latin|upper-latin|armenian|georgian|lower-alpha|upper-alpha|none|inherit)\s+$/i,'margin':/^\s*(?:(?:(?:0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)|0|(?:\d+(?:\.\d+)?)%|auto)\s+){1,4}|inherit\s+)$/i,'marginBottom':c[6],'marginLeft':c[6],'marginRight':c[6],'marginTop':c[6],'maxHeight':c[7],'maxWidth':c[7],'minHeight':c[8],'minWidth':c[8],'opacity':c[0],'outline':c[0],'outlineColor':/^\s*(?:#(?:[0-9a-f]{3}){1,2}|aqua|black|blue|fuchsia|gray|green|lime|maroon|navy|olive|purple|red|silver|teal|white|yellow|invert|inherit)\s+$/i,'outlineStyle':c[2],'outlineWidth':c[3],'overflow':/^\s*(?:visible|hidden|scroll|auto|inherit)\s+$/i,'padding':/^\s*(?:(?:(?:0|(?:\d+(?:\.\d+)?)(?:em|ex|px|in|cm|mm|pt|pc)|0|[+-]?\d+(?:\.\d+)?%)\s+){1,4}|inherit\s+)$/i,'paddingBottom':c[8],'paddingLeft':c[8],'paddingRight':c[8],'paddingTop':c[8],'pageBreakAfter':c[9],'pageBreakBefore':c[9],'pageBreakInside':/^\s*(?:avoid|auto|inherit)\s+$/i,'pause':/^\s*(?:(?:(?:0|[+-]?\d+(?:\.\d+)?m?s|0|(?:\d+(?:\.\d+)?)%)\s+){1,2}|inherit\s+)$/i,'pauseAfter':c[10],'pauseBefore':c[10],'pitch':/^\s*(?:0|(?:\d+(?:\.\d+)?)k?Hz|x-low|low|medium|high|x-high|inherit)\s+$/i,'pitchRange':c[11],'playDuring':/^\s*(?:auto|none|inherit)\s+$/i,'position':/^\s*(?:static|relative|absolute|fixed|inherit)\s+$/i,'quotes':c[4],'richness':c[11],'right':c[6],'speak':/^\s*(?:normal|none|spell-out|inherit)\s+$/i,'speakHeader':/^\s*(?:once|always|inherit)\s+$/i,'speakNumeral':/^\s*(?:digits|continuous|inherit)\s+$/i,'speakPunctuation':/^\s*(?:code|none|inherit)\s+$/i,'speechRate':/^\s*(?:0|[+-]?\d+(?:\.\d+)?|x-slow|slow|medium|fast|x-fast|faster|slower|inherit)\s+$/i,'stress':c[11],'tableLayout':/^\s*(?:auto|fixed|inherit)\s+$/i,'textAlign':/^\s*(?:left|right|center|justify|inherit)\s+$/i,'textDecoration':c[4],'textIndent':/^\s*(?:0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)|0|(?:\d+(?:\.\d+)?)%|inherit)\s+$/i,'textTransform':/^\s*(?:capitalize|uppercase|lowercase|none|inherit)\s+$/i,'textWrap':/^\s*(?:normal|unrestricted|none|suppress)\s+$/i,'top':c[6],'unicodeBidi':/^\s*(?:normal|embed|bidi-override|inherit)\s+$/i,'verticalAlign':/^\s*(?:baseline|sub|super|top|text-top|middle|bottom|text-bottom|0|(?:\d+(?:\.\d+)?)%|0|[+-]?\d+(?:\.\d+)?(?:em|ex|px|in|cm|mm|pt|pc)|inherit)\s+$/i,'visibility':/^\s*(?:visible|hidden|collapse|inherit)\s+$/i,'voiceFamily':/^\s*(?:(?:(?:"\w(?:[\w-]*\w)(?:\s+\w([\w-]*\w))*"|male|female|child)\s+,\s+)*(?:"\w(?:[\w-]*\w)(?:\s+\w([\w-]*\w))*"|male|female|child)|inherit)\s+$/i,'volume':/^\s*(?:0|(?:\d+(?:\.\d+)?)|0|[+-]?\d+(?:\.\d+)?%|silent|x-soft|soft|medium|loud|x-loud|inherit)\s+$/i,'whiteSpace':/^\s*(?:normal|pre|nowrap|pre-wrap|pre-line|inherit)\s+$/i,'width':/^\s*(?:0|(?:\d+(?:\.\d+)?)(?:em|ex|px|in|cm|mm|pt|pc)|0|[+-]?\d+(?:\.\d+)?%|auto|inherit)\s+$/i,'wordSpacing':c[12],'wordWrap':/^\s*(?:normal|break-word)\s+$/i,'zIndex':/^\s*(?:auto|\d+|inherit)\s+$/i,'zoom':/^\s*(?:normal|0|(?:\d+(?:\.\d+)?)|0|[+-]?\d+(?:\.\d+)?%)\s+$/i};})()};}{var
html4={};html4 .atype={'NONE':0,'URI':1,'SCRIPT':2,'ID':4,'IDREF':5,'IDREFS':6,'GLOBAL_NAME':7,'LOCAL_NAME':8,'CLASSES':9,'FRAME_TARGET':10};html4
.ATTRIBS={'*:class':9,'*:dir':0,'*:id':4,'*:lang':0,'*:onclick':2,'*:ondblclick':2,'*:onkeydown':2,'*:onkeypress':2,'*:onkeyup':2,'*:onmousedown':2,'*:onmousemove':2,'*:onmouseout':2,'*:onmouseover':2,'*:onmouseup':2,'*:style':3,'*:title':0,'a:coords':0,'a:href':1,'a:hreflang':0,'a:name':7,'a:onblur':2,'a:onfocus':2,'a:rel':0,'a:rev':0,'a:shape':0,'a:tabindex':0,'a:target':10,'a:type':0,'area:alt':0,'area:coords':0,'area:href':1,'area:nohref':0,'area:onblur':2,'area:onfocus':2,'area:shape':0,'area:tabindex':0,'area:target':10,'bdo:dir':0,'blockquote:cite':1,'br:clear':0,'button:disabled':0,'button:name':8,'button:onblur':2,'button:onfocus':2,'button:tabindex':0,'button:type':0,'button:value':0,'caption:align':0,'col:align':0,'col:char':0,'col:charoff':0,'col:span':0,'col:valign':0,'col:width':0,'colgroup:align':0,'colgroup:char':0,'colgroup:charoff':0,'colgroup:span':0,'colgroup:valign':0,'colgroup:width':0,'del:cite':1,'del:datetime':0,'dir:compact':0,'div:align':0,'dl:compact':0,'font:color':0,'font:face':0,'font:size':0,'form:accept':0,'form:action':1,'form:enctype':0,'form:method':0,'form:name':7,'form:onreset':2,'form:onsubmit':2,'form:target':10,'h1:align':0,'h2:align':0,'h3:align':0,'h4:align':0,'h5:align':0,'h6:align':0,'hr:align':0,'hr:noshade':0,'hr:size':0,'hr:width':0,'img:align':0,'img:alt':0,'img:border':0,'img:height':0,'img:hspace':0,'img:ismap':0,'img:longdesc':1,'img:name':7,'img:src':1,'img:usemap':0,'img:vspace':0,'img:width':0,'input:accept':0,'input:align':0,'input:alt':0,'input:checked':0,'input:disabled':0,'input:ismap':0,'input:maxlength':0,'input:name':8,'input:onblur':2,'input:onchange':2,'input:onfocus':2,'input:onselect':2,'input:readonly':0,'input:size':0,'input:src':1,'input:tabindex':0,'input:type':0,'input:usemap':0,'input:value':0,'ins:cite':1,'ins:datetime':0,'label:for':5,'label:onblur':2,'label:onfocus':2,'legend:align':0,'li:type':0,'li:value':0,'map:name':7,'menu:compact':0,'ol:compact':0,'ol:start':0,'ol:type':0,'optgroup:disabled':0,'optgroup:label':0,'option:disabled':0,'option:label':0,'option:selected':0,'option:value':0,'p:align':0,'pre:width':0,'q:cite':1,'select:disabled':0,'select:multiple':0,'select:name':8,'select:onblur':2,'select:onchange':2,'select:onfocus':2,'select:size':0,'select:tabindex':0,'table:align':0,'table:bgcolor':0,'table:border':0,'table:cellpadding':0,'table:cellspacing':0,'table:frame':0,'table:rules':0,'table:summary':0,'table:width':0,'tbody:align':0,'tbody:char':0,'tbody:charoff':0,'tbody:valign':0,'td:abbr':0,'td:align':0,'td:axis':0,'td:bgcolor':0,'td:char':0,'td:charoff':0,'td:colspan':0,'td:headers':6,'td:height':0,'td:nowrap':0,'td:rowspan':0,'td:scope':0,'td:valign':0,'td:width':0,'textarea:cols':0,'textarea:disabled':0,'textarea:name':8,'textarea:onblur':2,'textarea:onchange':2,'textarea:onfocus':2,'textarea:onselect':2,'textarea:readonly':0,'textarea:rows':0,'textarea:tabindex':0,'tfoot:align':0,'tfoot:char':0,'tfoot:charoff':0,'tfoot:valign':0,'th:abbr':0,'th:align':0,'th:axis':0,'th:bgcolor':0,'th:char':0,'th:charoff':0,'th:colspan':0,'th:headers':6,'th:height':0,'th:nowrap':0,'th:rowspan':0,'th:scope':0,'th:valign':0,'th:width':0,'thead:align':0,'thead:char':0,'thead:charoff':0,'thead:valign':0,'tr:align':0,'tr:bgcolor':0,'tr:char':0,'tr:charoff':0,'tr:valign':0,'ul:compact':0,'ul:type':0};html4
.eflags={'OPTIONAL_ENDTAG':1,'EMPTY':2,'CDATA':4,'RCDATA':8,'UNSAFE':16,'FOLDABLE':32};html4
.ELEMENTS={'a':0,'abbr':0,'acronym':0,'address':0,'applet':16,'area':2,'b':0,'base':18,'basefont':18,'bdo':0,'big':0,'blockquote':0,'body':49,'br':2,'button':0,'caption':0,'center':0,'cite':0,'code':0,'col':2,'colgroup':1,'dd':1,'del':0,'dfn':0,'dir':0,'div':0,'dl':0,'dt':1,'em':0,'fieldset':0,'font':0,'form':0,'frame':18,'frameset':16,'h1':0,'h2':0,'h3':0,'h4':0,'h5':0,'h6':0,'head':49,'hr':2,'html':49,'i':0,'iframe':20,'img':2,'input':2,'ins':0,'isindex':18,'kbd':0,'label':0,'legend':0,'li':1,'link':18,'map':0,'menu':0,'meta':18,'noframes':20,'noscript':20,'object':16,'ol':0,'optgroup':0,'option':1,'p':1,'param':18,'pre':0,'q':0,'s':0,'samp':0,'script':20,'select':0,'small':0,'span':0,'strike':0,'strong':0,'style':20,'sub':0,'sup':0,'table':0,'tbody':1,'td':1,'textarea':8,'tfoot':1,'th':1,'thead':1,'title':24,'tr':1,'tt':0,'u':0,'ul':0,'var':0};}{var
htmlSanitizer=(function(){var lcase;if('script'==='SCRIPT'.toLowerCase()){lcase=function(s){return s.toLowerCase();};}else{lcase=function(s){return s.replace(/[A-Z]/g,function(ch){return String.fromCharCode(ch.charCodeAt(0)|32);});};}var
ENTITIES={'LT':'<','GT':'>','AMP':'&','NBSP':'\xa0','QUOT':'\"','APOS':'\''};var
decimalEscapeRe=/^#(\d+)$/;var hexEscapeRe=/^#x([0-9A-F]+)$/;function lookupEntity(name){name=name.toUpperCase();if(ENTITIES.hasOwnProperty(name)){return ENTITIES[name];}var
m=name.match(decimalEscapeRe);if(m){return String.fromCharCode(parseInt(m[1],10));}else
if(!(!(m=name.match(hexEscapeRe)))){return String.fromCharCode(parseInt(m[1],16));}return'';}function
decodeOneEntity(_,name){return lookupEntity(name);}var nulRe=/\0/g;function stripNULs(s){return s.replace(nulRe,'');}var
entityRe=/&(#\d+|#x[\da-f]+|\w+);/g;function unescapeEntities(s){return s.replace(entityRe,decodeOneEntity);}var
ampRe=/&/g;var looseAmpRe=/&([^a-z#]|#(?:[^0-9x]|x(?:[^0-9a-f]|$)|$)|$)/gi;var ltRe=/</g;var
gtRe=/>/g;var quotRe=/\"/g;var eqRe=/=/g;function escapeAttrib(s){return s.replace(ampRe,'&amp;').replace(ltRe,'&lt;').replace(gtRe,'&gt;').replace(quotRe,'&quot;').replace(eqRe,'&#61;');}function
normalizeRCData(rcdata){return rcdata.replace(looseAmpRe,'&amp;$1').replace(ltRe,'&lt;').replace(gtRe,'&gt;');}var
INSIDE_TAG_TOKEN=new RegExp('^\\s*(?:'+('(?:'+'([a-z][a-z-]*)'+('('+'\\s*=\\s*'+('('+'\"[^\"]*\"'+'|\'[^\']*\''+'|(?=[a-z][a-z-]*\\s*=)'+'|[^>\"\'\\s]*'+')')+')')+'?'+')')+'|(/?>)'+'|[^\\w\\s>]+)','i');var
OUTSIDE_TAG_TOKEN=new RegExp('^(?:'+'&(\\#[0-9]+|\\#[x][0-9a-f]+|\\w+);'+'|<!--[\\s\\S]*?-->|<!\\w[^>]*>|<\\?[^>*]*>'+'|<(/)?([a-z][a-z0-9]*)'+'|([^<&>]+)'+'|([<&>]))','i');function
makeSaxParser(handler){return function parse(htmlText,param){htmlText=String(htmlText);var
htmlLower=null;var inTag=false;var attribs=[];var tagName;var eflags;var openTag;handler.startDoc&&handler.startDoc(param);while(htmlText){var
m=htmlText.match(inTag?INSIDE_TAG_TOKEN:OUTSIDE_TAG_TOKEN);htmlText=htmlText.substring(m[0].length);if(inTag){if(m[1]){var
attribName=lcase(m[1]);var decodedValue;if(m[2]){var encodedValue=m[3];switch(encodedValue.charCodeAt(0)){case
34:;case 39:{encodedValue=encodedValue.substring(1,encodedValue.length-1);break;}}decodedValue=unescapeEntities(stripNULs(encodedValue));}else{decodedValue=attribName;}attribs.push(attribName,decodedValue);}else
if(m[4]){if(eflags!==void 0){if(openTag){handler.startTag&&handler.startTag(tagName,attribs,param);}else{handler.endTag&&handler.endTag(tagName,param);}}if(openTag&&eflags&(html4
.eflags.CDATA|html4 .eflags.RCDATA)){if(htmlLower===null){htmlLower=lcase(htmlText);}else{htmlLower=htmlLower.substring(htmlLower.length-htmlText.length);}var
dataEnd=htmlLower.indexOf('</'+tagName);if(dataEnd<0){dataEnd=htmlText.length;}if(eflags&html4
.eflags.CDATA){handler.cdata&&handler.cdata(htmlText.substring(0,dataEnd),param);}else
if(handler.rcdata){handler.rcdata(normalizeRCData(htmlText.substring(0,dataEnd)),param);}htmlText=htmlText.substring(dataEnd);}tagName=eflags=openTag=void
0;attribs.length=0;inTag=false;}}else{if(m[1]){handler.pcdata&&handler.pcdata(m[0],param);}else
if(m[3]){openTag=!m[2];inTag=true;tagName=m[3].toLowerCase();eflags=html4 .ELEMENTS.hasOwnProperty(tagName)?html4
.ELEMENTS[tagName]:void 0;}else if(m[4]){handler.pcdata&&handler.pcdata(m[4],param);}else
if(m[5]){if(handler.pcdata){switch(m[5]){case'<':{handler.pcdata('&lt;',param);break;}case'>':{handler.pcdata('&gt;',param);break;}default:{handler.pcdata('&amp;',param);break;}}}}}}handler.endDoc&&handler.endDoc(param);};}return{'normalizeRCData':normalizeRCData,'escapeAttrib':escapeAttrib,'unescapeEntities':unescapeEntities,'makeSaxParser':makeSaxParser};})();htmlSanitizer.makeHtmlSanitizer=function(sanitizeAttributes){var
stack=[];var ignoring=false;return htmlSanitizer.makeSaxParser({'startDoc':function(_){stack=[];ignoring=false;},'startTag':function(tagName,attribs,out){if(ignoring){return;}if(!html4
.ELEMENTS.hasOwnProperty(tagName)){return;}var eflags=html4 .ELEMENTS[tagName];if(eflags&html4
.eflags.FOLDABLE){return;}else if(eflags&html4 .eflags.UNSAFE){ignoring=!(eflags&html4
.eflags.EMPTY);return;}attribs=sanitizeAttributes(tagName,attribs);if(attribs){if(!(eflags&html4
.eflags.EMPTY)){stack.push(tagName);}out.push('<',tagName);for(var i=0,n=attribs.length;i<n;i+=2){var
attribName=attribs[i],value=attribs[i+1];if(value!==null&&value!==void 0){out.push(' ',attribName,'=\"',htmlSanitizer.escapeAttrib(value),'\"');}}out.push('>');}},'endTag':function(tagName,out){if(ignoring){ignoring=false;return;}if(!html4
.ELEMENTS.hasOwnProperty(tagName)){return;}var eflags=html4 .ELEMENTS[tagName];if(!(eflags&(html4
.eflags.UNSAFE|html4 .eflags.EMPTY|html4 .eflags.FOLDABLE))){var index;if(eflags&html4
.eflags.OPTIONAL_ENDTAG){for(index=stack.length;--index>=0;){var stackEl=stack[index];if(stackEl===tagName){break;}if(!(html4
.ELEMENTS[stackEl]&html4 .eflags.OPTIONAL_ENDTAG)){return;}}}else{for(index=stack.length;--index>=0;){if(stack[index]===tagName){break;}}}if(index<0){return;}for(var
i=stack.length;--i>index;){var stackEl=stack[i];if(!(html4 .ELEMENTS[stackEl]&html4
.eflags.OPTIONAL_ENDTAG)){out.push('</',stackEl,'>');}}stack.length=index;out.push('</',tagName,'>');}},'pcdata':function(text,out){if(!ignoring){out.push(text);}},'rcdata':function(text,out){if(!ignoring){out.push(text);}},'cdata':function(text,out){if(!ignoring){out.push(text);}},'endDoc':function(out){for(var
i=stack.length;--i>=0;){out.push('</',stack[i],'>');}stack.length=0;}});};function
html_sanitize(htmlText,opt_urlPolicy,opt_nmTokenPolicy){var out=[];htmlSanitizer.makeHtmlSanitizer(function
sanitizeAttribs(tagName,attribs){for(var i=0;i<attribs.length;i+=2){var attribName=attribs[i];var
value=attribs[i+1];var atype=null,attribKey;if((attribKey=tagName+':'+attribName,html4
.ATTRIBS.hasOwnProperty(attribKey))||(attribKey='*:'+attribName,html4 .ATTRIBS.hasOwnProperty(attribKey))){atype=html4
.ATTRIBS[attribKey];}if(atype!==null){switch(atype){case html4 .atype.SCRIPT:;case
html4 .atype.STYLE:value=null;case html4 .atype.IDREF:;case html4 .atype.IDREFS:;case
html4 .atype.GLOBAL_NAME:;case html4 .atype.LOCAL_NAME:;case html4 .atype.CLASSES:{value=opt_nmTokenPolicy?opt_nmTokenPolicy(value):value;break;}case
html4 .atype.URI:{value=opt_urlPolicy&&opt_urlPolicy(value);break;}}}else{value=null;}attribs[i+1]=value;}return attribs;})(htmlText,out);return out.join('');}}}


/*
Uniform v1.7.5
Copyright © 2009 Josh Pyles / Pixelmatrix Design LLC
http://pixelmatrixdesign.com

Requires jQuery 1.4 or newer

Much thanks to Thomas Reynolds and Buck Wilson for their help and advice on this

Disabling text selection is made possible by Mathias Bynens <http://mathiasbynens.be/>
and his noSelect plugin. <http://github.com/mathiasbynens/noSelect-jQuery-Plugin>

Also, thanks to David Kaneda and Eugene Bond for their contributions to the plugin

License:
MIT License - http://www.opensource.org/licenses/mit-license.php
*/
(function(a){a.uniform={options:{selectClass:"selector",radioClass:"radio",checkboxClass:"checker",fileClass:"uploader",filenameClass:"filename",fileBtnClass:"action",fileDefaultText:"No file selected",fileBtnText:"Choose File",checkedClass:"checked",focusClass:"focus",disabledClass:"disabled",buttonClass:"button",activeClass:"active",hoverClass:"hover",useID:true,idPrefix:"uniform",resetSelector:false,autoHide:true},elements:[]};if(a.browser.msie&&a.browser.version<7){a.support.selectOpacity=false}else{a.support.selectOpacity=true}a.fn.uniform=function(k){k=a.extend(a.uniform.options,k);var d=this;if(k.resetSelector!=false){a(k.resetSelector).mouseup(function(){function l(){a.uniform.update(d)}setTimeout(l,10)})}function j(l){$el=a(l);$el.addClass($el.attr("type"));b(l)}function g(l){a(l).addClass("uniform");b(l)}function i(o){var m=a(o);var p=a("<div>"),l=a("<span>");p.addClass(k.buttonClass);if(k.useID&&m.attr("id")!=""){p.attr("id",k.idPrefix+"-"+m.attr("id"))}var n;if(m.is("a")||m.is("button")){n=m.text()}else{if(m.is(":submit")||m.is(":reset")||m.is("input[type=button]")){n=m.attr("value")}}n=n==""?m.is(":reset")?"Reset":"Submit":n;l.html(n);m.css("opacity",0);m.wrap(p);m.wrap(l);p=m.closest("div");l=m.closest("span");if(m.is(":disabled")){p.addClass(k.disabledClass)}p.bind({"mouseenter.uniform":function(){p.addClass(k.hoverClass)},"mouseleave.uniform":function(){p.removeClass(k.hoverClass);p.removeClass(k.activeClass)},"mousedown.uniform touchbegin.uniform":function(){p.addClass(k.activeClass)},"mouseup.uniform touchend.uniform":function(){p.removeClass(k.activeClass)},"click.uniform touchend.uniform":function(r){if(a(r.target).is("span")||a(r.target).is("div")){if(o[0].dispatchEvent){var q=document.createEvent("MouseEvents");q.initEvent("click",true,true);o[0].dispatchEvent(q)}else{o[0].click()}}}});o.bind({"focus.uniform":function(){p.addClass(k.focusClass)},"blur.uniform":function(){p.removeClass(k.focusClass)}});a.uniform.noSelect(p);b(o)}function e(o){var m=a(o);var p=a("<div />"),l=a("<span />");if(!m.css("display")=="none"&&k.autoHide){p.hide()}p.addClass(k.selectClass);if(k.useID&&o.attr("id")!=""){p.attr("id",k.idPrefix+"-"+o.attr("id"))}var n=o.find(":selected:first");if(n.length==0){n=o.find("option:first")}l.html(n.html());o.css("opacity",0);o.wrap(p);o.before(l);p=o.parent("div");l=o.siblings("span");o.bind({"change.uniform":function(){l.text(o.find(":selected").html());p.removeClass(k.activeClass)},"focus.uniform":function(){p.addClass(k.focusClass)},"blur.uniform":function(){p.removeClass(k.focusClass);p.removeClass(k.activeClass)},"mousedown.uniform touchbegin.uniform":function(){p.addClass(k.activeClass)},"mouseup.uniform touchend.uniform":function(){p.removeClass(k.activeClass)},"click.uniform touchend.uniform":function(){p.removeClass(k.activeClass)},"mouseenter.uniform":function(){p.addClass(k.hoverClass)},"mouseleave.uniform":function(){p.removeClass(k.hoverClass);p.removeClass(k.activeClass)},"keyup.uniform":function(){l.text(o.find(":selected").html())}});if(a(o).attr("disabled")){p.addClass(k.disabledClass)}a.uniform.noSelect(l);b(o)}function f(n){var m=a(n);var o=a("<div />"),l=a("<span />");if(!m.css("display")=="none"&&k.autoHide){o.hide()}o.addClass(k.checkboxClass);if(k.useID&&n.attr("id")!=""){o.attr("id",k.idPrefix+"-"+n.attr("id"))}a(n).wrap(o);a(n).wrap(l);l=n.parent();o=l.parent();a(n).css("opacity",0).bind({"focus.uniform":function(){o.addClass(k.focusClass)},"blur.uniform":function(){o.removeClass(k.focusClass)},"click.uniform touchend.uniform":function(){if(!a(n).attr("checked")){l.removeClass(k.checkedClass)}else{l.addClass(k.checkedClass)}},"mousedown.uniform touchbegin.uniform":function(){o.addClass(k.activeClass)},"mouseup.uniform touchend.uniform":function(){o.removeClass(k.activeClass)},"mouseenter.uniform":function(){o.addClass(k.hoverClass)},"mouseleave.uniform":function(){o.removeClass(k.hoverClass);o.removeClass(k.activeClass)}});if(a(n).attr("checked")){l.addClass(k.checkedClass)}if(a(n).attr("disabled")){o.addClass(k.disabledClass)}b(n)}function c(n){var m=a(n);var o=a("<div />"),l=a("<span />");if(!m.css("display")=="none"&&k.autoHide){o.hide()}o.addClass(k.radioClass);if(k.useID&&n.attr("id")!=""){o.attr("id",k.idPrefix+"-"+n.attr("id"))}a(n).wrap(o);a(n).wrap(l);l=n.parent();o=l.parent();a(n).css("opacity",0).bind({"focus.uniform":function(){o.addClass(k.focusClass)},"blur.uniform":function(){o.removeClass(k.focusClass)},"click.uniform touchend.uniform":function(){if(!a(n).attr("checked")){l.removeClass(k.checkedClass)}else{var p=k.radioClass.split(" ")[0];a("."+p+" span."+k.checkedClass+":has([name='"+a(n).attr("name")+"'])").removeClass(k.checkedClass);l.addClass(k.checkedClass)}},"mousedown.uniform touchend.uniform":function(){if(!a(n).is(":disabled")){o.addClass(k.activeClass)}},"mouseup.uniform touchbegin.uniform":function(){o.removeClass(k.activeClass)},"mouseenter.uniform touchend.uniform":function(){o.addClass(k.hoverClass)},"mouseleave.uniform":function(){o.removeClass(k.hoverClass);o.removeClass(k.activeClass)}});if(a(n).attr("checked")){l.addClass(k.checkedClass)}if(a(n).attr("disabled")){o.addClass(k.disabledClass)}b(n)}function h(q){var o=a(q);var r=a("<div />"),p=a("<span>"+k.fileDefaultText+"</span>"),m=a("<span>"+k.fileBtnText+"</span>");if(!o.css("display")=="none"&&k.autoHide){r.hide()}r.addClass(k.fileClass);p.addClass(k.filenameClass);m.addClass(k.fileBtnClass);if(k.useID&&o.attr("id")!=""){r.attr("id",k.idPrefix+"-"+o.attr("id"))}o.wrap(r);o.after(m);o.after(p);r=o.closest("div");p=o.siblings("."+k.filenameClass);m=o.siblings("."+k.fileBtnClass);if(!o.attr("size")){var l=r.width();o.attr("size",l/10)}var n=function(){var s=o.val();if(s===""){s=k.fileDefaultText}else{s=s.split(/[\/\\]+/);s=s[(s.length-1)]}p.text(s)};n();o.css("opacity",0).bind({"focus.uniform":function(){r.addClass(k.focusClass)},"blur.uniform":function(){r.removeClass(k.focusClass)},"mousedown.uniform":function(){if(!a(q).is(":disabled")){r.addClass(k.activeClass)}},"mouseup.uniform":function(){r.removeClass(k.activeClass)},"mouseenter.uniform":function(){r.addClass(k.hoverClass)},"mouseleave.uniform":function(){r.removeClass(k.hoverClass);r.removeClass(k.activeClass)}});if(a.browser.msie){o.bind("click.uniform.ie7",function(){setTimeout(n,0)})}else{o.bind("change.uniform",n)}if(o.attr("disabled")){r.addClass(k.disabledClass)}a.uniform.noSelect(p);a.uniform.noSelect(m);b(q)}a.uniform.restore=function(l){if(l==undefined){l=a(a.uniform.elements)}a(l).each(function(){if(a(this).is(":checkbox")){a(this).unwrap().unwrap()}else{if(a(this).is("select")){a(this).siblings("span").remove();a(this).unwrap()}else{if(a(this).is(":radio")){a(this).unwrap().unwrap()}else{if(a(this).is(":file")){a(this).siblings("span").remove();a(this).unwrap()}else{if(a(this).is("button, :submit, :reset, a, input[type='button']")){a(this).unwrap().unwrap()}}}}}a(this).unbind(".uniform");a(this).css("opacity","1");var m=a.inArray(a(l),a.uniform.elements);a.uniform.elements.splice(m,1)})};function b(l){l=a(l).get();if(l.length>1){a.each(l,function(m,n){a.uniform.elements.push(n)})}else{a.uniform.elements.push(l)}}a.uniform.noSelect=function(l){function m(){return false}a(l).each(function(){this.onselectstart=this.ondragstart=m;a(this).mousedown(m).css({MozUserSelect:"none"})})};a.uniform.update=function(l){if(l==undefined){l=a(a.uniform.elements)}l=a(l);l.each(function(){var n=a(this);if(n.is("select")){var m=n.siblings("span");var p=n.parent("div");p.removeClass(k.hoverClass+" "+k.focusClass+" "+k.activeClass);m.html(n.find(":selected").html());if(n.is(":disabled")){p.addClass(k.disabledClass)}else{p.removeClass(k.disabledClass)}}else{if(n.is(":checkbox")){var m=n.closest("span");var p=n.closest("div");p.removeClass(k.hoverClass+" "+k.focusClass+" "+k.activeClass);m.removeClass(k.checkedClass);if(n.is(":checked")){m.addClass(k.checkedClass)}if(n.is(":disabled")){p.addClass(k.disabledClass)}else{p.removeClass(k.disabledClass)}}else{if(n.is(":radio")){var m=n.closest("span");var p=n.closest("div");p.removeClass(k.hoverClass+" "+k.focusClass+" "+k.activeClass);m.removeClass(k.checkedClass);if(n.is(":checked")){m.addClass(k.checkedClass)}if(n.is(":disabled")){p.addClass(k.disabledClass)}else{p.removeClass(k.disabledClass)}}else{if(n.is(":file")){var p=n.parent("div");var o=n.siblings(k.filenameClass);btnTag=n.siblings(k.fileBtnClass);p.removeClass(k.hoverClass+" "+k.focusClass+" "+k.activeClass);o.text(n.val());if(n.is(":disabled")){p.addClass(k.disabledClass)}else{p.removeClass(k.disabledClass)}}else{if(n.is(":submit")||n.is(":reset")||n.is("button")||n.is("a")||l.is("input[type=button]")){var p=n.closest("div");p.removeClass(k.hoverClass+" "+k.focusClass+" "+k.activeClass);if(n.is(":disabled")){p.addClass(k.disabledClass)}else{p.removeClass(k.disabledClass)}}}}}}})};return this.each(function(){if(a.support.selectOpacity){var l=a(this);if(l.is("select")){if(l.attr("multiple")!=true){if(l.attr("size")==undefined||l.attr("size")<=1){e(l)}}}else{if(l.is(":checkbox")){f(l)}else{if(l.is(":radio")){c(l)}else{if(l.is(":file")){h(l)}else{if(l.is(":text, :password, input[type='email']")){j(l)}else{if(l.is("textarea")){g(l)}else{if(l.is("a")||l.is(":submit")||l.is(":reset")||l.is("button")||l.is("input[type=button]")){i(l)}}}}}}}}})}})(jQuery);
