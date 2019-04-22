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
var game = (function (_super) {
    __extends(game, _super);
    function game(controller) {
        var _this = _super.call(this) || this;
        _this.fragment = "\n        precision lowp float;\n        varying vec2 vTextureCoord;\n        varying vec4 vColor;\n        uniform sampler2D uSampler;\n        uniform vec2 center;\n        uniform vec3 params;\n        uniform float time;\n        void main()\n        {\n            vec2 uv = vTextureCoord.xy;\n            vec2 texCoord = uv;\n            float dist = distance(uv, center);\n            if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )\n            {\n                float diff = (dist - time);\n                float powDiff = 1.0 - pow(abs(diff*params.x), params.y);\n                float diffTime = diff  * powDiff;\n                vec2 diffUV = normalize(uv - center);\n                texCoord = uv + (diffUV * diffTime);\n            }\n            gl_FragColor = texture2D(uSampler, texCoord);\n        }\n    ";
        _this.vertex = "\n        attribute vec2 aVertexPosition;\n        attribute vec2 aTextureCoord;\n        attribute vec2 aColor;\n        uniform vec2 projectionVector;\n        varying vec2 vTextureCoord;\n        varying vec4 vColor;\n        const vec2 center = vec2(-1.0, 1.0);\n        void main(void) {\n            gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);\n            vTextureCoord = aTextureCoord;\n            vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);\n        }\n    ";
        _this.removeList = [];
        _this.visible = false;
        _this.controller = controller;
        _this.stageW = _this.controller.stage.stageWidth;
        _this.stageH = _this.controller.stage.stageHeight;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.createGameScene, _this);
        return _this;
    }
    game.prototype.listener = function () {
        var view = this.view;
        var method = this.show ? "addEventListener" : "removeEventListener";
        view.checkerboard[method](mouse.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
        view.checkerboard[method](egret.TouchEvent.TOUCH_END, this.onCheckerboardTouch, this);
        view.checkerboard[method](egret.TouchEvent.TOUCH_END, this.onCheckerboardTouch, this);
        view.readyButton[method](egret.TouchEvent.TOUCH_END, this.onButton, this);
        view.checkerboard.filters = this.show ? [this.filter] : [];
    };
    game.prototype.onButton = function (e) {
        switch (e.target.id) {
            case "ready":
                platform.socketSendMessage({
                    type: "game",
                    method: "ready"
                });
                break;
        }
    };
    game.prototype.onCheckerboardTouch = function (e) {
        if (this.status != 2 || !this.holder)
            return;
        var pieceAlpha = this.view.pieceAlpha;
        var x, y;
        var dis = this.distance;
        x = Math.round(pieceAlpha.x / dis);
        y = Math.round(pieceAlpha.y / dis);
        var index = y * 15 + x;
        if (this.checkerboardList[index] != 0 || x < 0 || y < 0 || x > 15 || y > 15)
            return;
        this.holder = false;
        platform.socketSendMessage({
            type: "game",
            method: "select",
            data: {
                x: x,
                y: y
            }
        });
    };
    game.prototype.onMouseMove = function (e) {
        if (this.status != 2 || !this.holder) {
            document.body.style.cursor = 'default';
            return;
        }
        var size = this.checkerboardSize * .5;
        var checkerboardX = e.target.x;
        var checkerboardY = e.target.y;
        if (e.stageX < checkerboardX - size || e.stageX > checkerboardX + size || e.stageY < checkerboardY - size || e.stageY > checkerboardY + size) {
            document.body.style.cursor = 'default';
            return;
        }
        var pieceAlpha = this.view.pieceAlpha;
        var piece = this.view.piece;
        var x = e.stageX - this.offsetX;
        var y = e.stageY - this.offsetY;
        var dis = this.distance;
        var px = Math.round(x / dis);
        var py = Math.round(y / dis);
        pieceAlpha.x = px * dis;
        pieceAlpha.y = py * dis;
        piece.x = x;
        piece.y = y;
        platform.socketSendMessage({
            type: "game",
            method: "mousemove",
            data: {
                x: x,
                y: y
            }
        });
        document.body.style.cursor = 'none';
    };
    game.prototype.setStatus = function (status, checkerboard) {
        if (checkerboard === void 0) { checkerboard = []; }
        var view = this.view;
        this.status = status;
        view.result.visible = false;
        this.resultAnimate.pause();
        switch (status) {
            case 0:
                this.holder = false;
                view.title.text = "Gomoku";
                view.readyButton.visible = true;
                view.piece.visible = false;
                this.checkerboardList = [];
                break;
            case 1:
                view.title.text = "Waiting ...";
                view.readyButton.visible = false;
                view.piece.visible = false;
                this.checkerboardList = [];
                break;
            case 7:
            case 2:
                view.readyButton.visible = false;
                view.title.text = "Playing ...";
                view.piece.visible = status == 2;
                if (status == 2) {
                    this.checkerboardList = [];
                    for (var i = 0; i < 15 * 15; i++) {
                        this.checkerboardList.push(0);
                    }
                    for (var index in this.removeList) {
                        this.view.checkerboard.removeChild(this.removeList[index]);
                    }
                    this.removeList.length = 0;
                    this.removeList = [];
                }
                else {
                    this.checkerboardList = [];
                    for (var x in checkerboard) {
                        for (var y in checkerboard[x]) {
                            var type = checkerboard[x][y];
                            if (type != 0) {
                                this.pushPiece(x, y, type);
                            }
                            this.checkerboardList.push(type);
                        }
                    }
                }
                break;
            case 5:
            case 4:
            case 3:
                this.holder = false;
                view.title.text = "Gomoku";
                view.readyButton.visible = true;
                view.piece.visible = false;
                if (status < 5) {
                    this.resultAnimate.resume();
                    view.result.texture = RES.getRes(status == 3 ? "winner_png" : "lost_png");
                    view.result.visible = true;
                }
                break;
        }
    };
    game.prototype.pushPiece = function (x, y, type) {
        this.checkerboardList[y * 15 + x] = type;
        var piece = new egret.Bitmap();
        this.removeList.push(piece);
        piece.texture = RES.getRes(type == 1 ? "black_png" : "white_png");
        piece.width = piece.height = 30;
        this.view.checkerboard.addChild(piece);
        piece.width = piece.height = 200;
        piece.anchorOffsetX = piece.anchorOffsetY = 100;
        piece.x = x * this.distance;
        piece.y = y * this.distance;
        var root = this;
        TweenMax.to(piece, 0.5, {
            anchorOffsetX: 15,
            anchorOffsetY: 15,
            width: 30,
            height: 30,
            onComplete: function () {
                root.filter.uniforms.center.x = (piece.x) / root.checkerboardSize;
                root.filter.uniforms.center.y = 1 - (piece.y) / root.checkerboardSize;
                root.filterAnimate.invalidate();
                root.filterAnimate.restart();
                root.view.checkerboard.addChild(root.view.piece);
            }
        });
    };
    game.prototype.createGameScene = function () {
        var stageW = this.stageW;
        var stageH = this.stageH;
        /* title */
        var title = new egret.TextField();
        title.text = "Gomoku";
        title.textAlign = egret.HorizontalAlign.CENTER;
        title.verticalAlign = egret.VerticalAlign.MIDDLE;
        title.width = stageW;
        title.height = 50;
        title.size = 36;
        title.x = 0;
        title.y = stageH * .2 + 10;
        title.bold = true;
        this.addChild(title);
        /* button */
        var readyButton = new customerButton({
            id: "ready",
            height: 40,
            x: stageW * .5,
            y: stageH - 35,
            text: "READY"
        });
        this.addChild(readyButton);
        /* filter test */
        /* filter */
        var filter = new egret.CustomFilter(this.vertex, this.fragment, {
            center: { x: 0.5, y: 0.5 },
            params: { x: 10, y: .5, z: 0.1 },
            time: 2
        });
        this.filter = filter;
        this.filterAnimate = TweenMax.fromTo(filter.uniforms, 1, { time: 0 }, { time: 2, delay: 0.5 });
        /* checkerboard */
        var checkerboard = new eui.Group();
        this.addChild(checkerboard);
        checkerboard.x = stageW * .5;
        this.offsetY = stageH * .2 + 70;
        this.checkerboardSize = stageH - (stageH * .2 + 140);
        this.offsetX = (stageW - this.checkerboardSize) * .5;
        var size = this.checkerboardSize;
        checkerboard.y = stageH * .2 + 70 + size * .5;
        this.distance = size / 14;
        checkerboard.anchorOffsetX = size * .5;
        checkerboard.anchorOffsetY = size * .5;
        var background = new egret.Shape();
        background.graphics.beginFill(0xf3d083, 1);
        background.graphics.lineStyle(2, 0x000000);
        background.graphics.drawRect(0, 0, size, size);
        background.graphics.endFill();
        checkerboard.addChild(background);
        var position = 14;
        var dis = size / position;
        background.graphics.lineStyle(1, 0x000000);
        for (var i = 0; i <= position; i++) {
            var x = i * dis;
            background.graphics.moveTo(x, 0);
            background.graphics.lineTo(x, size);
            background.graphics.moveTo(0, x);
            background.graphics.lineTo(size, x);
        }
        for (var c = 0; c < 5; c++) {
            background.graphics.lineStyle(0, 0x000000);
            background.graphics.beginFill(0x000000);
            var x = c == 2 ? size * .5 : dis * (3 + (c % 2 == 0 ? 0 : 8));
            var y = c == 2 ? size * .5 : dis * (3 + (c < 2 ? 0 : 8));
            background.graphics.drawCircle(x, y, 5);
            background.graphics.endFill();
        }
        var pieceAlpha = new egret.Bitmap();
        pieceAlpha.width = pieceAlpha.height = 30;
        pieceAlpha.anchorOffsetX = pieceAlpha.anchorOffsetY = 15;
        pieceAlpha.alpha = .45;
        pieceAlpha.visible = false;
        checkerboard.addChild(pieceAlpha);
        var piece = new egret.Bitmap();
        piece.width = piece.height = 36;
        piece.anchorOffsetX = piece.anchorOffsetY = 15;
        piece.visible = false;
        checkerboard.addChild(piece);
        var shp = new egret.Shape();
        shp.x = 0;
        shp.y = 0;
        shp.graphics.beginFill(0x000000);
        shp.graphics.drawRect(stageW * .5, 5, this.checkerboardSize, stageH * .2 - 10);
        shp.graphics.endFill();
        shp.anchorOffsetX = this.checkerboardSize * .5;
        shp.alpha = .2;
        this.addChild(shp);
        /* scroll view */
        this.userScroll = new userScrollview({
            width: this.checkerboardSize,
            x: stageW * .5,
            y: stageH * .1,
            height: stageH * .2
        });
        this.addChild(this.userScroll);
        /* RESULT */
        var result = new egret.Bitmap();
        result.texture = RES.getRes("winner_png");
        result.width = result.height = 330;
        result.anchorOffsetX = result.width * .5;
        result.anchorOffsetY = result.height * .5;
        this.addChild(result);
        result.x = stageW * .5;
        result.y = stageH * .2 + 70 + size * .5;
        result.visible = false;
        this.resultAnimate = new TimelineMax({ repeat: -1 });
        this.resultAnimate.add(TweenLite.to(result, .7, { scaleX: 1.1, scaleY: 1.1, ease: Elastic.easeOut.config(1, 0.3) }));
        this.resultAnimate.add(TweenLite.to(result, .7, { scaleX: 1, scaleY: 1, ease: Elastic.easeOut.config(1, 0.3) }));
        this.resultAnimate.pause();
        /* view */
        this.view = {
            checkerboard: checkerboard,
            pieceAlpha: pieceAlpha,
            piece: piece,
            readyButton: readyButton,
            title: title,
            result: result
        };
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
        Object.defineProperty(this, 'holder', {
            get: function () {
                return this._holder;
            },
            set: function (bool) {
                this._holder = bool;
                this.view.pieceAlpha.visible = bool;
                this.view.pieceAlpha.texture = RES.getRes(this.pieceType == 1 ? "black_png" : "white_png");
                var src = "black_png";
                if (bool) {
                    src = this.pieceType == 1 ? "black_png" : "white_png";
                }
                else {
                    src = this.pieceType == 2 ? "black_png" : "white_png";
                }
                // this.view.piece.x = -100;
                // this.view.piece.y = -100;
                this.originalX = this.view.piece.x;
                this.originalY = this.view.piece.y;
                this.view.piece.texture = RES.getRes(src);
            }
        });
    };
    game.prototype.userInit = function (list) {
        for (var index in list) {
            var data = list[index];
            this.userScroll.add({
                name: data.n,
                face: data.f,
                status: data.s,
                uuid: data.u
            });
        }
    };
    return game;
}(eui.Component));
__reflect(game.prototype, "game");
//# sourceMappingURL=game.js.map