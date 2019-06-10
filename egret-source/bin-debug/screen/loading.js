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
var loading = (function (_super) {
    __extends(loading, _super);
    function loading(options) {
        var _this = _super.call(this) || this;
        _this.text = new egret.TextField();
        _this.background = new egret.Shape();
        _this.count = 3;
        _this.stageW = options.width || 450;
        _this.stageH = options.height || 800;
        _this.visible = false;
        if (options.stage)
            options.stage.addChild(_this);
        /* background */
        _this.background.graphics.beginFill(0x000000);
        _this.background.graphics.drawRect(0, 0, _this.stageW, _this.stageH);
        _this.background.graphics.endFill();
        _this.background.alpha = .5;
        _this.addChild(_this.background);
        /* text */
        _this.text.text = "loading";
        _this.text.width = _this.stageW;
        _this.text.height = _this.stageH;
        _this.text.verticalAlign = egret.VerticalAlign.MIDDLE;
        _this.text.textAlign = egret.HorizontalAlign.CENTER;
        _this.addChild(_this.text);
        _this.complete = function () {
            _this.onComplete();
        };
        return _this;
    }
    loading.prototype.setEnabled = function (boolean) {
        if (this.active == boolean)
            return;
        this.active = boolean;
        if (this.animate)
            this.animate.kill();
        if (boolean) {
            this.visible = true;
            this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this.animate = TweenMax.to(this, .3, { alpha: 1, onComplete: this.complete });
        }
        else {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
            this.animate = TweenMax.to(this, .3, { alpha: 0, onComplete: this.complete });
        }
    };
    loading.prototype.onComplete = function () {
        if (this.active) {
        }
        else {
            this.visible = false;
        }
    };
    loading.prototype.onEnterFrame = function (e) {
        this.count += .1;
        this.text.text = "loading" + ".".repeat(this.count % 4);
        this.count > 4 && (this.count = 0);
    };
    return loading;
}(eui.Group));
__reflect(loading.prototype, "loading");
//# sourceMappingURL=loading.js.map