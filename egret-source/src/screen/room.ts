class room extends gameScreen{
	private gameStatus:number; /* 0 準備中 1 準備完畢 2 開始 3 結束 */
	private master:boolean; /* 房主 */
	private player:boolean; /* 是否有對手 */
	private holder:boolean; /* 持有者 */
	/* cache */
	private LB:Photon.LoadBalancing.LoadBalancingClient;
	private myActor:Photon.LoadBalancing.Actor;
	private myRoom:Photon.LoadBalancing.Room;
	private pieceSize:number;
	private pieceList:Array<egret.Bitmap> = [];
	private originalPosition;
	private pieceSelect:Array<number> = [];
	/* UI */
	private back:eui.Button;
	private ready:eui.Button;
	private sendMessage:eui.Button;
	private selfActor;
	private enemyActor;
	private position:egret.Bitmap;
	private pieceType:egret.Texture;
	private checkerboard:eui.Group;
	private result:egret.Bitmap;
    private resultAnimate:TimelineMax;
	private message:eui.Group;
	private inputMessage:egret.TextField;
	private inputMessageBg:egret.Shape;
	private endMessage:TweenMax;
	/* shader */
	public fragment:string = `
        precision lowp float;
        varying vec2 vTextureCoord;
        varying vec4 vColor;
        uniform sampler2D uSampler;
        uniform vec2 center;
        uniform vec3 params;
        uniform float time;
        void main()
        {
            vec2 uv = vTextureCoord.xy;
            vec2 texCoord = uv;
            float dist = distance(uv, center);
            if ( (dist <= (time + params.z)) && (dist >= (time - params.z)) )
            {
                float diff = (dist - time);
                float powDiff = 1.0 - pow(abs(diff*params.x), params.y);
                float diffTime = diff  * powDiff;
                vec2 diffUV = normalize(uv - center);
                texCoord = uv + (diffUV * diffTime);
            }
            gl_FragColor = texture2D(uSampler, texCoord);
        }
    `;
    public vertex:string = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;
        attribute vec2 aColor;
        uniform vec2 projectionVector;
        varying vec2 vTextureCoord;
        varying vec4 vColor;
        const vec2 center = vec2(-1.0, 1.0);
        void main(void) {
            gl_Position = vec4( (aVertexPosition / projectionVector) + center , 0.0, 1.0);
            vTextureCoord = aTextureCoord;
            vColor = vec4(aColor.x, aColor.x, aColor.x, aColor.x);
        }
    `;
	public filterAnimate:TweenMax;
    public filter:egret.CustomFilter;

	public constructor(options) {
		super(options);
		this.once(egret.Event.ADDED_TO_STAGE,this.createUI,this);
		options.stage.addChild(this);

		/* photon event listener */
		let LB = this.control.photon;
		this.myActor = LB.myActor();
		LB.onActorLeave = (actor, cleanup) => {
			this.onActorEvent(0,actor);
		};
		LB.onActorJoin = (actor, cleanup) => {
			this.onActorEvent(1,actor);
		};
		LB.onActorPropertiesChange = (actor) => {
			this.onActorEvent(2,actor);
		};
		LB.onEvent = (code, content, actorNr) => {
			this.onEvent(code, content,actorNr);
		};
		this.LB = LB;

        return this;
	}

	public onActorEvent(type,actor){
		switch(type){
			case 0: /* 玩家離開 */
				this.player = false;
				this.enemyActor.status.text = "";
				this.enemyActor.name.text = "wait for player";
				this.enemyActor.face.texture = RES.getRes("square_png");
				this.myActor.setCustomProperty("status",0);
				this.onEvent(0);
				this.master = this.myActor.actorNr == this.myRoom.masterClientId;
				break;
			case 1: /* 玩家加入 */
			case 2: /* 玩家更新 */
				if(actor.actorNr == this.myActor.actorNr){
					/* 更新自己 */
					this.selfActor.status.text = this.statusToString(actor.getCustomProperty("status"));
					this.selfActor.name.text = actor.name;
					this.selfActor.face.texture = RES.getRes(actor.getCustomProperty("face") + "_png");
				}else{
					/* 更新對手 */
					this.player = true;
					this.enemyActor.status.text = this.statusToString(actor.getCustomProperty("status"));
					this.enemyActor.name.text = actor.name;
					this.enemyActor.face.texture = RES.getRes(actor.getCustomProperty("face") + "_png");
					this.checkReady();
				}
				break;
		}
	}

	/* 狀態 */
	public statusToString(status:number){
		switch(status){
			case 0:
				return "preparing";
			case 1:
				return "ready";
			case 2:
				return "playing";
			case 3:
				return "winner";
			case 4:
				return "lost";
			default:
				return "";
		}
	}

	public onListener(){
		this.back.addEventListener(egret.TouchEvent.TOUCH_END, this.onBack, this);
		this.ready.addEventListener(egret.TouchEvent.TOUCH_END, this.onReady, this);
		let list = this.LB.myRoomActors();
		for(let index in list){
			this.onActorEvent(1,list[index]);
		}
		this.stage.addEventListener(mouse.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
		this.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.onPieceSelect, this);
		mouse.enable(this.stage);
		this.myRoom = this.LB.myRoom();
		this.master = this.myActor.actorNr == this.myRoom.masterClientId;
		this.inputMessage.type = egret.TextFieldType.INPUT;
		this.sendMessage.addEventListener(egret.TouchEvent.TOUCH_END, this.onSend, this);
		this.inputMessage.addEventListener(egret.FocusEvent.FOCUS_IN, this.onInput, this);
		this.onEvent(0);
	}

	public offListener(){
		this.back.removeEventListener(egret.TouchEvent.TOUCH_END, this.onBack, this);
		this.ready.removeEventListener(egret.TouchEvent.TOUCH_END, this.onReady, this);
		this.stage.removeEventListener(mouse.MouseEvent.MOUSE_MOVE, this.onMouseMove, this);
		this.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onPieceSelect, this);
		this.sendMessage.removeEventListener(egret.TouchEvent.TOUCH_END, this.onSend, this);
		this.inputMessage.removeEventListener(egret.FocusEvent.FOCUS_IN, this.onInput, this);
		this.inputMessage.type = egret.TextFieldInputType.TEXT;
        mouse.setMouseMoveEnabled(false);
	}
	
	public onInput(e){
		switch(e.type){
            case "focusIn":
				e.target.text = "";
                break;
        }
	}

	public onSend(e){
		if(this.inputMessage.text.length == 0 || this.inputMessage.text == "input something")
			return;
		let options = {
			text:this.inputMessage.text
		};
		this.LB.raiseEvent(8,options);
		this.inputMessage.text = "input something";
		this.onEvent(8,options,this.myActor.actorNr);
	}
	
	/* 選擇位置 */
	public onPieceSelect(e){
		if(!this.holder || !this.position.visible)
			return;
		let px = this.originalPosition.px;
		let py = this.originalPosition.py;
		let index = py * 15 + px;
		if(this.pieceSelect[index] != -1)
			return;
		let options = {
			x:this.selfActor.piece.x,
			y:this.selfActor.piece.y,
			px:px,
			py:py
		};
		this.setHolder(-1);
		this.onEvent(9,options,this.myActor.actorNr);
		this.LB.raiseEvent(9,options);
	}

	/* 滑鼠移動 */
	public onMouseMove(e){
		if(!this.holder)
			return;
		let x = e.stageX;
		let y = e.stageY;
		if(egret.Capabilities.isMobile){
			y = y - 75;
			x = x + (x - this.stageW*.5) * 1.1;
		}
		let options = {
			x:x,y:y
		};
		let px = Math.round((x - 15)/this.pieceSize);
		let py = Math.round((y - 195)/this.pieceSize);
		this.originalPosition.px = px;
		this.originalPosition.py = py;
		this.position.visible = !(px < 0 || py < 0 || px > 14 || py > 14);
		this.position.x = px * this.pieceSize + 15;
		this.position.y = py * this.pieceSize + 15;
		this.onEvent(10,options);
		this.LB.raiseEvent(10,options);
	}

	public setHolder(actorNr){
		this.holder = actorNr == this.myActor.actorNr;
		mouse.setMouseMoveEnabled(this.holder);
		this.position.visible = this.holder;
		if(this.holder){
			let original = this.originalPosition.enemyActorPiece;
			this.enemyActor.piece.x = original.x;
			this.enemyActor.piece.y = original.y;
		}else{
			let original = this.originalPosition.selfActorPiece;
			this.selfActor.piece.x = original.x;
			this.selfActor.piece.y = original.y;
		}
	}

	public onEvent(code, content = undefined,actorNr = undefined){
		// console.log(code, content);
		switch(code){
			case 0: /* 初始化 */
        		this.resultAnimate.pause();
				this.result.visible = false;
				for(let i=0;i<15*15;i++){
					this.pieceSelect[i] = -1;
				}
				if(this.pieceList.length > 0){
					for(let index = this.pieceList.length - 1;index >= 0;index--){
						let item = this.pieceList[index];
						item.parent.removeChild(item);
						this.pieceList.splice(index,1);
					}
				}
				this.position.visible = false;
				this.pieceList = [];
				this.holder = false;
				this.selfActor.piece.visible = false;
				this.enemyActor.piece.visible = false;
				this.gameStatus = 0;
				this.ready.visible = true;
				this.back.visible = true;
				this.ready.label = "ready";
				this.inputMessage.visible = false;
				this.sendMessage.visible = false;
				this.inputMessageBg.visible = false;
				break;
			case 1: /* 準備完畢 */
				this.back.visible = false;
				this.ready.visible = true;
				this.ready.label = "cancel";
				this.checkReady();
				break;
			case 2: /* 開始遊戲 */
				this.inputMessage.visible = true;
				this.sendMessage.visible = true;
				this.inputMessageBg.visible = true;
				this.back.visible = false;
				this.ready.visible = false;
				/* actor ready */
				this.myActor.setCustomProperty("status",2);
				this.gameStatus = 2;
				this.onActorEvent(2,this.myActor);
				/* holder */
				this.selfActor.piece.visible = true;
				this.enemyActor.piece.visible = true;
				this.setHolder(content.holder);
				if(this.holder){
					/* 黑子 */
					this.pieceType = RES.getRes("black_png");
					this.enemyActor.piece.texture = RES.getRes("white_png");
				}else{
					/* 白子 */
					this.pieceType = RES.getRes("white_png");
					this.enemyActor.piece.texture = RES.getRes("black_png");
				}
				this.selfActor.piece.texture = this.pieceType;
				this.position.texture = this.pieceType;
				break;
			case 3: /* 遊戲結束 */
				this.inputMessage.visible = false;
				this.sendMessage.visible = false;
				this.position.visible = false;
				this.selfActor.piece.visible = false;
				this.enemyActor.piece.visible = false;
				this.inputMessageBg.visible = false;
				/* 輸贏 */
				this.result.texture = RES.getRes(this.myActor.getCustomProperty("status") == 3?"winner_png":"lost_png");
				this.result.visible = true;
				this.ready.visible = true;
				this.back.visible = true;
				this.ready.label = "ready";
				this.resultAnimate.resume();
				break;
			
			/* 遊戲事件 */
			case 8:
				if(this.endMessage){
					this.endMessage.kill();
				}
				this.message.visible = true;
				if(actorNr == this.myActor.actorNr){
					this.message["selfText"] = content.text;
				}else{
					this.message["enemyText"] = content.text;
				}
				this.endMessage = TweenMax.to(this.message,.4,{alpha:0,delay:Math.max(content.text.length,5)});
				break;
			case 9: /* 選擇 */
				let selectPiece = ui.Bitmap({
					width: 30,
					height: 30,
					scale: 1.1,
					scaleY: 1.1,
					parent: this.checkerboard,
					x: content.x,
					y: content.y - (this.stageH * .5 - this.stageW* .5)
				});
				if(actorNr == this.myActor.actorNr){
					/* self */
					selectPiece.texture = this.pieceType;
					this.pieceSelect[content.py*15+content.px] = 1; /* 自己都是 1 */
				}else{
					/* enemy */
					selectPiece.texture = this.enemyActor.piece.texture;
					this.pieceSelect[content.py*15+content.px] = 0; /* 對手都是 0 */
				}
				this.pieceList.push(selectPiece);
				TweenMax.to(selectPiece,.4,{
					x: content.px * this.pieceSize + 15,
					y: content.py * this.pieceSize + 15,
					scaleX: 1,
					scaleY: 1,
					onComplete:() => {
						this.filter.uniforms.center.x = selectPiece.x/this.stageW;
						this.filter.uniforms.center.y = 1 - selectPiece.y/this.stageW;
						this.filterAnimate.invalidate();
						this.filterAnimate.restart();
					}
				});
				/* check game over */
				if(this.checkWinner(content.px,content.py)){
					this.gameStatus = 3;
					if(actorNr == this.myActor.actorNr){
						/* winner */
						this.myActor.setCustomProperty("status",3);
					}else{
						/* lost */
						this.myActor.setCustomProperty("status",4);
					}
					this.onActorEvent(2,this.myActor);
					this.onEvent(this.gameStatus);
					return;
				}
				/* 交換 */
				if(actorNr != this.myActor.actorNr)
					this.setHolder(this.myActor.actorNr);
				break;
			case 10: /* 棋子移動 */
				let piece = this.holder?this.selfActor.piece:this.enemyActor.piece;
				piece.x = content.x;
				piece.y = content.y;
				break;
		}
	}

	/* 判斷輸贏 */
	public checkWinner(px,py){ /* 自己都是 1 對手都是 0 */
		let type = this.pieceSelect[py*15 + px];
		for(let angle=0;angle<4;angle++){ /* 四個方向 */
			let count = 1;
			for(let direcation = -1;direcation <= 1;direcation+=2){ /* 正負移動 */
				let dir = 1;
				while(true){
					let x = px + dir*(angle<3?direcation:0);
					let y = py + dir*(angle>0?(angle==2?-direcation:direcation):0);
					if(x < 0 || y < 0 || x > 14 || y > 14 || this.pieceSelect[y*15+x] != type)
						break;
					count++;
					dir++;
				}
			}
			if(count == 5){
				return true;
			}
		}
		return false;
	}

	/* 檢查準備狀態 */
	public checkReady(){
		if(this.master && this.gameStatus == 1 && this.player){
			let actors = this.LB.myRoomActors();
			let actorNrList = [];
			for(let index in actors){
				if(actors[index].getCustomProperty("status") != 1)
					return;
				actorNrList.push(actors[index].actorNr);
			}
			let options = {
				holder:actorNrList[Math.floor(Math.random()*2)],
				list:actorNrList
			};
			/* 開始遊戲 */
			this.LB.raiseEvent(2,options);
			this.onEvent(2,options);
		}
	}
	/* 離開房間 */
	public onBack(){
		this.control.leaveRoom();
	}

	/* 準備完畢 */
	public onReady(){
		if(this.gameStatus == 0){
			this.myActor.setCustomProperty("status",1);
			this.onActorEvent(1,this.myActor);
			this.gameStatus = 1;
		}
		else if(this.gameStatus == 1){
			this.myActor.setCustomProperty("status",0);
			this.onActorEvent(1,this.myActor);
			this.gameStatus = 0;
		}
		else if(this.gameStatus == 3){
			this.myActor.setCustomProperty("status",1);
			this.onEvent(0);
			this.gameStatus = 1;
		}
		this.onEvent(this.gameStatus);
	}

	/* UI */
	private createUI(){
		/* filter */
        let filter = new egret.CustomFilter(
            this.vertex,
            this.fragment,
            {
                center: { x: 0.5, y: 0.5 },
                params: { x: 10, y: .5, z: 0.1 },
                time: 2
            }
        );
        this.filter = filter;
        this.filterAnimate = TweenMax.fromTo(filter.uniforms, 5, {time:0.12}, {time:2});

		/* checkerboard */
		let checkerboard = ui.Group({
			parent:this,
			y:this.stageH * .5 - this.stageW* .5
		});
		checkerboard.filters = [this.filter];
		this.checkerboard = checkerboard;
		let checkerboardBg = ui.Shape({
			rx:0,ry:0,rw:this.stageW,rh:this.stageW,
			fill:0xecbd5a,
			parent:checkerboard
		});
		let position = 14;
		let padding = 15;
		let size = this.stageW - padding*2;
        let dis = size / position;

		this.pieceSize = dis;
        checkerboardBg.graphics.lineStyle(1,0x000000);
		/* 畫線 */
        for(let i=0;i<=position;i++){
            let x = i*dis;
			let sx = x + padding;
			let ex = size + padding;
			/* hoz */
            checkerboardBg.graphics.moveTo(sx,padding);
            checkerboardBg.graphics.lineTo(sx,ex);
            /* ver */
			checkerboardBg.graphics.moveTo(padding,sx);
            checkerboardBg.graphics.lineTo(ex,sx);
        }
		/* 點點 */
		for(let c=0;c<5;c++){
            checkerboardBg.graphics.lineStyle(0,0x000000);
            checkerboardBg.graphics.beginFill(0x000000);
            let x = c==2?size*.5:dis*(3 + (c%2==0?0:8));
            let y = c==2?size*.5:dis*(3 + (c<2?0:8));
            checkerboardBg.graphics.drawCircle(x + 15,y + 15, 5);
            checkerboardBg.graphics.endFill();
        }
		/* self actor */
		/* face */
		let selfActor = {
			face:undefined,
			name:undefined,
			border:undefined,
			status:undefined,
			piece:undefined
		};
		let faceSize = this.stageW*.2;
		selfActor.face = ui.Bitmap({
			texture:RES.getRes("0_png"),
			width: faceSize,
			height: faceSize,
			x: 0 + faceSize * .5,
			y: this.stageH*.5 + this.stageW *.5 + 15 + faceSize*.5,
			parent: this
		});
		selfActor.name = ui.TextField({
			text: "name",
			size: 40,
			parent: this,
			width: this.stageW - faceSize - 20,
			height: 50,
			textAlign: egret.HorizontalAlign.LEFT,
			textColor: 0x51362a,
			x: faceSize + 10,
			y: this.stageH*.5 + this.stageW *.5 + 5
		});
		selfActor.border = ui.Line({
			parent: this,
			sx: 0,
			sy: 0,
			tx: this.stageW - faceSize - 15,
			ty: 0,
			x: faceSize + 10,
			y: this.stageH*.75 + this.stageW*.25 - 30,
			width: 5,
			color: 0x51362a
		});
		selfActor.status = ui.TextField({
			text: "status",
			size: 28,
			parent: this,
			width: this.stageW - faceSize - 15,
			height: 50,
			textAlign: egret.HorizontalAlign.RIGHT,
			textColor: 0x51362a,
			x: faceSize + 10,
			y: this.stageH*.75 + this.stageW *.25 - 30
		});
		selfActor.piece = ui.Bitmap({
			texture:RES.getRes("black_png"),
			width: 36,
			height: 36,
			x: faceSize + 10 + 18,
			y: this.stageH*.75 + this.stageW *.25 - 5,
			parent: this,
			visible: false,
		});
		this.selfActor = selfActor;

		/* enemy actor */
		let enemyActor = {
			face:undefined,
			name:undefined,
			border:undefined,
			status:undefined,
			piece:undefined
		};
		enemyActor.face = ui.Bitmap({
			texture:RES.getRes("square_png"),
			width: faceSize,
			height: faceSize,
			x: this.stageW - faceSize * .5,
			y: this.stageH*.5 - (this.stageW *.5 + 15 + faceSize*.5),
			parent: this
		});
		enemyActor.name = ui.TextField({
			text: "wait for player",
			size: 40,
			parent: this,
			width: this.stageW - faceSize - 20,
			height: 50,
			textAlign: egret.HorizontalAlign.RIGHT,
			textColor: 0x51362a,
			x: 5,
			y: this.stageH*.25 - this.stageW*.25 - 20
		});
		enemyActor.border = ui.Line({
			parent: this,
			sx: 0,
			sy: 0,
			tx: this.stageW - faceSize - 15,
			ty: 0,
			x: 5,
			y: this.stageH*.25 - this.stageW*.25 + 30,
			width: 5,
			color: 0x51362a
		});
		enemyActor.status = ui.TextField({
			text: "preparing",
			size: 28,
			parent: this,
			width: this.stageW - faceSize - 15,
			height: 50,
			textAlign: egret.HorizontalAlign.LEFT,
			textColor: 0x51362a,
			x: 5,
			y: this.stageH*.25 - this.stageW*.25 + 30
		});
		enemyActor.piece = ui.Bitmap({
			texture:RES.getRes("black_png"),
			width: 30,
			height: 30,
			scaleX: 1.1,
			scaleY: 1.1,
			x: this.stageW - faceSize - 28,
			y: this.stageH*.25 - this.stageW*.25 + 55,
			parent: this,
			visible: false,
		});
		this.enemyActor = enemyActor;

		this.result = ui.Bitmap({
			texture:RES.getRes("winner_png"),
			width:this.stageW*.75,
			height:this.stageW*.75,
			parent: this,
			visible: false,
			x: this.stageW*.5,
			y: this.stageH*.5
		});
		this.resultAnimate = new TimelineMax({repeat:-1});
        this.resultAnimate.add(TweenLite.to(this.result, .7, {scaleX:1.1,scaleY:1.1,ease: Elastic.easeOut.config(1, 0.3)}));
        this.resultAnimate.add(TweenLite.to(this.result, .7, {scaleX:1,scaleY:1,ease: Elastic.easeOut.config(1, 0.3)}));
        this.resultAnimate.pause();

		/* 儲存位置 */
		this.originalPosition = {
			enemyActorPiece:{
				x:enemyActor.piece.x,
				y:enemyActor.piece.y
			},
			selfActorPiece:{
				x:selfActor.piece.x,
				y:selfActor.piece.y
			},
			px:-1,
			py:-1
		};
		/* 預判位置 */
		this.position = ui.Bitmap({
			texture:RES.getRes("black_png"),
			width: 30,
			height: 30,
			parent: checkerboard,
			visible: false,
			alpha: .5,
			x: - 100,
			y: - 100,
		});
		/* 訊息 */
		this.message = ui.Group({
			parent:this,
			x: this.stageW * .6,
			y: this.stageH * .1,
			visible: false
		});
		let msgBG = ui.Bitmap({
			texture:RES.getRes("msg_png"),
			parent:this.message,
			width:90 * 2,
			height:81 * 2
		});
		let msgText = ui.TextField({
			parent:this.message,
			text: "",
			size: 14,
			width: 140,
			height: 120,
			x: - 75,
			y: - 60
		});
		let w = this.stageW;
		let h = this.stageH;
		Object.defineProperty(this.message,'enemyText',{
			set(value){
				this.x = w * .6;
				this.y = h * .1;
				msgBG.scaleX = 1;
				msgText.text = value;
				this.alpha = 0;
				TweenMax.to(this,.4,{alpha:1});
			}
		});
		Object.defineProperty(this.message,'selfText',{
			set(value){
				this.x = w * .4;
				this.y = h * .8;
				msgBG.scaleX = -1;
				msgText.text = value;
				this.alpha = 0;
				TweenMax.to(this,.4,{alpha:1});
			}
		});
		/* input text */
		this.inputMessageBg = ui.Shape({
			parent:this,
			rx:0,
			ry:0,
			rw:this.stageW,
			rh:50,
			x:0,
			fill:0xEEEEEE,
			y:this.stageH - 60,
			visible: false
		});
		this.inputMessage = ui.TextField({
			parent:this,
			text:"input something",
			width:this.stageW - 120,
			height:50,
			y:this.stageH - 60,
			textColor: 0x666666,
			visible: false
		});
		this.sendMessage = ui.Button({
			label: "send",
			parent: this,
			width: 110,
			height: 40,
			x: this.stageW - 115,
			y: this.stageH - 55,
			visible:false,
			skinName: "dist/resource/eui_skins/ButtonInfo.exml"
		});
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
		this.ready = ui.Button({
			label: "ready",
			parent: this,
			width: 120,
			height: 50,
			x: this.stageW - 120,
			y: this.stageH - 60,
			skinName: "dist/resource/eui_skins/ButtonDanger.exml"
		});
	}
}