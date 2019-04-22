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
var userScrollview = (function (_super) {
    __extends(userScrollview, _super);
    function userScrollview(options) {
        var _this = _super.call(this) || this;
        _this.width = options.width || 0;
        _this.height = options.height || 0;
        _this.x = options.x || 0;
        _this.y = options.y || 0;
        _this.anchorOffsetX = _this.width * .5;
        _this.anchorOffsetY = _this.height * .5;
        var content = new eui.Group();
        _this.setContent(content);
        _this.content = content;
        _this.content.height = _this.height * 1.005;
        _this.horizontalScrollPolicy = "off";
        _this.list = {};
        return _this;
    }
    userScrollview.prototype.init = function () {
        for (var uuid in this.list) {
            this.content.removeChild(this.list[uuid].group);
            delete this.list[uuid];
        }
        while (this.content.numChildren > 0) {
            this.content.removeChild(this.content.getChildAt(0));
        }
        this.list = {};
    };
    userScrollview.prototype.add = function (data) {
        // if(this.list[data.uuid] != undefined){
        //     return;
        // }
        var item = this.createUserItem(data);
        this.list[data.uuid] = item;
        var index = Object.keys(this.list).length;
        item.group.y = Object.keys(this.list).length * 50 - 37.5;
        this.content.addChild(item.group);
        this.content.height = Math.max(index * 50 + 12.5, this.height * 1.005);
    };
    userScrollview.prototype.setStatus = function (uuid, status) {
        var item = this.list[uuid];
        if (!item)
            return;
        item.status.text = this.getStatusStr(parseInt(status));
    };
    userScrollview.prototype.remove = function (uuid) {
        var item = this.list[uuid];
        if (!item)
            return;
        this.content.removeChild(item.group);
        delete this.list[uuid];
        var index = 0;
        for (var id in this.list) {
            this.list[id].group.y = ++index * 50 - 37.5;
        }
        this.content.height = index * 50 + 12.5;
    };
    userScrollview.prototype.createUserItem = function (options) {
        var group = new eui.Group();
        var background = new egret.Shape();
        background.graphics.beginFill(0x000000);
        background.graphics.drawRect(0, 0, this.width, 50);
        background.graphics.endFill();
        background.alpha = 0;
        group.addChild(background);
        /* name */
        var name = new eui.Label();
        name.text = options.name || "unknow";
        name.width = 175;
        name.anchorOffsetY = name.height * .5;
        name.size = 24;
        name.bold = true;
        name.x = 75;
        name.y = 25;
        group.addChild(name);
        /* status */
        var status = new eui.Label();
        status.width = 175;
        status.anchorOffsetX = 175;
        status.anchorOffsetY = name.height * .5;
        status.size = 24;
        status.bold = true;
        status.x = this.width - 25;
        status.y = 25;
        status.textAlign = "right";
        status.text = this.getStatusStr(options.status || 0);
        group.addChild(status);
        /* face */
        var face = new egret.Bitmap();
        face.texture = RES.getRes((options.face || 0) + "_png");
        face.width = 40;
        face.height = 40;
        face.x = 40;
        face.y = 25;
        face.anchorOffsetX = face.width * .5;
        face.anchorOffsetY = 25;
        group.addChild(face);
        /* name line */
        var line = new egret.Shape();
        line.graphics.lineStyle(2, 0xFFFFFF);
        line.graphics.moveTo(75, 45);
        line.graphics.lineTo(this.width - 25, 45);
        group.addChild(line);
        return {
            group: group,
            status: status,
            data: options
        };
    };
    userScrollview.prototype.getStatusStr = function (status) {
        switch (status) {
            case 0:
                return "preparing";
            case 1:
                return "ready";
            case 2:
                return "playing";
            case 3:
                return "watch";
            case 5:
                return "winner";
            case 6:
                return "loser";
        }
    };
    return userScrollview;
}(egret.ScrollView));
__reflect(userScrollview.prototype, "userScrollview");
//# sourceMappingURL=userScrollview.js.map