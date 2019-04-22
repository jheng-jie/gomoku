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
var login = (function (_super) {
    __extends(login, _super);
    function login(controller) {
        var _this = _super.call(this) || this;
        _this.faceStartX = 0;
        _this.faceOriginX = 0;
        _this.faceIndex = 0;
        _this.fragment = "\n        precision lowp float;\n        varying vec2 vTextureCoord;\n        varying vec4 vColor;\n        uniform sampler2D uSampler;\n        uniform vec2 center;\n        uniform vec3 params;\n        uniform float time;\n        void main()\n        {\n            vec2 uv = vTextureCoord.xy;\n            vec2 texCoord = uv;\n            float dist = distance(uv, center);\n            if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )\n            {\n                float diff = (dist - time);\n                float powDiff = 1.0 - pow(abs(diff*params.x), params.y);\n                float diffTime = diff  * powDiff;\n                vec2 diffUV = normalize(uv - center);\n                texCoord = uv + (diffUV * diffTime);\n            }\n            gl_FragColor = texture2D(uSampler, texCoord);\n        }\n    ";
        _this.vertex = "\n        attribute vec2 aVertexPosition;\n        attribute vec2 aTextureCoord;\n        attribute vec2 aColor;\n        uniform vec2 projectionVector;\n        varying vec2 vTextureCoord;\n        varying vec4 vColor;\n        const vec2 center = vec2(-1.0, 1.0);\n        void main(void) {\n            gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\n            vTextureCoord = aTextureCoord;\n            vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n        }\n    ";
        _this.visible = false;
        _this.controller = controller;
        _this.stageW = _this.controller.stage.stageWidth;
        _this.stageH = _this.controller.stage.stageHeight;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.createGameScene, _this);
        return _this;
    }
    login.prototype.createGameScene = function () {
        var stageW = this.stageW;
        var stageH = this.stageH;
        /* background */
        var background = new egret.Shape();
        background.graphics.beginFill(0x000000);
        background.graphics.drawRect(0, 0, stageW, stageH);
        background.graphics.endFill();
        background.alpha = 0;
        this.addChild(background);
        /* title */
        var title = new egret.TextField();
        title.text = "Gomoku";
        title.textAlign = egret.HorizontalAlign.CENTER;
        title.verticalAlign = egret.VerticalAlign.MIDDLE;
        title.size = 100;
        title.width = stageW;
        title.height = stageH * 0.25;
        title.x = 0;
        title.y = 0;
        title.bold = true;
        this.addChild(title);
        /* face */
        var filter = new egret.CustomFilter(this.vertex, this.fragment, {
            center: { x: 0.5, y: 0.5 },
            params: { x: 10, y: 1, z: 0.1 },
            time: 0
        });
        this.filter = filter;
        this.filterAnimate = TweenMax.fromTo(filter.uniforms, 2, { time: 0 }, { time: 2.5, delay: 0.5 });
        var iconGroup = new eui.Group();
        iconGroup.y = stageH * 0.25;
        iconGroup.x = 0;
        for (var i = 0; i < 6; i++) {
            var icon = new egret.Bitmap();
            icon.texture = RES.getRes(i + "_png");
            icon.width = icon.height = 280;
            icon.anchorOffsetX = icon.width * .5;
            icon.anchorOffsetY = icon.height * .5;
            icon.filters = [filter];
            iconGroup.addChild(icon);
            icon.x = stageW * .5 + i * stageW;
            icon.y = stageH * .2;
        }
        this.addChild(iconGroup);
        this.faceGroup = iconGroup;
        /* mask */
        var square = new egret.Shape();
        square.graphics.beginFill(0xff0000);
        square.graphics.drawRect(0, iconGroup.y, stageW, stageH * .4);
        square.graphics.endFill();
        this.addChild(square);
        iconGroup.mask = square;
        /* name label */
        var nicknameLabel = new egret.TextField();
        nicknameLabel.text = "Nickname :";
        nicknameLabel.textAlign = egret.HorizontalAlign.CENTER;
        nicknameLabel.verticalAlign = egret.VerticalAlign.MIDDLE;
        nicknameLabel.width = stageW * 0.3;
        nicknameLabel.height = stageH * 0.1;
        nicknameLabel.size = 24;
        nicknameLabel.x = 0;
        nicknameLabel.y = stageH * .7;
        nicknameLabel.bold = true;
        this.addChild(nicknameLabel);
        /* name input */
        var input = new egret.TextField();
        // input.text = "please input name";
        input.text = (Math.floor(Math.random() * 100000)).toString();
        input.width = stageW * .7;
        input.height = stageH * 0.1;
        input.x = stageW * .3;
        input.y = stageH * .7;
        input.verticalAlign = egret.VerticalAlign.MIDDLE;
        input.textAlign = egret.HorizontalAlign.CENTER;
        this.addChild(input);
        /* name input line */
        var input_line = new egret.Shape();
        input_line.graphics.lineStyle(3, 0xFFFFFF);
        input_line.graphics.moveTo(stageW * .3, stageH * .7 + 60);
        input_line.graphics.lineTo(stageW * 0.95, stageH * .7 + 60);
        this.addChild(input_line);
        /* server input */
        var inputURL = new egret.TextField();
        inputURL.text = '192.168.8.78:32767';
        inputURL.width = stageW * .7;
        inputURL.height = 40;
        inputURL.x = stageW * .3;
        inputURL.y = stageH - 40;
        inputURL.verticalAlign = egret.VerticalAlign.MIDDLE;
        inputURL.textAlign = egret.HorizontalAlign.LEFT;
        inputURL.size = 24;
        this.addChild(inputURL);
        var inputServer = new egret.TextField();
        inputServer.text = 'Socket Server : ';
        inputServer.width = stageW * .3;
        inputServer.height = 40;
        inputServer.x = 0;
        inputServer.y = stageH - 40;
        inputServer.verticalAlign = egret.VerticalAlign.MIDDLE;
        inputServer.textAlign = egret.HorizontalAlign.RIGHT;
        inputServer.size = 24;
        this.addChild(inputServer);
        /* NEXT button */
        var nextButton = new customerButton({
            x: stageW * .5,
            y: stageH * .88,
            text: "NEXT"
        });
        this.addChild(nextButton);
        /* show */
        Object.defineProperty(this, 'show', {
            get: function () {
                return this.visible;
            },
            set: function (bool) {
                if (this.visible == bool)
                    return;
                var from = bool ? this.stageW : 0;
                var to = bool ? 0 : -this.stageW;
                this.x = from;
                if (bool) {
                    this.visible = bool;
                    TweenMax.to(this, 1, { x: to, onComplete: function () {
                            this.target.listener();
                        } });
                }
                else {
                    this.listener();
                    TweenMax.to(this, 1, { x: to, onComplete: function () {
                            this.target.visible = false;
                        } });
                }
            }
        });
        this.view = {
            input: input,
            nextButton: nextButton,
            inputURL: inputURL
        };
    };
    login.prototype.listener = function () {
        var view = this.view;
        var method = this.show ? "addEventListener" : "removeEventListener";
        view.nextButton[method](egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        view.nextButton[method](egret.TouchEvent.TOUCH_END, this.onTouch, this);
        this[method](egret.TouchEvent.TOUCH_BEGIN, this.onFace, this);
        this[method](egret.TouchEvent.TOUCH_END, this.onFace, this);
        this[method](egret.TouchEvent.TOUCH_MOVE, this.onFace, this);
        view.input[method](egret.FocusEvent.FOCUS_IN, this.onInput, this);
        view.input[method](egret.FocusEvent.FOCUS_OUT, this.onInput, this);
        this.view.input.type = this.show ? egret.TextFieldType.INPUT : egret.TextFieldInputType.TEXT;
        this.view.inputURL.type = this.show ? egret.TextFieldType.INPUT : egret.TextFieldInputType.TEXT;
    };
    login.prototype.onInput = function (e) {
        switch (e.type) {
            case "focusIn":
                if (e.target.text.trim() == "please input name")
                    e.target.text = "";
                break;
            case "focusOut":
                if (e.target.text.trim() == "")
                    e.target.text = "please input name";
                else
                    e.target.text = e.target.text.trim();
                break;
        }
    };
    login.prototype.onFace = function (e) {
        var stageW = this.stageW;
        var stageH = this.stageH;
        switch (e.type) {
            case "touchBegin":
                this.faceHold = true;
                this.faceStartX = e.stageX;
                this.faceOriginX = this.faceGroup.x;
                if (this.faceAnimate) {
                    this.faceAnimate.kill();
                    this.faceAnimate = undefined;
                }
                break;
            case "touchMove":
                if (this.faceHold)
                    this.faceGroup.x = this.faceOriginX - (this.faceStartX - e.stageX) * 2;
                break;
            case "touchEnd":
                if (this.faceHold) {
                    var x = this.faceGroup.x;
                    var max = (stageW * 5 + stageW * .5);
                    if (x > 0) {
                        this.faceGroup.x = Math.min(x, stageW);
                        this.faceIndex = 0;
                    }
                    else if (x < -max) {
                        this.faceGroup.x = Math.max(x, -max);
                        this.faceIndex = 5;
                    }
                    else {
                        this.faceIndex = Math.round(Math.abs(x) / stageW);
                    }
                }
                var from = this.faceGroup.x;
                var to = this.faceIndex * -stageW;
                this.faceAnimate = TweenMax.to(this.faceGroup, Math.abs(from - to) / 250, {
                    x: to,
                    ease: Elastic.easeOut.config(1, 0.3)
                });
                this.filter.uniforms.center.x = (e.stageX - stageW * .5) / 280 + 0.5;
                this.filter.uniforms.center.y = (e.stageY - stageH * .25 - 140) / 280 + 0.5;
                // iconGroup.y = stageH*0.25; 
                // iconGroup.x = 0;
                this.filterAnimate.invalidate();
                this.filterAnimate.restart();
                this.faceHold = false;
                break;
        }
    };
    login.prototype.onTouch = function (e) {
        e.target.touchEvent(e);
        if (e.type == "touchEnd") {
            /* check */
            var name_1 = this.view.input.text;
            var error = "";
            if (name_1.length == 0 || name_1 == "please input name")
                error = "請輸入名稱";
            if (error.length > 0) {
                platform.alert({
                    title: error
                });
                return;
            }
            platform.setData({
                name: this.view.input.text,
                face: this.faceIndex
            });
            this.controller.connection(this.view.inputURL.text);
        }
    };
    return login;
}(eui.Component));
__reflect(login.prototype, "login");
//# sourceMappingURL=login.js.map