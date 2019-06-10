class Background {
	public constructor() {
		let node = document.createElement('style');
		let url:string = "resource/assets/bg.png";
		node.innerHTML = `
			body {
				margin:0;
				padding:0;
				overflow:hidden;
				background-image: url(${url});
				background-size: 591px 307px;
				animation:BgPosition 25s infinite;
				-webkit-animation:BgPosition 25s infinite; /* webkit */
				animation-timing-function: linear;
			}
			@keyframes BgPosition {
				from {background-position: 0px 0px}
				to {background-position: 591px 307px} /* image size */
			}
			@-webkit-keyframes BgPosition { /* webkit */
				from {background-position: 0px 0px}
				to {background-position: 591px 307px} /* image size */
			}
		`;
		document.body.appendChild(node);
	}
}