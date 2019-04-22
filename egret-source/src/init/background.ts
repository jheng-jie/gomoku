// TypeScript file

class background extends egret.DisplayObjectContainer {
    private timeOnEnterFrame:number = 0;
    private html:HTMLHtmlElement;
    private body:HTMLBodyElement;
    private htmlStyle:CSSStyleDeclaration;
    private count:number;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
        this.timeOnEnterFrame = egret.getTimer();

        this.html = document.getElementsByTagName("html")[0];
        this.body = document.getElementsByTagName("body")[0];

        this.htmlStyle = this.html.style;
        this.htmlStyle.backgroundColor = "transparent";
        this.body.style.backgroundColor = "transparent";

        var url:string = "resource/assets/bg.jpg";
        this.htmlStyle.backgroundImage = "url(" +url+")";
        this.count = 0;
    }

    private onEnterFrame(e:egret.Event){ 
        this.count = this.count + .3;
        this.htmlStyle.backgroundPosition = this.count+"px "+this.count+"px";
    }
}