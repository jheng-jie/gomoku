//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends eui.UILayer {
    protected createChildren(): void {
        super.createChildren();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        })

        // egret.lifecycle.onPause = () => {
        //     egret.ticker.pause();
        // }

        // egret.lifecycle.onResume = () => {
        //     egret.ticker.resume();
        // }

        //inject the custom material parser
        //注入自定义的素材解析器
        let assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());

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
            const loadingView = new LoadingUI();
            this.stage.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.stage.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }

    private loadTheme() {
        return new Promise((resolve, reject) => {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            let theme = new eui.Theme("resource/default.thm.json", this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, () => {
                resolve();
            }, this);

        })
    }

    private screen;
    public photon:Photon.LoadBalancing.LoadBalancingClient;
    /**
     * 创建场景界面
     * Create scene interface
     */
    protected createGameScene(): void {
        let options = {
            width : 450,
            height : 800,
            stage : this.stage,
            control : this
        };
        this.photon = new Photon.LoadBalancing.LoadBalancingClient(
            Photon.ConnectionProtocol.Wss,
            "b193785f-2283-458c-990b-436753016a88", // app id
            "1.0" // app version
        );
        this.photon.setLogLevel(Exitgames.Common.Logger.Level.OFF);
        this.photon.onOperationResponse = (errorCode, errorMsg, code, content) => {
            this.onOperationResponse(errorCode, errorMsg, code, content);
        };
        this.photon.onError = function(){
            this.onOperationResponse(0,0,-1,false);
        };
        this.screen = {
            login: new login(options),
            lobby: new lobby(options),
            room: new room(options),
            loading: new loading(options),
        };
        // this.screen.login.setEnabled(true);
        this.login({
            name: Math.random().toFixed(4).toString(),
            face: Math.floor(Math.random()*5)
        });
    }

    private onOperationResponse(errorCode, errorMsg, code, content){
        switch(code){
            case -1:
                this.screen.loading.setEnabled(false);
                this.screen.lobby.setEnabled(false);
                this.screen.room.setEnabled(false);
                this.screen.login.setEnabled(true);
                break;
            case 226: /* 加入房间 */
            case 227: /* 房间 */
                this.screen.loading.setEnabled(false);
                if(errorCode != 0){
                    /* 错误 */
                    this.screen.lobby.setEnabled(true);
                    return;
                }
                if(this.photon.state === 8){
                    /* 成功 */
                    this.screen.room.setEnabled(true);
                }
                break;
            case 229: /* 大厅 */
                this.screen.loading.setEnabled(false);
                this.screen.lobby.setEnabled(true);
                break;
        }
    };

    /* 登入 */
    public login(params){
        this.screen.login.setEnabled(false);
        this.screen.loading.setEnabled(true);
        this.photon.myActor().setName(params.name);
        this.photon.myActor().setCustomProperties({
            face : params.face,
            status : 0
        });
        if(!this.photon.isConnectedToMaster())
            this.photon.connectToRegionMaster("asia");
    }

    /* 登出 */
    public logout(){
        this.photon.disconnect();
        this.screen.lobby.setEnabled(false);
        /* 登入画面 */
        this.screen.login.setEnabled(true);
    }

    /* 建立房間 */
    public createRoom(){
        /* screen */
        this.screen.loading.setEnabled(true);
        this.screen.lobby.setEnabled(false);
        /* 创建 */
        this.photon.createRoom(Math.random().toString(),{
            maxPlayers: 2,
            customGameProperties:{
                name:this.photon.myActor().name
            }
        });
    }

    /* 加入房間 */
    public joinRoom(roomID){
        if(!this.photon.isInLobby())
            return;
        /* loading */
        this.screen.loading.setEnabled(true);
        this.screen.lobby.setEnabled(false);
        /* 加入 */
        this.photon.joinRoom(roomID);
    }

    public leaveRoom(){
        if(!this.photon.isJoinedToRoom())
            return;
        /* screen */
        this.screen.loading.setEnabled(true);
        this.screen.room.setEnabled(false);
        this.photon.leaveRoom();
    }

    /* 訊息 */
    public alert(options){
        if(window.swal){
            window.swal.fire(options);
        }else{
            alert(options.text || options.title);
        }
    }
}
