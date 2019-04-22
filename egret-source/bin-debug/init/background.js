// TypeScript file
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var background = (function (_super) {
    __extends(background, _super);
    function background() {
        var _this = _super.call(this) || this;
        _this.timeOnEnterFrame = 0;
        _this.addEventListener(egret.Event.ENTER_FRAME, _this.onEnterFrame, _this);
        _this.timeOnEnterFrame = egret.getTimer();
        _this.html = document.getElementsByTagName("html")[0];
        _this.body = document.getElementsByTagName("body")[0];
        _this.htmlStyle = _this.html.style;
        _this.htmlStyle.backgroundColor = "transparent";
        _this.body.style.backgroundColor = "transparent";
        var url = "resource/assets/bg.jpg";
        _this.htmlStyle.backgroundImage = "url(" + url + ")";
        _this.count = 0;
        return _this;
    }
    background.prototype.onEnterFrame = function (e) {
        this.count = this.count + .3;
        this.htmlStyle.backgroundPosition = this.count + "px " + this.count + "px";
    };
    return background;
}(egret.DisplayObjectContainer));
__reflect(background.prototype, "background");
//# sourceMappingURL=background.js.map