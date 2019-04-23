var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
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
var gamePlatform = (function () {
    function gamePlatform() {
        this.face = 0;
        this.name = "";
        // this.webSocket = new egret.WebSocket();
    }
    gamePlatform.prototype.connect = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            var url;
            return __generator(this, function (_a) {
                this.webSocket = new egret.WebSocket();
                this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.socketReceiveMessage, this);
                this.webSocket.addEventListener(egret.Event.CONNECT, options.success, this);
                this.webSocket.addEventListener(egret.Event.CLOSE, function () {
                    platform.alert({
                        title: "連線錯誤",
                        type: "error"
                    });
                    options.fail();
                }, this);
                url = options.url || "192.168.8.78:32767";
                this.webSocket.connectByUrl("wss://" + url);
                return [2 /*return*/];
            });
        });
    };
    gamePlatform.prototype.socketSendMessage = function (options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.webSocket.writeUTF(JSON.stringify(options));
                return [2 /*return*/];
            });
        });
    };
    gamePlatform.prototype.socketReceiveMessage = function () {
        return __awaiter(this, void 0, void 0, function () {
            var msg;
            return __generator(this, function (_a) {
                msg = this.webSocket.readUTF();
                if (this.receiveMessage) {
                    this.receiveMessage(JSON.parse(msg));
                }
                return [2 /*return*/];
            });
        });
    };
    gamePlatform.prototype.setData = function (options) {
        options.face && (this.face = options.face);
        options.name && (this.name = options.name);
    };
    gamePlatform.prototype.alert = function (options) {
        if (window.swal) {
            window.swal.fire(options);
        }
        else {
            alert(options.text || options.title);
        }
    };
    return gamePlatform;
}());
__reflect(gamePlatform.prototype, "gamePlatform", ["Platform"]);
if (!window.platform) {
    window.platform = new gamePlatform();
}
//# sourceMappingURL=Platform.js.map