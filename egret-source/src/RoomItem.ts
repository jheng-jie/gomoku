class RoomItem extends eui.Group{
	public nameLabel:egret.TextField;
	public join:eui.Button;
	public players:egret.TextField;
	public stageW:number;
	public stageH:number;
	public roomID:string;

	public constructor(options) {
		super();
		this.stageW = options.width || 0;
		this.stageH = options.height || 0;
		if(options.parent)
			options.parent.addChild(this);
		/* name */
		this.nameLabel = ui.TextField({
			text: "name",
			size: 40,
			parent: this,
			x: 10,
			y: 10,
			width: this.stageW - 20,
			height: 100,
			textColor: 0x51362a,
			backgroundColor: 0xFFFFFF
		});
		/* players */
		this.players = ui.TextField({
			textAlign: egret.HorizontalAlign.RIGHT,
			text: "players",
			size: 28,
			parent: this,
			x: 10,
			y: 70,
			width: this.stageW - 40,
			height: 40,
			textColor: 0x51362a
		});
		/* join */
		this.join = ui.Button({
			label: "join",
			parent: this,
			width: 60,
			height: 40,
			x: 20,
			y: 60,
			skinName: "dist/resource/eui_skins/ButtonInfo.exml"
		});
		(<eui.Label>this.join.labelDisplay).size = 20;
		return this;
	}
	public setAttribute(params){
		this.roomID = params.name;
		this.nameLabel.text = params._customProperties.name;
		this.players.text = "players : " + params.playerCount;
		this.join.visible = params.isOpen && params.isVisible && params.playerCount < 2 && !params.removed;
		if(this.join["roomID"] == undefined){
			Object.defineProperty(this.join,'roomID',{
				get: function() { 
					return params.name;
				},
			});
		}
	}
	public destroy(){
		this.parent.removeChild(this);
	}
}