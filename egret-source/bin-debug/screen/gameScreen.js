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
var gameScreen = (function (_super) {
    __extends(gameScreen, _super);
    function gameScreen(options) {
        var _this = _super.call(this) || this;
        _this.stageW = options.width || 0;
        _this.stageH = options.height || 0;
        _this.visible = false;
        _this.active = false;
        _this.control = options.control;
        _this.complete = function () {
            _this.onComplete();
        };
        return _this;
    }
    gameScreen.prototype.setEnabled = function (boolean) {
        if (this.active == boolean)
            return;
        this.active = boolean;
        if (this.animate)
            this.animate.kill();
        if (boolean) {
            this.visible = true;
            this.x = this.stageW;
            this.animate = TweenMax.to(this, 1, { x: 0, onComplete: this.complete });
        }
        else {
            this.offListener();
            this.animate = TweenMax.to(this, 1, { x: this.stageW * -1, onComplete: this.complete });
        }
    };
    gameScreen.prototype.onComplete = function () {
        if (this.active) {
            this.onListener();
        }
        else {
            this.visible = false;
        }
    };
    return gameScreen;
}(eui.Component));
__reflect(gameScreen.prototype, "gameScreen");
//# sourceMappingURL=gameScreen.js.map