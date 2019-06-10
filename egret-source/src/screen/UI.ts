class UI {
	public constructor() {}
	private Common(object,options){
		if(options.width)
			object.width = options.width;
		if(options.height)
			object.height = options.height;
		object.x = options.x || 0;
		object.y = options.y || 0;
		object.scaleX = options.scaleX || 1;
		object.scaleY = options.scaleY || 1;
		if(options.parent)
			options.parent.addChild(object);
		if(options.visible != undefined)
			object.visible = options.visible;
		return object;
	}
	public TextField(options){
		let textfield = this.Common(new egret.TextField(),options);
		textfield.text = options.text || "text";
		textfield.textAlign = options.textAlign || egret.HorizontalAlign.CENTER;
		textfield.verticalAlign = options.verticalAlign || egret.VerticalAlign.MIDDLE;
		textfield.size = options.size || 24;
		textfield.bold = options.bold || false;
		textfield.textColor = options.textColor || 0x000000;
		if(options.type)
			textfield.type = options.type;
		if(options.backgroundColor){
			textfield.background = true;
			textfield.backgroundColor = options.backgroundColor;
		}
		return textfield;
	}
	public Group(options){
		let group = this.Common(new eui.Group(),options);
		if(options.mask)
			group.mask = options.mask;
		return group;
	}
	public Bitmap(options){
		let bitmap = this.Common(new egret.Bitmap(),options);
		if(options.texture)
			bitmap.texture = options.texture;
		bitmap.anchorOffsetX = bitmap.width*.5;
		bitmap.anchorOffsetY = bitmap.height*.5;
		if(options.alpha != undefined)
			bitmap.alpha = options.alpha;
		return bitmap;
	}
	public Shape(options){
		let shape = this.Common(new egret.Shape(),options);
		shape.graphics.beginFill(options.fill || 0x000000,options.alpha !== undefined ? options.alpha : 1);
        shape.graphics.drawRect(options.rx || 0,options.ry || 0,options.rw || 0,options.rh || 0);
        shape.graphics.endFill();
		return shape;
	}
	public Button(options){
		let button = this.Common(new eui.Button(), options);
		button.label = options.label || "button";
		if(options.skinName)
			button.skinName = options.skinName;
		return button;
	}
	public Line(options){
		let line = this.Common(new egret.Shape(),options);
		line.graphics.lineStyle(options.width || 1,options.color || 0x000000);
		line.graphics.moveTo(options.sx || 0,options.sy || 0);
		line.graphics.lineTo(options.tx || 0,options.ty || 0);
		return line;
	}
}
declare let ui: UI;

declare interface Window {
    ui: UI,
	swal:any
}

if (!window.ui) {
    window.ui = new UI();
}