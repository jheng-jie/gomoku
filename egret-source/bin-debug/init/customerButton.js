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
var customerButton = (function (_super) {
    __extends(customerButton, _super);
    function customerButton(options) {
        var _this = _super.call(this) || this;
        // private group:eui.Group = new eui.Group();
        _this.text = new egret.TextField();
        _this.background = new egret.Shape();
        _this.backgroundColor = 0xF6AF38;
        _this.backgroundTouchColor = 0x666666;
        _this.w = options.width || 120;
        _this.h = options.height || 60;
        _this.x = options.x || 0;
        _this.y = options.y || 0;
        _this.id = options.id || "";
        /* button background */
        _this.background.graphics.beginFill(_this.backgroundColor);
        _this.background.graphics.drawRect(_this.w * -.5, _this.h * -.5, _this.w, _this.h);
        _this.background.graphics.endFill();
        _this.addChild(_this.background);
        /* button text */
        _this.text.text = options.text || "";
        _this.text.width = _this.w;
        _this.text.height = _this.h;
        _this.text.x = _this.w * -.5;
        _this.text.y = _this.h * -.5;
        _this.text.size = options.size || 20;
        _this.text.verticalAlign = egret.VerticalAlign.MIDDLE;
        _this.text.textAlign = egret.HorizontalAlign.CENTER;
        _this.addChild(_this.text);
        return _this;
    }
    customerButton.prototype.touchEvent = function (e) {
        switch (e.type) {
            case "touchBegin":
                this.background.graphics.clear();
                this.background.graphics.beginFill(this.backgroundTouchColor);
                this.background.graphics.drawRect(this.w * -.5, this.h * -.5, this.w, this.h);
                this.background.graphics.endFill();
                break;
            case "touchEnd":
                this.background.graphics.clear();
                this.background.graphics.beginFill(this.backgroundColor);
                this.background.graphics.drawRect(this.w * -.5, this.h * -.5, this.w, this.h);
                this.background.graphics.endFill();
                break;
        }
    };
    return customerButton;
}(eui.Group));
__reflect(customerButton.prototype, "customerButton");
//# sourceMappingURL=customerButton.js.map