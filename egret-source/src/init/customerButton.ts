// TypeScript file

class customerButton extends eui.Group{
	// private group:eui.Group = new eui.Group();
	public text:egret.TextField = new egret.TextField();
	public background = new egret.Shape();
	public backgroundColor = 0xF6AF38;
	public backgroundTouchColor = 0x666666;
	private w:number;
	private h:number;
	public id:string;
    public constructor(options) {
		super();
		this.w = options.width || 120;
		this.h = options.height || 60;
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.id = options.id || "";
        /* button background */
        this.background.graphics.beginFill(this.backgroundColor);
        this.background.graphics.drawRect(this.w*-.5,this.h*-.5,this.w,this.h);
        this.background.graphics.endFill();
        this.addChild(this.background);

        /* button text */
		this.text.text = options.text || "";
        this.text.width = this.w;
        this.text.height = this.h;
        this.text.x = this.w*-.5;
        this.text.y = this.h*-.5;
		this.text.size = options.size || 20;
        this.text.verticalAlign = egret.VerticalAlign.MIDDLE;
        this.text.textAlign = egret.HorizontalAlign.CENTER;
		this.addChild(this.text);

		return this;
    }

	public touchEvent(e) {
		switch(e.type){
			case "touchBegin":
				this.background.graphics.clear();
				this.background.graphics.beginFill(this.backgroundTouchColor);
				this.background.graphics.drawRect(this.w*-.5,this.h*-.5,this.w,this.h);
				this.background.graphics.endFill();
				break;
			case "touchEnd":
				this.background.graphics.clear();
				this.background.graphics.beginFill(this.backgroundColor);
				this.background.graphics.drawRect(this.w*-.5,this.h*-.5,this.w,this.h);
				this.background.graphics.endFill();
				break;
		}
	}

}