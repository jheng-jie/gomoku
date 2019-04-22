// TypeScript file

class loading extends eui.Group{
    public text:egret.TextField = new egret.TextField();
	public background = new egret.Shape();
    private w:number;
	private h:number;
    private count:number = 3;
    public show:boolean;
    
    public constructor(options) {
        super();
        this.w = options.width || 450;
        this.h = options.height || 800;

        /* background */
        this.background.graphics.beginFill(0x000000);
        this.background.graphics.drawRect(0,0,this.w,this.h);
        this.background.graphics.endFill();
        this.background.alpha = .5;
        this.addChild(this.background);

        /* text */
        this.text.text = "loading";
        this.text.width = this.w;
        this.text.height = this.h;
        this.text.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.text.textAlign = egret.HorizontalAlign.CENTER;
		this.addChild(this.text);

        Object.defineProperty(this,'show',{
            get: function() { 
                return this.visible;
            },
            set: function(bool:boolean){
                this.visible = bool;
                if(this.visible){
                    this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
                }else{
                    this.removeEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
                }
            }
        });
        this.show = false;
        return this;
    } 
    private onEnterFrame(e:egret.Event){ 
        this.count += .1;
        this.text.text = "loading" + ".".repeat(this.count%4);
        this.count > 4 && (this.count = 0);
    }
}