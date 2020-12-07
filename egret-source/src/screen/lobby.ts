class lobby extends gameScreen{
	public rooms;

	public constructor(options) {
		super(options);
		this.once(egret.Event.ADDED_TO_STAGE,this.createUI,this);
		options.stage.addChild(this);

		/* rooms */
		let lobbyContent = this.lobbyContent;
		this.rooms = [];
		/* remove */
		this.rooms.remove = function(roomID){
			for(let i=this.length-1;i>=0;i--){
				if(this[i].roomID === roomID){
					this[i].destroy();
					Array.prototype.splice.call(this, i, 1);
					break;
				}
			}
		};
		/* update */
		this.rooms.update = function(roomInfo){
			for(let i=0;i<this.length;i++){
				if(this[i].roomID === roomInfo.name){
					this[i].setAttribute(roomInfo);
					return true;
				}
			}
			return false;
		};
		/* isset */
		this.rooms.isset = function(roomID){
			for(let i=this.length-1;i>=0;i--){
				if(this[i].roomID === roomID)
					return true;
			}
			return false;
		};
		
		/* photon listener */
		let LB = this.control.photon;
		LB.onRoomListUpdate = (rooms, roomsUpdated, roomsAdded, roomsRemoved) => {
			this.onRoomEvent(roomsAdded, roomsUpdated, roomsRemoved);
		};
		/* 当前伺服器房间列表 */
		LB.onRoomList = (rooms) => {
			this.onRoomEvent(rooms);
		};

        return this;
	}

	public onRoomEvent(added,updated = [],removed = []){
		 if(removed.length > 0){
			/* 删除 */
			for(let index in removed)
				this.rooms.remove(removed[index].name);
		}
		if(added.length > 0){
			/* 新增 */
			for(let index in added){
				if(!added[index].removed && !this.rooms.isset(added[index].name)){
					let child = new RoomItem({
						width:this.stageW,
						height:this.stageH,
						parent:this.lobbyContent
					});
					child.setAttribute(added[index]);
					child.join.addEventListener(egret.TouchEvent.TOUCH_END, this.onJoin, this);
					this.rooms.push(child);
				}
			}
		}
		if(updated.length > 0){
			/* 更新 */
			for(let index in updated){
				if(updated[index].removed){
					this.rooms.remove(updated[index].name);
					continue;
				}
				let result = this.rooms.update(updated[index]);
			}
		}
		this.renderRooms();
	}

	public onJoin(e){
		if(!this.active)
			return;
		this.control.joinRoom(e.target.roomID);
	}

	public onListener(){
		this.back.addEventListener(egret.TouchEvent.TOUCH_END, this.onBack, this);
		this.create.addEventListener(egret.TouchEvent.TOUCH_END, this.onCreate, this);
		let actor = this.control.photon.myActor();
		this.nameLabel.text = actor.name;
		this.face.texture = RES.getRes(actor.getCustomProperty("face") + "_png");
		/* 格式化房間 */
		for(let index = this.rooms.length - 1;index >= 0 ;index--){
			this.rooms.remove(this.rooms[index].roomID);
		}
		this.rooms.length = 0;
		let rooms = this.control.photon.availableRooms();
		this.onRoomEvent(rooms);
	}

	public offListener(){
		this.back.removeEventListener(egret.TouchEvent.TOUCH_END, this.onBack, this);
		this.create.removeEventListener(egret.TouchEvent.TOUCH_END, this.onCreate, this);
	}
	
	public renderRooms(){
		if(this.rooms.length == 0){
			/* 沒有房間 */
			this.nilRoom.visible = true;
			this.lobbyContent.height = this.stageH*.83 - 79;
		}else{
			/* 有房間 */
			this.nilRoom.visible = false;
			for(let i = 0;i<this.rooms.length; i++){
				this.rooms[i].y = i * 110;
			}
			this.lobbyContent.height = Math.max(this.stageH*.83 - 79,this.rooms.length*110 + 10);
			this.lobbyBg.scaleY = this.lobbyContent.height/this.lobbyBg.height;
		}
	}

	/* back listener */
	public onBack(){
		this.control.logout();
	}

	/* back listener */
	public onCreate(){
		this.control.createRoom();
	}

	public face:egret.Bitmap;
	public nameLabel:egret.TextField;
	public back:eui.Button;
	public create:eui.Button;
	public lobbyContent:eui.Group;
	public lobbyBg:egret.Shape;
	public nilRoom:eui.Group;

	/* 建立 UI */
	private createUI(){
		/* title */
		let title = ui.TextField({
			text: "Lobby",
			size: 70,
			parent: this,
			width: this.stageW,
			height: this.stageH*.1,
			textColor: 0x51362a
		});

		/* face */
		let size = this.stageH*.07;
		this.face = ui.Bitmap({
			texture:RES.getRes("0_png"),
			width: size,
			height: size,
			x: size*.5,
			y: this.stageH*.1 + size*.5,
			parent: this
		});

		/* name */
		this.nameLabel = ui.TextField({
			text: "name",
			size: 40,
			parent: this,
			width: this.stageW - size,
			x: size,
			height: size,
			textColor: 0x51362a,
			y: this.stageH*.1
		});

		/* name border */
		let border = ui.Line({
			parent: this,
			sx: size + 20,
			sy: this.stageH*.1 + size - 5,
			tx: this.stageW - 20,
			ty: this.stageH*.1 + size - 5,
			width: 5,
			color: 0x51362a
		});

		/* scroll background */
		let scrollBg = ui.Shape({
			rx:0,ry:0,rw:this.stageW,rh:this.stageH*.83 - 80,
			parent:this,
			fill: 0x000000,
			y: this.stageH*.17 + 10,
			alpha: .3
		});

		this.lobbyContent = ui.Group({
			height: this.stageH*.83 - 79
		});

		/* listener bg */
		this.lobbyBg = ui.Shape({
			rx:0,ry:0,rw:this.stageW,rh:this.stageH*.83 - 80,
			parent:this.lobbyContent,
			fill: 0x000000,
			alpha: 0
		});

		/* nil room */
		this.nilRoom = ui.Group({
			parent:this.lobbyContent
		});
		let nilTest = ui.TextField({
			text: "NO ROOM",
			size: 40,
			parent: this.nilRoom,
			x: 10,
			y: 10,
			width: this.stageW - 20,
			height: 100,
			textColor: 0x51362a,
			backgroundColor: 0xFFFFFF
		});

		/* lobby scrollview */
		let lobbyScrollview:egret.ScrollView = new egret.ScrollView();
		lobbyScrollview.horizontalScrollPolicy = "off";
		lobbyScrollview.setContent(this.lobbyContent);
		lobbyScrollview.y = this.stageH*.17 + 10;
		lobbyScrollview.width = this.stageW;
		lobbyScrollview.height = this.stageH*.83 - 80;
		this.addChild(lobbyScrollview);

		/* button */
		this.back = ui.Button({
			label: "back",
			parent: this,
			width: 120,
			height: 50,
			x: 0,
			y: this.stageH - 60,
			skinName: "dist/resource/eui_skins/ButtonDefault.exml"
		});
		this.create = ui.Button({
			label: "create",
			parent: this,
			width: 120,
			height: 50,
			x: this.stageW - 120,
			y: this.stageH - 60,
			skinName: "dist/resource/eui_skins/ButtonInfo.exml"
		});
	}
}