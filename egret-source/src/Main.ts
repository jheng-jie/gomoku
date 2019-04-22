class Main extends eui.UILayer {
    
    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.onPause = () => {
            // egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private async runGame() {
        await this.loadResource()
        this.createGameScene();
        const result = await RES.getResAsync("description_json");
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI(this.stage.stageWidth,this.stage.stageHeight);
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    /** 
     * 创建场景界面
     * Create scene interface
     */ 
    public loading:loading;
    public active:string;
    public _active:string;
    public screne;

    protected createGameScene(): void {
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;

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
            width:stageW,
            height:stageH
        });
        this.addChild(this.loading);

        this.screne = {
            login:new login(this),
            game:new game(this)
        };
        this.addChild(this.screne.login);
        this.addChild(this.screne.game);

        Object.defineProperty(this,'active',{
            get: function(){
                return this._active;
            },
            set: function(screne){
                if(this._active == screne || !this.screne[screne])
                    return;
                this._active && (this.screne[this._active].show = false);
                this._active = screne;
                this.screne[this._active].show = true;
            }
        });
        this.active = "login";
        // this.active = "game";

        // this.connection("");
    }
    public socketMessage(message){
        switch(message.type){
            case "login":
                platform.uuid = message.uuid;
                if(this.active == "game"){
                    let gameView = this.screne[this.active];
                    gameView.userInit(message.user);
                    if(message.status == 1){
                        gameView.setStatus(7,message.checkerboard);
                    }else{
                        gameView.setStatus(0);
                    }
                }
                break;
            case "user":
                if(this.active == "game"){
                    let gameView = this.screne[this.active];
                    switch(message.method){
                        case "add":
                            var data = message.data;
                            gameView.userScroll.add({
                                name:data.n,
                                face:data.f,
                                status:data.s,
                                uuid:data.u
                            });
                            break;
                        case "status":
                            for(var index in message.data){
                                var user = message.data[index];
                                gameView.userScroll.setStatus(user.uuid,user.status);
                                if(user.uuid == platform.uuid){
                                    gameView.setStatus(1);
                                }
                            }
                            break;
                        case "remove":
                            var uuid = message.data;
                            gameView.userScroll.remove(uuid);
                            break;
                    }
                }
                break;
            case "game":
                if(this.active != "game")
                    return;
                let gameView = this.screne[this.active];
                switch(message.method){
                    case "start":
                        for(var index in message.data){
                            var user = message.data[index];
                            gameView.userScroll.setStatus(user.uuid,user.status);
                        }
                        if(message.holder == platform.uuid){
                            gameView.pieceType = 1;
                            gameView.holder = true;
                        }else{
                            gameView.pieceType = 2;
                            gameView.holder = false;
                        }
                        gameView.setStatus(2);
                        break;
                    case "over":
                        for(var uid in gameView.userScroll.list){
                            var user = gameView.userScroll.list[uid];
                            gameView.userScroll.setStatus(user.uuid,0);
                        }
                        gameView.setStatus(0);
                        break;
                    case "mousemove":
                        gameView.view.piece.x = message.data.x;
                        gameView.view.piece.y = message.data.y;
                        break;
                    case "piece":
                        gameView.holder = message.data.holder == platform.uuid;
                        gameView.pushPiece(message.data.x,message.data.y,message.data.pieceType);
                        break;
                    case "finish":
                        gameView.pushPiece(message.data.x,message.data.y,message.data.pieceType);
                        gameView.userScroll.setStatus(message.data.winner,5);
                        gameView.userScroll.setStatus(message.data.loser,6);
                        if(message.data.winner == platform.uuid){
                            gameView.setStatus(3);
                        }else if(message.data.loser == platform.uuid){
                            gameView.setStatus(4);
                        }else{
                            gameView.setStatus(5);
                        }
                        break;
                    case "holder":
                        gameView.holder = message.data == platform.uuid;
                        break;
                }
                break;
        }
    }
    public connection(url){
        let root = this;
        platform.connect({
            url:url,
            success:function(){
                root.active = "game";
                root.screne[root.active].userScroll.init();
                /* socket message */
                platform.receiveMessage = function(message){
                    root.socketMessage(message);
                };
                /* send message */
                platform.socketSendMessage({
                    type:"login",
                    face:platform.face,
                    name:platform.name
                });
            },
            fail:function(){
                root.loading.show = false;
                root.active = "login";
            }
        });
    }
}

