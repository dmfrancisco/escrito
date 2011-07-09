define("ace/theme/escrito", ["require","exports","module"], function(require, exports, module) {
    var dom = require("pilot/dom");
    var cssText = "";

    // import CSS once
    dom.importCssString(cssText);

    exports.cssClass = "ace-solarized-light";
});
