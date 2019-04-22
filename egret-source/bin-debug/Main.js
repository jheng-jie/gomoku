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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        egret.lifecycle.onPause = function () {
            // egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        this.createGameScene();
                        return [4 /*yield*/, RES.getResAsync("description_json")];
                    case 2:
                        result = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        loadingView = new LoadingUI(this.stage.stageWidth, this.stage.stageHeight);
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 2:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.createGameScene = function () {
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        mouse.enable(this.stage);
        mouse.setMouseMoveEnabled(true);
        /* window line */
        // let shp:egret.Shape = new egret.Shape();
        // shp.x = 0;
        // shp.y = 0;
        // shp.graphics.lineStyle(1, 0x00ff00);
        // shp.graphics.drawRect(0, 0, stageW -1, stageH -1);
        // shp.graphics.endFill();
        // this.addChild(shp);
        /* loading */
        this.loading = new loading({
            width: stageW,
            height: stageH
        });
        this.addChild(this.loading);
        this.screne = {
            login: new login(this),
            game: new game(this)
        };
        this.addChild(this.screne.login);
        this.addChild(this.screne.game);
        Object.defineProperty(this, 'active', {
            get: function () {
                return this._active;
            },
            set: function (screne) {
                if (this._active == screne || !this.screne[screne])
                    return;
                this._active && (this.screne[this._active].show = false);
                this._active = screne;
                this.screne[this._active].show = true;
            }
        });
        this.active = "login";
        // this.active = "game";
        // this.connection("");
    };
    Main.prototype.socketMessage = function (message) {
        switch (message.type) {
            case "login":
                platform.uuid = message.uuid;
                if (this.active == "game") {
                    var gameView_1 = this.screne[this.active];
                    gameView_1.userInit(message.user);
                    if (message.status == 1) {
                        gameView_1.setStatus(7, message.checkerboard);
                    }
                    else {
                        gameView_1.setStatus(0);
                    }
                }
                break;
            case "user":
                if (this.active == "game") {
                    var gameView_2 = this.screne[this.active];
                    switch (message.method) {
                        case "add":
                            var data = message.data;
                            gameView_2.userScroll.add({
                                name: data.n,
                                face: data.f,
                                status: data.s,
                                uuid: data.u
                            });
                            break;
                        case "status":
                            for (var index in message.data) {
                                var user = message.data[index];
                                gameView_2.userScroll.setStatus(user.uuid, user.status);
                                if (user.uuid == platform.uuid) {
                                    gameView_2.setStatus(1);
                                }
                            }
                            break;
                        case "remove":
                            var uuid = message.data;
                            gameView_2.userScroll.remove(uuid);
                            break;
                    }
                }
                break;
            case "game":
                if (this.active != "game")
                    return;
                var gameView = this.screne[this.active];
                switch (message.method) {
                    case "start":
                        for (var index in message.data) {
                            var user = message.data[index];
                            gameView.userScroll.setStatus(user.uuid, user.status);
                        }
                        if (message.holder == platform.uuid) {
                            gameView.pieceType = 1;
                            gameView.holder = true;
                        }
                        else {
                            gameView.pieceType = 2;
                            gameView.holder = false;
                        }
                        gameView.setStatus(2);
                        break;
                    case "over":
                        for (var uid in gameView.userScroll.list) {
                            var user = gameView.userScroll.list[uid];
                            gameView.userScroll.setStatus(user.uuid, 0);
                        }
                        gameView.setStatus(0);
                        break;
                    case "mousemove":
                        gameView.view.piece.x = message.data.x;
                        gameView.view.piece.y = message.data.y;
                        break;
                    case "piece":
                        gameView.holder = message.data.holder == platform.uuid;
                        gameView.pushPiece(message.data.x, message.data.y, message.data.pieceType);
                        break;
                    case "finish":
                        gameView.pushPiece(message.data.x, message.data.y, message.data.pieceType);
                        gameView.userScroll.setStatus(message.data.winner, 5);
                        gameView.userScroll.setStatus(message.data.loser, 6);
                        if (message.data.winner == platform.uuid) {
                            gameView.setStatus(3);
                        }
                        else if (message.data.loser == platform.uuid) {
                            gameView.setStatus(4);
                        }
                        else {
                            gameView.setStatus(5);
                        }
                        break;
                    case "holder":
                        gameView.holder = message.data == platform.uuid;
                        break;
                }
                break;
        }
    };
    Main.prototype.connection = function (url) {
        var root = this;
        platform.connect({
            url: url,
            success: function () {
                root.active = "game";
                root.screne[root.active].userScroll.init();
                /* socket message */
                platform.receiveMessage = function (message) {
                    root.socketMessage(message);
                };
                /* send message */
                platform.socketSendMessage({
                    type: "login",
                    face: platform.face,
                    name: platform.name
                });
            },
            fail: function () {
                root.loading.show = false;
                root.active = "login";
            }
        });
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map