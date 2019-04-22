class login extends eui.Component {
    public controller:Main;
    public show:boolean;
    public view;
    public stageW;
    public stageH;
    
    public constructor(controller) {
        super();

        this.visible = false;
        this.controller = controller;
        this.stageW = this.controller.stage.stageWidth;
        this.stageH = this.controller.stage.stageHeight;

        this.once(egret.Event.ADDED_TO_STAGE,this.createGameScene,this);
        return this;
    }

    public faceStartX:number = 0;
    public faceOriginX:number = 0;
    public faceGroup:eui.Group;
    public faceAnimate:TweenMax;
    public faceHold:boolean;
    public faceIndex:number = 0;
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
    public filterAnimate;
    public filter;
    private createGameScene(){
        let stageW = this.stageW;
        let stageH = this.stageH;

        /* background */
        let background = new egret.Shape();
        background.graphics.beginFill(0x000000);
        background.graphics.drawRect(0,0,stageW,stageH);
        background.graphics.endFill();
        background.alpha = 0;
        this.addChild(background);

        /* title */
        let title = new egret.TextField();
        title.text = "Gomoku";
        title.textAlign = egret.HorizontalAlign.CENTER;
        title.verticalAlign = egret.VerticalAlign.MIDDLE;
        title.size = 100;
        title.width = stageW;
        title.height = stageH*0.25;
        title.x = 0;
        title.y = 0;
        title.bold = true;
        this.addChild(title);

        /* face */
        let filter = new egret.CustomFilter(
            this.vertex,
            this.fragment,
            {
                center: { x: 0.5, y: 0.5 },
                params: { x: 10, y: 1, z: 0.1 },
                time: 0
            }
        );
        this.filter = filter;
        this.filterAnimate = TweenMax.fromTo(filter.uniforms, 2, {time:0}, {time:2.5, delay:0.5});
        
        let iconGroup = new eui.Group();
        iconGroup.y = stageH*0.25; 
        iconGroup.x = 0;
        for(let i=0;i<6;i++){
            let icon:egret.Bitmap = new egret.Bitmap();
            icon.texture = RES.getRes(i + "_png");
            icon.width = icon.height = 280;
            icon.anchorOffsetX = icon.width*.5;
            icon.anchorOffsetY = icon.height*.5;
            icon.filters = [filter];
            iconGroup.addChild(icon);
            icon.x = stageW*.5 + i*stageW;
            icon.y = stageH*.2;
        }
        this.addChild(iconGroup);
        this.faceGroup = iconGroup;

        /* mask */
        let square:egret.Shape = new egret.Shape();
        square.graphics.beginFill(0xff0000);
        square.graphics.drawRect(0,iconGroup.y,stageW,stageH*.4);
        square.graphics.endFill();
        this.addChild(square);
        iconGroup.mask = square;

        /* name label */
        let nicknameLabel = new egret.TextField();
        nicknameLabel.text = "Nickname :";
        nicknameLabel.textAlign = egret.HorizontalAlign.CENTER;
        nicknameLabel.verticalAlign = egret.VerticalAlign.MIDDLE;
        nicknameLabel.width = stageW*0.3;
        nicknameLabel.height = stageH*0.1;
        nicknameLabel.size = 24;
        nicknameLabel.x = 0;
        nicknameLabel.y = stageH*.7;
        nicknameLabel.bold = true;
        this.addChild(nicknameLabel);

        /* name input */
        let input:egret.TextField = new egret.TextField();
        // input.text = "please input name";
        input.text = (Math.floor(Math.random()*100000)).toString();
        input.width = stageW*.7;
        input.height = stageH*0.1;
        input.x = stageW*.3;
        input.y = stageH*.7;
        input.verticalAlign = egret.VerticalAlign.MIDDLE;
        input.textAlign = egret.HorizontalAlign.CENTER;
        this.addChild(input);

        /* name input line */
        let input_line = new egret.Shape();
        input_line.graphics.lineStyle(3,0xFFFFFF);
        input_line.graphics.moveTo(stageW*.3,stageH*.7+60);
        input_line.graphics.lineTo(stageW*0.95,stageH*.7+60);
        this.addChild(input_line);

        /* server input */
        let inputURL:egret.TextField = new egret.TextField();
        inputURL.text = '192.168.8.78:32767';
        inputURL.width = stageW*.7;
        inputURL.height = 40;
        inputURL.x = stageW*.3;
        inputURL.y = stageH - 40;
        inputURL.verticalAlign = egret.VerticalAlign.MIDDLE;
        inputURL.textAlign = egret.HorizontalAlign.LEFT;
        inputURL.size = 24;
        this.addChild(inputURL);
        
        let inputServer:egret.TextField = new egret.TextField();
        inputServer.text = 'Socket Server : ';
        inputServer.width = stageW*.3;
        inputServer.height = 40;
        inputServer.x = 0;
        inputServer.y = stageH - 40;
        inputServer.verticalAlign = egret.VerticalAlign.MIDDLE;
        inputServer.textAlign = egret.HorizontalAlign.RIGHT;
        inputServer.size = 24;
        this.addChild(inputServer);

        /* NEXT button */
        let nextButton = new customerButton({
            x:stageW*.5,
            y:stageH*.88,
            text:"NEXT"
        });
        this.addChild(nextButton);

        /* show */
        Object.defineProperty(this,'show',{
            get: function() { 
                return this.visible;
            },
            set: function(bool:boolean){
                if(this.visible == bool)
                    return;
                let from = bool?this.stageW:0;
                let to = bool?0:-this.stageW;
                this.x = from;
                if(bool){
                    this.visible = bool;
                    TweenMax.to(this,1,{x:to,onComplete:function(){
                        this.target.listener();
                    }});
                }else{
                    this.listener();
                    TweenMax.to(this,1,{x:to,onComplete:function(){
                        this.target.visible = false;
                    }});
                }
            }
        });
        this.view = {
            input:input,
            nextButton:nextButton,
            inputURL:inputURL
        };
    }

    public listener(){
        let view = this.view;
        let method = this.show?"addEventListener":"removeEventListener";
        view.nextButton[method]( egret.TouchEvent.TOUCH_BEGIN, this.onTouch, this);
        view.nextButton[method]( egret.TouchEvent.TOUCH_END, this.onTouch, this);
        this[method]( egret.TouchEvent.TOUCH_BEGIN, this.onFace, this);
        this[method]( egret.TouchEvent.TOUCH_END, this.onFace, this);
        this[method]( egret.TouchEvent.TOUCH_MOVE, this.onFace, this);
        view.input[method](egret.FocusEvent.FOCUS_IN, this.onInput, this);
        view.input[method](egret.FocusEvent.FOCUS_OUT, this.onInput, this);
        this.view.input.type = this.show?egret.TextFieldType.INPUT:egret.TextFieldInputType.TEXT;
        this.view.inputURL.type = this.show?egret.TextFieldType.INPUT:egret.TextFieldInputType.TEXT;
    }

    public onInput(e){
        switch(e.type){
            case "focusIn":
                if(e.target.text.trim() == "please input name")
                    e.target.text = "";
                break;
            case "focusOut":
                if(e.target.text.trim() == "")
                    e.target.text = "please input name";
                else
                    e.target.text = e.target.text.trim();
                break;
        }
    }

    public onFace(e){
        let stageW = this.stageW;
        let stageH = this.stageH;
        switch(e.type){
            case "touchBegin":
                this.faceHold = true;
                this.faceStartX = e.stageX;
                this.faceOriginX = this.faceGroup.x;
                if(this.faceAnimate){
                    this.faceAnimate.kill();
                    this.faceAnimate = undefined;
                }
                break;
            case "touchMove":
                if(this.faceHold)
                    this.faceGroup.x = this.faceOriginX - (this.faceStartX - e.stageX)*2;
                break;
            case "touchEnd":
                if(this.faceHold){
                    var x = this.faceGroup.x;
                    var max = (stageW*5+stageW*.5);
                    if(x > 0){
                        this.faceGroup.x = Math.min(x,stageW);
                        this.faceIndex = 0;
                    }else if(x < -max){
                        this.faceGroup.x = Math.max(x,-max);
                        this.faceIndex = 5;
                    }else{
                        this.faceIndex = Math.round(Math.abs(x)/stageW);
                    }
                }
                let from = this.faceGroup.x;
                let to = this.faceIndex*-stageW;
                this.faceAnimate = TweenMax.to(
                    this.faceGroup,Math.abs(from - to)/250, {
                        x:to,
                        ease: Elastic.easeOut.config(1, 0.3)
                    }
                );
                this.filter.uniforms.center.x = (e.stageX - stageW*.5)/280+0.5;
                this.filter.uniforms.center.y = (e.stageY - stageH*.25 - 140)/280+0.5;

                // iconGroup.y = stageH*0.25; 
                // iconGroup.x = 0;

                this.filterAnimate.invalidate();
                this.filterAnimate.restart();
                this.faceHold = false;
                break;
        }
    }

    public onTouch(e){
        e.target.touchEvent(e);
        if(e.type == "touchEnd"){
            /* check */
            let name = this.view.input.text;
            let error = "";
            if(name.length == 0 || name == "please input name")
                error = "請輸入名稱";
            if(error.length > 0){
                platform.alert({
                    title:error
                });
                return;
            }
            platform.setData({
                name:this.view.input.text,
                face:this.faceIndex
            });
            this.controller.connection(this.view.inputURL.text);
        }
    }
}