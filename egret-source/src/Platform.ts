/** 
 * 平台数据接口。
 * 由于每款游戏通常需要发布到多个平台上，所以提取出一个统一的接口用于开发者获取平台数据信息
 * 推荐开发者通过这种方式封装平台逻辑，以保证整体结构的稳定
 * 由于不同平台的接口形式各有不同，白鹭推荐开发者将所有接口封装为基于 Promise 的异步形式
 */
declare interface Platform {
    webSocket:egret.WebSocket;
    connect(options:any): Promise<any>
}

class gamePlatform implements Platform {
    public webSocket:egret.WebSocket;
    public face:number = 0;
    public name:string = "";
    public uuid:string;
    public constructor() {
        // this.webSocket = new egret.WebSocket();
    }
    public receiveMessage;
    async connect(options) {
        this.webSocket = new egret.WebSocket();
        this.webSocket.addEventListener(egret.ProgressEvent.SOCKET_DATA, this.socketReceiveMessage, this);                            
        this.webSocket.addEventListener(egret.Event.CONNECT, options.success, this);  
        this.webSocket.addEventListener(egret.Event.CLOSE, function(){
            platform.alert({
                title:"連線錯誤",
                type:"error"
            });
            options.fail();
        }, this);
        let url = options.url || "192.168.8.78:32767";
        this.webSocket.connectByUrl("wss://"+url);
    }
    async socketSendMessage(options) {
        this.webSocket.writeUTF(JSON.stringify(options));
    }
    async socketReceiveMessage() {
        var msg = this.webSocket.readUTF();
        if(this.receiveMessage){
            this.receiveMessage(JSON.parse(msg));
        }
    }
    public setData(options){
        options.face && (this.face = options.face);
        options.name && (this.name = options.name);
    }
    public alert(options){
        if(window.swal){
            window.swal.fire(options);
        }else{
            alert(options.text || options.title);
        }
    }
}
 
declare let platform: gamePlatform;

declare interface Window {
    platform: gamePlatform
}

declare interface Window {
    swal:any
}

if (!window.platform) {
    window.platform = new gamePlatform();
}





