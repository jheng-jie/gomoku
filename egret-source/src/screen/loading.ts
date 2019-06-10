// TypeScript file

class loading extends eui.Group{
    public text:egret.TextField = new egret.TextField();
	public background = new egret.Shape();
	public stageW:number;
	public stageH:number;
    private count:number = 3;
	private animate:TweenMax;
	public active:boolean;
	private complete:Function;

    public constructor(options) {
        super();
        this.stageW = options.width || 450;
        this.stageH = options.height || 800;
		this.visible = false;
        if(options.stage)
            options.stage.addChild(this);
            
        /* background */
        this.background.graphics.beginFill(0x000000);
        this.background.graphics.drawRect(0,0,this.stageW,this.stageH);
        this.background.graphics.endFill();
        this.background.alpha = .5;
        this.addChild(this.background);

        /* text */
        this.text.text = "loading";
        this.text.width = this.stageW;
        this.text.height = this.stageH;
        this.text.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.text.textAlign = egret.HorizontalAlign.CENTER;
		this.addChild(this.text);

        this.complete = () => {
			this.onComplete();
		};

        return this;
    } 

    public setEnabled(boolean){
		if(this.active == boolean)
			return;
		this.active = boolean;
        if(this.animate)
			this.animate.kill();
		if(boolean){
            this.visible = true;
			this.addEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
            this.animate = TweenMax.to(this,.3,{alpha:1,onComplete:this.complete});
		}else{
			this.removeEventListener(egret.Event.ENTER_FRAME,this.onEnterFrame,this);
			this.animate = TweenMax.to(this,.3,{alpha:0,onComplete:this.complete});
		}
	}
    private onComplete(){
		if(this.active){

		}else{
			this.visible = false;
		}
	}
    private onEnterFrame(e:egret.Event){ 
        this.count += .1;
        this.text.text = "loading" + ".".repeat(this.count%4);
        this.count > 4 && (this.count = 0);
    }
}