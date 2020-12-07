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
var RoomItem = (function (_super) {
    __extends(RoomItem, _super);
    function RoomItem(options) {
        var _this = _super.call(this) || this;
        _this.stageW = options.width || 0;
        _this.stageH = options.height || 0;
        if (options.parent)
            options.parent.addChild(_this);
        /* name */
        _this.nameLabel = ui.TextField({
            text: "name",
            size: 40,
            parent: _this,
            x: 10,
            y: 10,
            width: _this.stageW - 20,
            height: 100,
            textColor: 0x51362a,
            backgroundColor: 0xFFFFFF
        });
        /* players */
        _this.players = ui.TextField({
            textAlign: egret.HorizontalAlign.RIGHT,
            text: "players",
            size: 28,
            parent: _this,
            x: 10,
            y: 70,
            width: _this.stageW - 40,
            height: 40,
            textColor: 0x51362a
        });
        /* join */
        _this.join = ui.Button({
            label: "join",
            parent: _this,
            width: 60,
            height: 40,
            x: 20,
            y: 60,
            skinName: "dist/resource/eui_skins/ButtonInfo.exml"
        });
        _this.join.labelDisplay.size = 20;
        return _this;
    }
    RoomItem.prototype.setAttribute = function (params) {
        this.roomID = params.name;
        this.nameLabel.text = params._customProperties.name;
        this.players.text = "players : " + params.playerCount;
        this.join.visible = params.isOpen && params.isVisible && params.playerCount < 2 && !params.removed;
        if (this.join["roomID"] == undefined) {
            Object.defineProperty(this.join, 'roomID', {
                get: function () {
                    return params.name;
                },
            });
        }
    };
    RoomItem.prototype.destroy = function () {
        this.parent.removeChild(this);
    };
    return RoomItem;
}(eui.Group));
__reflect(RoomItem.prototype, "RoomItem");
//# sourceMappingURL=RoomItem.js.map