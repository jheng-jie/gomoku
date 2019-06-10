abstract class gameScreen extends eui.Component {
	public stageW:number;
	public stageH:number;
	public active:boolean;
	private animate:TweenMax;
	private complete:Function;
	public control;

	public constructor(options) {
		super();
		this.stageW = options.width || 0;
		this.stageH = options.height || 0;
		this.visible = false;
		this.active = false;
		this.control = options.control;
		this.complete = () => {
			this.onComplete();
		};
	}
	public setEnabled(boolean){
		if(this.active == boolean)
			return;
		this.active = boolean;
		if(this.animate)
			this.animate.kill();
		if(boolean){
			this.visible = true;
			this.x = this.stageW;
			this.animate = TweenMax.to(this,1,{x:0,onComplete:this.complete});
		}else{
			this.offListener();
			this.animate = TweenMax.to(this,1,{x:this.stageW*-1,onComplete:this.complete});
		}
	}
	private onComplete(){
		if(this.active){
			this.onListener();
		}else{
			this.visible = false;
		}
	}
	protected abstract onListener();
	protected abstract offListener();
}