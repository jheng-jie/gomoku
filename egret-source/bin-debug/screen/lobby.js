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
var lobby = (function (_super) {
    __extends(lobby, _super);
    function lobby(options) {
        var _this = _super.call(this, options) || this;
        _this.once(egret.Event.ADDED_TO_STAGE, _this.createUI, _this);
        options.stage.addChild(_this);
        /* rooms */
        var lobbyContent = _this.lobbyContent;
        _this.rooms = [];
        /* remove */
        _this.rooms.remove = function (roomID) {
            for (var i = this.length - 1; i >= 0; i--) {
                if (this[i].roomID === roomID) {
                    this[i].destroy();
                    Array.prototype.splice.call(this, i, 1);
                    break;
                }
            }
        };
        /* update */
        _this.rooms.update = function (roomInfo) {
            for (var i = 0; i < this.length; i++) {
                if (this[i].roomID === roomInfo.name) {
                    this[i].setAttribute(roomInfo);
                    return true;
                }
            }
            return false;
        };
        /* isset */
        _this.rooms.isset = function (roomID) {
            for (var i = this.length - 1; i >= 0; i--) {
                if (this[i].roomID === roomID)
                    return true;
            }
            return false;
        };
        /* photon listener */
        var LB = _this.control.photon;
        LB.onRoomListUpdate = function (rooms, roomsUpdated, roomsAdded, roomsRemoved) {
            _this.onRoomEvent(roomsAdded, roomsUpdated, roomsRemoved);
        };
        /* 当前伺服器房间列表 */
        LB.onRoomList = function (rooms) {
            _this.onRoomEvent(rooms);
        };
        return _this;
    }
    lobby.prototype.onRoomEvent = function (added, updated, removed) {
        if (updated === void 0) { updated = []; }
        if (removed === void 0) { removed = []; }
        if (removed.length > 0) {
            /* 删除 */
            for (var index in removed)
                this.rooms.remove(removed[index].name);
        }
        if (added.length > 0) {
            /* 新增 */
            for (var index in added) {
                if (!added[index].removed && !this.rooms.isset(added[index].name)) {
                    var child = new RoomItem({
                        width: this.stageW,
                        height: this.stageH,
                        parent: this.lobbyContent
                    });
                    child.setAttribute(added[index]);
                    child.join.addEventListener(egret.TouchEvent.TOUCH_END, this.onJoin, this);
                    this.rooms.push(child);
                }
            }
        }
        if (updated.length > 0) {
            /* 更新 */
            for (var index in updated) {
                if (updated[index].removed) {
                    this.rooms.remove(updated[index].name);
                    continue;
                }
                var result = this.rooms.update(updated[index]);
            }
        }
        this.renderRooms();
    };
    lobby.prototype.onJoin = function (e) {
        if (!this.active)
            return;
        this.control.joinRoom(e.target.roomID);
    };
    lobby.prototype.onListener = function () {
        this.back.addEventListener(egret.TouchEvent.TOUCH_END, this.onBack, this);
        this.create.addEventListener(egret.TouchEvent.TOUCH_END, this.onCreate, this);
        var actor = this.control.photon.myActor();
        this.nameLabel.text = actor.name;
        this.face.texture = RES.getRes(actor.getCustomProperty("face") + "_png");
        /* 格式化房間 */
        for (var index = this.rooms.length - 1; index >= 0; index--) {
            this.rooms.remove(this.rooms[index].roomID);
        }
        this.rooms.length = 0;
        var rooms = this.control.photon.availableRooms();
        this.onRoomEvent(rooms);
    };
    lobby.prototype.offListener = function () {
        this.back.removeEventListener(egret.TouchEvent.TOUCH_END, this.onBack, this);
        this.create.removeEventListener(egret.TouchEvent.TOUCH_END, this.onCreate, this);
    };
    lobby.prototype.renderRooms = function () {
        if (this.rooms.length == 0) {
            /* 沒有房間 */
            this.nilRoom.visible = true;
            this.lobbyContent.height = this.stageH * .83 - 79;
        }
        else {
            /* 有房間 */
            this.nilRoom.visible = false;
            for (var i = 0; i < this.rooms.length; i++) {
                this.rooms[i].y = i * 110;
            }
            this.lobbyContent.height = Math.max(this.stageH * .83 - 79, this.rooms.length * 110 + 10);
            this.lobbyBg.scaleY = this.lobbyContent.height / this.lobbyBg.height;
        }
    };
    /* back listener */
    lobby.prototype.onBack = function () {
        this.control.logout();
    };
    /* back listener */
    lobby.prototype.onCreate = function () {
        this.control.createRoom();
    };
    /* 建立 UI */
    lobby.prototype.createUI = function () {
        /* title */
        var title = ui.TextField({
            text: "Lobby",
            size: 70,
            parent: this,
            width: this.stageW,
            height: this.stageH * .1,
            textColor: 0x51362a
        });
        /* face */
        var size = this.stageH * .07;
        this.face = ui.Bitmap({
            texture: RES.getRes("0_png"),
            width: size,
            height: size,
            x: size * .5,
            y: this.stageH * .1 + size * .5,
            parent: this
        });
        /* name */
        this.nameLabel = ui.TextField({
            text: "name",
            size: 40,
            parent: this,
            width: this.stageW - size,
            x: size,
            height: size,
            textColor: 0x51362a,
            y: this.stageH * .1
        });
        /* name border */
        var border = ui.Line({
            parent: this,
            sx: size + 20,
            sy: this.stageH * .1 + size - 5,
            tx: this.stageW - 20,
            ty: this.stageH * .1 + size - 5,
            width: 5,
            color: 0x51362a
        });
        /* scroll background */
        var scrollBg = ui.Shape({
            rx: 0, ry: 0, rw: this.stageW, rh: this.stageH * .83 - 80,
            parent: this,
            fill: 0x000000,
            y: this.stageH * .17 + 10,
            alpha: .3
        });
        this.lobbyContent = ui.Group({
            height: this.stageH * .83 - 79
        });
        /* listener bg */
        this.lobbyBg = ui.Shape({
            rx: 0, ry: 0, rw: this.stageW, rh: this.stageH * .83 - 80,
            parent: this.lobbyContent,
            fill: 0x000000,
            alpha: 0
        });
        /* nil room */
        this.nilRoom = ui.Group({
            parent: this.lobbyContent
        });
        var nilTest = ui.TextField({
            text: "NO ROOM",
            size: 40,
            parent: this.nilRoom,
            x: 10,
            y: 10,
            width: this.stageW - 20,
            height: 100,
            textColor: 0x51362a,
            backgroundColor: 0xFFFFFF
        });
        /* lobby scrollview */
        var lobbyScrollview = new egret.ScrollView();
        lobbyScrollview.horizontalScrollPolicy = "off";
        lobbyScrollview.setContent(this.lobbyContent);
        lobbyScrollview.y = this.stageH * .17 + 10;
        lobbyScrollview.width = this.stageW;
        lobbyScrollview.height = this.stageH * .83 - 80;
        this.addChild(lobbyScrollview);
        /* button */
        this.back = ui.Button({
            label: "back",
            parent: this,
            width: 120,
            height: 50,
            x: 0,
            y: this.stageH - 60,
            skinName: "resource/eui_skins/ButtonDefault.exml"
        });
        this.create = ui.Button({
            label: "create",
            parent: this,
            width: 120,
            height: 50,
            x: this.stageW - 120,
            y: this.stageH - 60,
            skinName: "resource/eui_skins/ButtonInfo.exml"
        });
    };
    return lobby;
}(gameScreen));
__reflect(lobby.prototype, "lobby");
//# sourceMappingURL=lobby.js.map