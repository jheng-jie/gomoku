class game extends eui.Component {
    public controller:Main;
    public show:boolean;
    public view;
    public holder:boolean;
    public _holder:boolean;
    public stageW;
    public stageH;

    public constructor(controller) {
        super();

        this.visible = false;
        this.controller = controller;
        this.stageW = this.controller.stage.stageWidth;
        this.stageH = this.controller.stage.stageHeight;

        this.once(egret.Event.ADDED_TO_STAGE,this.createGameScene,this);
        return this;
    }

    public listener(){
        let view = this.view;
        let method = this.show?"addEventListener":"removeEventListener";
        view.checkerboard[method](mouse.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);

        view.checkerboard[method](egret.TouchEvent.TOUCH_END, this.onCheckerboardTouch, this);
        view.checkerboard[method](egret.TouchEvent.TOUCH_END, this.onCheckerboardTouch, this);
        view.readyButton[method](egret.TouchEvent.TOUCH_END, this.onButton, this);
        view.checkerboard.filters = this.show?[this.filter]:[];
    }
    
    public onButton(e){
        switch(e.target.id){
            case "ready":
                platform.socketSendMessage({
                    type:"game",
                    method:"ready"
                });
                break;
        }
    }

    public onCheckerboardTouch(e){
        if(this.status!=2 || !this.holder)
            return;
        let pieceAlpha = this.view.pieceAlpha;
        let x,y;
        let dis = this.distance;
        x = Math.round(pieceAlpha.x/dis);
        y = Math.round(pieceAlpha.y/dis);
        let index = y*15 + x;
        if(this.checkerboardList[index] != 0 || x < 0 || y < 0 || x > 15 || y > 15)
            return;
        
        this.holder = false;
        platform.socketSendMessage({
            type:"game",
            method:"select",
            data:{
                x:x,
                y:y
            }
        });
    }

    public onMouseMove(e){
        if(this.status!=2 || !this.holder){
            document.body.style.cursor = 'default';
            return;
        }
        let size = this.checkerboardSize*.5;
        let checkerboardX = e.target.x;
        let checkerboardY = e.target.y;
        if(e.stageX < checkerboardX - size || e.stageX > checkerboardX + size || e.stageY < checkerboardY - size || e.stageY > checkerboardY + size){
            document.body.style.cursor = 'default';
            return;
        }
        let pieceAlpha = this.view.pieceAlpha;
        let piece = this.view.piece;
        let x = e.stageX - this.offsetX;
        let y = e.stageY - this.offsetY; 
        let dis = this.distance;
        let px = Math.round(x/dis);
        let py = Math.round(y/dis);
        pieceAlpha.x = px*dis;
        pieceAlpha.y = py*dis;
        piece.x = x;
        piece.y = y;
        platform.socketSendMessage({
            type:"game",
            method:"mousemove",
            data:{
                x:x,
                y:y
            }
        });
        document.body.style.cursor = 'none';
    }
    public fragment:string = `
        precision lowp float;
        varying vec2 vTextureCoord;
        varying vec4 vColor;
        uniform sampler2D uSampler;
        uniform vec2 center;
        uniform vec3 params;
        uniform float time;
        void main()
        {
            vec2 uv = vTextureCoord.xy;
            vec2 texCoord = uv;
            float dist = distance(uv, center);
            if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )
            {
                float diff = (dist - time);
                float powDiff = 1.0 - pow(abs(diff*params.x), params.y);
                float diffTime = diff  * powDiff;
                vec2 diffUV = normalize(uv - center);
                texCoord = uv + (diffUV * diffTime);
            }
            gl_FragColor = texture2D(uSampler, texCoord);
        }
    `;
    public vertex:string = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;
        attribute vec2 aColor;
        uniform vec2 projectionVector;
        varying vec2 vTextureCoord;
        varying vec4 vColor;
        const vec2 center = vec2(-1.0, 1.0);
        void main(void) {
            gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);
            vTextureCoord = aTextureCoord;
            vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);
        }
    `;
    public filterAnimate;
    public resultAnimate;
    public filter;
    public userScroll;
    public offsetY;
    public offsetX;
    public checkerboardSize;
    public distance;
    public status;
    public pieceType:number;
    public checkerboardList:Array<number>;
    public setStatus(status,checkerboard = []){
        let view = this.view;
        this.status = status;
        view.result.visible = false;
        this.resultAnimate.pause();
        switch(status){
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
                if(status == 2){
                    this.checkerboardList = [];
                    for(var i=0;i<15*15;i++){
                        this.checkerboardList.push(0);
                    }
                    for(var index in this.removeList){
                        this.view.checkerboard.removeChild(this.removeList[index]);
                    }
                    this.removeList.length = 0;
                    this.removeList = [];
                }else{
                    this.checkerboardList = [];
                    for(var x in checkerboard){
                        for(var y in checkerboard[x]){
                            let type = checkerboard[x][y];
                            if(type != 0){
                                this.pushPiece(x,y,type);
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
                if(status < 5){
                    this.resultAnimate.resume();
                    view.result.texture = RES.getRes(status==3?"winner_png":"lost_png");
                    view.result.visible = true;
                }
                break;
        }
    }
    public removeList:Array<egret.Bitmap> = [];
    public originalX:number;
    public originalY:number;
    public pushPiece(x,y,type){
        this.checkerboardList[y*15 + x] = type;
        let piece:egret.Bitmap = new egret.Bitmap();
        this.removeList.push(piece);
        piece.texture = RES.getRes(type==1?"black_png":"white_png");
        piece.width = piece.height = 30;
        this.view.checkerboard.addChild(piece);
        piece.width = piece.height = 200;
        piece.anchorOffsetX = piece.anchorOffsetY = 100;
        piece.x = x * this.distance;
        piece.y = y * this.distance;
        var root = this;
        TweenMax.to(piece, 0.5,{
            anchorOffsetX:15,
            anchorOffsetY:15,
            width: 30,
            height: 30,
            onComplete:function(){
                root.filter.uniforms.center.x = (piece.x)/root.checkerboardSize;
                root.filter.uniforms.center.y = 1 - (piece.y)/root.checkerboardSize;
                root.filterAnimate.invalidate();
                root.filterAnimate.restart();
                root.view.checkerboard.addChild(root.view.piece);
            }
        });
    }
    private createGameScene(){
        let stageW = this.stageW;
        let stageH = this.stageH;

        /* title */
        let title = new egret.TextField();
        title.text = "Gomoku";
        title.textAlign = egret.HorizontalAlign.CENTER;
        title.verticalAlign = egret.VerticalAlign.MIDDLE;
        title.width = stageW;
        title.height = 50;
        title.size = 36;
        title.x = 0;
        title.y = stageH*.2 + 10;
        title.bold = true;
        this.addChild(title);

        /* button */
        let readyButton = new customerButton({
            id:"ready",
            height:40,
            x:stageW*.5,
            y:stageH - 35,
            text:"READY"
        });
        this.addChild(readyButton);

        /* filter test */
        /* filter */
        let filter = new egret.CustomFilter(
            this.vertex,
            this.fragment,
            {
                center: { x: 0.5, y: 0.5 },
                params: { x: 10, y: .5, z: 0.1 },
                time: 2
            }
        );
        this.filter = filter;
        this.filterAnimate = TweenMax.fromTo(filter.uniforms, 1, {time:0}, {time:2, delay:0.5});

        
        /* checkerboard */
        let checkerboard = new eui.Group();

        this.addChild(checkerboard);
        checkerboard.x = stageW*.5;
        this.offsetY = stageH*.2 + 70;
        this.checkerboardSize = stageH - (stageH*.2 + 140);
        this.offsetX = (stageW - this.checkerboardSize)*.5;
        let size = this.checkerboardSize;
        checkerboard.y = stageH*.2 + 70 + size * .5;
        this.distance = size/14;
        
        checkerboard.anchorOffsetX = size*.5;
        checkerboard.anchorOffsetY = size*.5;

        let background:egret.Shape = new egret.Shape();
        background.graphics.beginFill(0xf3d083,1);
        background.graphics.lineStyle(2,0x000000);
        background.graphics.drawRect(0,0,size,size);
        background.graphics.endFill();
        checkerboard.addChild(background);

        let position = 14;
        let dis = size/position;
        background.graphics.lineStyle(1,0x000000);
        for(let i=0;i<=position;i++){
            let x = i*dis;
            background.graphics.moveTo(x,0);
            background.graphics.lineTo(x,size);
            background.graphics.moveTo(0,x);
            background.graphics.lineTo(size,x);
        }
        for(let c=0;c<5;c++){
            background.graphics.lineStyle(0,0x000000);
            background.graphics.beginFill(0x000000);
            let x = c==2?size*.5:dis*(3 + (c%2==0?0:8));
            let y = c==2?size*.5:dis*(3 + (c<2?0:8));
            background.graphics.drawCircle(x,y, 5);
            background.graphics.endFill();
        }

        let pieceAlpha:egret.Bitmap = new egret.Bitmap();
        pieceAlpha.width = pieceAlpha.height = 30;
        pieceAlpha.anchorOffsetX = pieceAlpha.anchorOffsetY = 15;
        pieceAlpha.alpha = .45;
        pieceAlpha.visible = false;
        checkerboard.addChild(pieceAlpha);

        let piece:egret.Bitmap = new egret.Bitmap();
        piece.width = piece.height = 36;
        piece.anchorOffsetX = piece.anchorOffsetY = 15;
        piece.visible = false;
        checkerboard.addChild(piece);


        let shp:egret.Shape = new egret.Shape();
        shp.x = 0;
        shp.y = 0;
        shp.graphics.beginFill(0x000000);
        shp.graphics.drawRect(stageW*.5, 5,this.checkerboardSize, stageH*.2 - 10);
        shp.graphics.endFill();
        shp.anchorOffsetX = this.checkerboardSize*.5;
        shp.alpha = .2;
        this.addChild(shp);
        
        /* scroll view */
        this.userScroll = new userScrollview({
            width: this.checkerboardSize,
            x: stageW*.5,
            y: stageH*.1,
            height: stageH*.2
        });
        this.addChild(this.userScroll);

        /* RESULT */
        let result:egret.Bitmap = new egret.Bitmap();
        result.texture = RES.getRes("winner_png");
        result.width = result.height = 330;
        result.anchorOffsetX = result.width*.5;
        result.anchorOffsetY = result.height*.5;
        this.addChild(result);
        result.x = stageW*.5;
        result.y = stageH*.2 + 70 + size * .5;
        result.visible = false;
        this.resultAnimate = new TimelineMax({repeat:-1});
        this.resultAnimate.add(TweenLite.to(result, .7, {scaleX:1.1,scaleY:1.1,ease: Elastic.easeOut.config(1, 0.3)}));
        this.resultAnimate.add(TweenLite.to(result, .7, {scaleX:1,scaleY:1,ease: Elastic.easeOut.config(1, 0.3)}));
        this.resultAnimate.pause();

        /* view */
        this.view = {
            checkerboard:checkerboard,
            pieceAlpha:pieceAlpha,
            piece:piece,
            readyButton:readyButton,
            title:title,
            result:result
        };
        Object.defineProperty(this,'show',{
            get: function() { 
                return this.visible;
            },
            set: function(bool:boolean){
                if(this.visible == bool)
                    return;
                let from = bool?this.stageW:0;
                let to = bool?0:-this.stageW;
                this.x = from;
                if(bool){
                    this.visible = bool;
                    TweenMax.to(this,1,{x:to,onComplete:function(){
                        this.target.listener();
                    }});
                }else{
                    this.listener();
                    TweenMax.to(this,1,{x:to,onComplete:function(){
                        this.target.visible = false;
                    }});
                }
            }
        });

        Object.defineProperty(this,'holder',{
            get: function() { 
                return this._holder;
            },
            set: function(bool:boolean){
                this._holder = bool;
                this.view.pieceAlpha.visible = bool;
                this.view.pieceAlpha.texture = RES.getRes(this.pieceType==1?"black_png":"white_png");
                let src = "black_png";
                if(bool){
                    src = this.pieceType==1?"black_png":"white_png";
                }else{
                    src = this.pieceType==2?"black_png":"white_png";
                }
                // this.view.piece.x = -100;
                // this.view.piece.y = -100;
                this.originalX = this.view.piece.x;
                this.originalY = this.view.piece.y;
                this.view.piece.texture = RES.getRes(src);
            }
        });
    }

    public userInit(list){
        for(let index in list){
            let data = list[index];
            this.userScroll.add({
                name:data.n,
                face:data.f,
                status:data.s,
                uuid:data.u
            });
        }
    }
}