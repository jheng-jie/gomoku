// TypeScript file

class userScrollview extends egret.ScrollView{
    public content:eui.Group;
    public list;

    public constructor(options) {
        super();
        this.width = options.width || 0;
        this.height = options.height || 0;
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.anchorOffsetX = this.width*.5;
        this.anchorOffsetY = this.height*.5;

        let content = new eui.Group();
        this.setContent(content);
        this.content = content;
        this.content.height = this.height*1.005;

        this.horizontalScrollPolicy = "off";
        this.list = {};
        return this;
    }

    public init(){
        for(let uuid in this.list){
            this.content.removeChild(this.list[uuid].group);
            delete this.list[uuid];
        }
        while(this.content.numChildren > 0){
            this.content.removeChild(this.content.getChildAt(0));
        }
        this.list = {};
    }

    public add(data){
        // if(this.list[data.uuid] != undefined){
        //     return;
        // }
        let item = this.createUserItem(data);
        this.list[data.uuid] = item;
        let index = Object.keys(this.list).length;
        item.group.y = Object.keys(this.list).length * 50 - 37.5;
        this.content.addChild(item.group);
        this.content.height = Math.max(index*50+12.5,this.height*1.005);
    }

    public setStatus(uuid,status){
        let item = this.list[uuid];
        if(!item)
            return;
        item.status.text = this.getStatusStr(parseInt(status));
    }

    public remove(uuid){
        let item = this.list[uuid];
        if(!item)
            return;
        this.content.removeChild(item.group);
        delete this.list[uuid];
        let index = 0;
        for(let id in this.list){
            this.list[id].group.y = ++index * 50 - 37.5;
        }
        this.content.height = index*50 + 12.5;
    }

    private createUserItem(options){
        let group = new eui.Group();
        let background:egret.Shape = new egret.Shape();
        background.graphics.beginFill(0x000000);
        background.graphics.drawRect(0,0,this.width,50);
        background.graphics.endFill();
        background.alpha = 0;
        group.addChild(background);
        /* name */
        var name:eui.Label = new eui.Label();
        name.text = options.name || "unknow";
        name.width = 175;
        name.anchorOffsetY = name.height * .5;
        name.size = 24;
        name.bold = true;
        name.x = 75;
        name.y = 25;
        group.addChild(name);
        /* status */
        var status:eui.Label = new eui.Label();
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
        let face:egret.Bitmap = new egret.Bitmap();
        face.texture = RES.getRes((options.face || 0) + "_png");
        face.width = 40;
        face.height = 40;
        face.x = 40;
        face.y = 25;
        face.anchorOffsetX = face.width*.5;
        face.anchorOffsetY = 25;
        group.addChild(face);
        /* name line */
        let line = new egret.Shape();
        line.graphics.lineStyle(2,0xFFFFFF);
        line.graphics.moveTo(75,45);
        line.graphics.lineTo(this.width - 25,45);
        group.addChild(line);
        return {
            group:group,
            status:status,
            data:options
        };
    }

    public getStatusStr(status){
        switch(status){
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
    }
}