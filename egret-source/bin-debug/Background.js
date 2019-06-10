var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Background = (function () {
    function Background() {
        var node = document.createElement('style');
        var url = "resource/assets/bg.png";
        node.innerHTML = "\n\t\t\tbody {\n\t\t\t\tmargin:0;\n\t\t\t\tpadding:0;\n\t\t\t\toverflow:hidden;\n\t\t\t\tbackground-image: url(" + url + ");\n\t\t\t\tbackground-size: 591px 307px;\n\t\t\t\tanimation:BgPosition 25s infinite;\n\t\t\t\t-webkit-animation:BgPosition 25s infinite; /* webkit */\n\t\t\t\tanimation-timing-function: linear;\n\t\t\t}\n\t\t\t@keyframes BgPosition {\n\t\t\t\tfrom {background-position: 0px 0px}\n\t\t\t\tto {background-position: 591px 307px} /* image size */\n\t\t\t}\n\t\t\t@-webkit-keyframes BgPosition { /* webkit */\n\t\t\t\tfrom {background-position: 0px 0px}\n\t\t\t\tto {background-position: 591px 307px} /* image size */\n\t\t\t}\n\t\t";
        document.body.appendChild(node);
    }
    return Background;
}());
__reflect(Background.prototype, "Background");
//# sourceMappingURL=Background.js.map