/* Optional. You will see this name in eg. 'ps' or 'top' command */
process.title = 'node-chat';
var webSocketsServerPort = 32767;
var webSocketServer = require('websocket').server;
const https = false;

var fs = require('fs');
/* https */
if(https){
    var server = require('https').createServer({
        /* SSL data */
        cert: fs.readFileSync('cert.pem'), 
        key: fs.readFileSync('cert.key')
    },function(req, res){
        /* https */
        res.writeHead(200);
        res.end('hello world\n');
    }).listen(webSocketsServerPort, function (test) {
        /* Socket */
        console.log("Socket start on 127.0.0.1:" + webSocketsServerPort);
    });
}else{
/* http */
    var server = require('http').createServer(function (req, res) {
        /* HTTP */
        res.writeHead(200);
        res.end('hello world\n');
    }).listen(webSocketsServerPort, function () {
        /* Socket */
        console.log("Socket start on 127.0.0.1:" + webSocketsServerPort);
    });
}


/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    httpServer: server,
    autoAcceptConnections: false
});

/* control */
control = {
    gameStatus:0,
    holder:0,
    gameUser:[],
    checkerboard:[],
    /* user login */
    login:function(user,data){
        user.name = data.name;
        user.face = data.face;
        user.status = this.gameStatus == 1?3:0;
        var uuid = user.uuid;
        /* login response */
        user.connection.sendUTF(JSON.stringify({
            type:"login",
            uuid:uuid,
            user:userModel.get(),
            status:this.gameStatus,
            checkerboard:this.gameStatus == 1?this.checkerboard:[]
        }));
        /* push user */
        var options = JSON.stringify({
            type:"user",
            method:"add",
            data:userModel.get(uuid)
        });
        var list = userModel.database;
        for(var id in list){
            var us = list[id];
            if(id == uuid)
                continue;
            us.connection.sendUTF(options);
        }
    },
    /* remove user */
    removeUser:function(uuid){
        /* push user data */
        var list = userModel.database;
        var options = JSON.stringify({
            type:"user",
            method:"remove",
            data:uuid
        });
        for(var key in list){
            var us = list[key];
            us.connection.sendUTF(options);
        }
        if(this.gameStatus == 1){
            if(this.gameUser.indexOf(uuid) > -1){
                this.gameover();
            }
        }
    },
    /* user ready */
    ready:function(user){
        if(this.gameUser.length >= 2 || this.gameStatus != 0){
            return;
        }
        user.status = 1;
        var options = JSON.stringify({
            type:"user",
            method:"status",
            data:[{
                uuid:user.uuid,
                status:1    
            }]
        });
        var list = userModel.database;
        for(var key in list){
            var us = list[key];
            us.connection.sendUTF(options);
        }
        this.gameUser.push(user.uuid);
        this.checkReady();
    },
    /* check can start */
    AI:false,
    checkReady:function(){
        var list = userModel.database;
        if(Object.keys(list).length == 1){
            this.AI = true;
        }
        if(this.gameUser.length == 2 || this.AI){
            this.gameStatus = 1;
            var data = [];
            for(var key in list){
                var us = list[key];
                data.push({
                    uuid:us.uuid,
                    status:this.gameUser.indexOf(us.uuid)>-1?2:3
                })
            }
            this.holder = Math.intRandom(0,this.gameUser.length);
            var options = JSON.stringify({
                type:"game",
                method:"start",
                data:data,
                holder:this.gameUser[this.holder]
            });
            userModel.database[this.gameUser[this.holder]].pieceType = 1;
            !this.AI && (userModel.database[this.gameUser[this.holder==1?0:1]].pieceType = 2);
            for(var key in list){
                var us = list[key];
                us.connection.sendUTF(options);
            }
            this.initCheckerboard();
        }
    },
    /* other code */
    checkerboard:[],
    wins:[],
    count:0,
    over:false,
    initCheckerboard:function(){
        /*
        * https://gitee.com/darkwing/Gomoku/blob/master/js/main.js
        * 初始化棋盘
        */
        this.over = false;
        this.checkerboard = [];
        for (let i = 0; i < 15; i++) {
            this.checkerboard[i] = [];
            for (let j = 0; j < 15; j++) {
                this.checkerboard[i][j] = 0;
            }
        }
        this.wins = [];
        for (let i = 0; i < 15; i++) {
            this.wins[i] = [];
            for (let j = 0; j < 15; j++) {
                this.wins[i][j] = [];
            }
        }
        this.count = 0;
        /*
        * 所有竖线的赢法
        */
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 11; j++) {
                for (let k = 0; k < 5; k++) {
                    this.wins[i][j + k][this.count] = true;
                }
                this.count++;
            }
        }
        /*
        * 所有横线的赢法
        */
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 11; j++) {
                for (let k = 0; k < 5; k++) {
                    this.wins[j + k][i][this.count] = true;
                }
                this.count++;
            }
        }
        /*
        * 所有斜线的赢法
        */
        for (let i = 0; i < 11; i++) {
            for (let j = 0; j < 11; j++) {
                for (let k = 0; k < 5; k++) {
                    this.wins[i + k][j + k][this.count] = true;
                }
                this.count++;
            }
        }
        /*
        * 所有反斜线的赢法
        */
        for (let i = 0; i < 11; i++) {
            for (let j = 14; j > 3; j--) {
                for (let k = 0; k < 5; k++) {
                    this.wins[i + k][j - k][this.count] = true;
                }
                this.count++;
            }
        }
        /*
        * 赢法统计数组
        */
        this.myWin = [];
        this.computerWin = [];
        for (let i = 0; i < this.count; i++) {
            this.myWin[i] = 0;
            this.computerWin[i] = 0;
        }
    },
    autoAI:function(message){
        var list = userModel.database;
        var data = message.data;
        var x = data.x;
        var y = data.y;
        if(this.holder == 0){
            var data = message.data;
            var holderUser = list[this.gameUser[0]];
            if (this.checkerboard[x][y] == 0) {
                this.checkerboard[x][y] = 1;
            }else{
                holderUser.connection.sendUTF(JSON.stringify({
                    type:"game",
                    method:"holder",
                    data:this.gameUser[0]
                }));
                return;
            }
            this.checkFinish(x,y,1);
        }else{
            /* computer */
            this.checkerboard[x][y] = 2;
            this.checkFinish(x,y,2);
        }
        var data = {
            x:x,y:y,
            pieceType:this.holder==0?1:2,
        };
        if(this.holder == 1){
            data.holder = this.gameUser[0]
        }
        if(this.over){
            this.AI = false;
            if(this.holder == 0){
                data.winner = this.gameUser[0];
            }else{
                data.loser = this.gameUser[0];
            }
            this.gameStatus = 0;
            this.gameUser = [];
        }
        this.holder = this.holder==0?1:0;
        var options = JSON.stringify({
            type:"game",
            method:this.over?"finish":"piece",
            data:data
        });
        for(var key in list){
            var us = list[key];
            us.connection.sendUTF(options);
        }
        if(this.holder == 1){
            var ai = this.computerAI();
            this.autoAI({
                data:ai
            });
        }
    },
    select:function(message){
        if(this.AI){
            this.autoAI(message);
            return;
        }
        var data = message.data;
        var x = data.x;
        var y = data.y;
        var list = userModel.database;
        var holderUser = list[this.gameUser[this.holder]];
        if (this.checkerboard[x][y] == 0) {
            this.checkerboard[x][y] = holderUser.pieceType;
        }else{
            holderUser.connection.sendUTF(JSON.stringify({
                type:"game",
                method:"holder",
                data:this.gameUser[this.holder]
            }));
            return;
        }
        this.checkFinish(x,y,holderUser.pieceType);
        var data = {
            x:x,
            y:y,
            pieceType:holderUser.pieceType,
        };
        if(this.over){
            data.winner = this.gameUser[this.holder];
            this.holder = this.holder==0?1:0;
            data.loser = this.gameUser[this.holder];
            this.gameStatus = 0;
            this.gameUser = [];
        }else{
            this.holder = this.holder==0?1:0;
            data.holder = this.gameUser[this.holder];
        }
        var options = JSON.stringify({
            type:"game",
            method:this.over?"finish":"piece",
            data:data
        });
        for(var key in list){
            var us = list[key];
            us.connection.sendUTF(options);
        }
    },
    checkFinish:function(x,y,type){
        if(type == 1){
            for (let k = 0; k < this.count; k++) {
                if (this.wins[x][y][k]) {
                    this.myWin[k]++;
                    this.computerWin[k] = 6;
                    if (this.myWin[k] == 5) {
                        this.over = true;
                    }
                }
            }
        }else{
            for (let k = 0; k < this.count; k++) {
                if (this.wins[x][y][k]) {
                    this.computerWin[k]++;
                    this.myWin[k] = 6;
                    if (this.computerWin[k] == 5) {
                        this.over = true;
                    }
                }
            }
        }
    },
    computerAI:function(){
        let myScore = [];
        let computerScore = [];
        // 保存最高分数
        let max = 0;
        // 保存最高分数坐标
        let u = 0;
        let v = 0;
        for (let i = 0; i < 15; i++) {
            myScore[i] = [];
            computerScore[i] = [];
            for (let j = 0; j < 15; j++) {
                myScore[i][j] = 0;
                computerScore[i][j] = 0;
            }
        }
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                if (this.checkerboard[i][j] == 0) {
                    for (let k = 0; k < this.count; k++) {
                        if (this.wins[i][j][k]) {
                            if (this.myWin[k] == 1) {
                                myScore[i][j] += 200;
                            } else if (this.myWin[k] == 2) {
                                myScore[i][j] += 400;
                            } else if (this.myWin[k] == 3) {
                                myScore[i][j] += 2000;
                            } else if (this.myWin[k] == 4) {
                                myScore[i][j] += 10000;
                            }
                            if (this.computerWin[k] == 1) {
                                computerScore[i][j] += 220;
                            } else if (this.computerWin[k] == 2) {
                                computerScore[i][j] += 420;
                            } else if (this.computerWin[k] == 3) {
                                computerScore[i][j] += 2100;
                            } else if (this.computerWin[k] == 4) {
                                computerScore[i][j] += 20000;
                            }
                        }
                    }
                    if (myScore[i][j] > max) {
                        max = myScore[i][j];
                        u = i;
                        v = j;
                    } else if (myScore[i][j] == max) {
                        if (computerScore[i][j] > computerScore[u][v]) {
                            u = i;
                            v = j;
                        }
                    }
                    if (computerScore[i][j] > max) {
                        max = computerScore[i][j];
                        u = i;
                        v = j;
                    } else if (computerScore[i][j] == max) {
                        if (myScore[i][j] > myScore[u][v]) {
                            u = i;
                            v = j;
                        }
                    }
                }
            }
        }
        return {x:u,y:v};
    },
    mousemove:function(msg){
        if(this.gameStatus != 1 || this.AI)
            return;
        var options = JSON.stringify({
            type:"game",
            method:"mousemove",
            data:msg.data
        });
        var user = userModel.database[this.gameUser[this.holder==0?1:0]];
        user.connection.sendUTF(options);
    },
    gameover:function(){
        this.AI = false;
        var list = userModel.database;
        var options = JSON.stringify({
            type:"game",
            method:"over"
        });
        for(var key in list){
            var us = list[key];
            us.status = 0;
            us.connection.sendUTF(options);
        }
        this.gameStatus = 0;
        this.gameUser = [];
    }, 
};

/* user model */
userModel = {
    /* USER */
    database:{},
    /* create */
    create:function(connection){
        var uuid = Math.strRandom();
        while(this.database[this.uuid]!=undefined){
            uuid = Math.strRandom();
        }
        var user = new User(connection,uuid);
        this.database[uuid] = user;
        return user;
    },
    /* get */
    get:function(uuid = false){
        if(uuid){
            /* one */
            if(this.database[uuid]){
                var user = this.database[uuid];
                return {
                    n:user.name,
                    u:user.uuid,
                    s:user.status,
                    f:user.face
                };
            }
            return false;
        }else{
            /* all */
            var list = [];
            for(var uuid in this.database){
                var user = this.database[uuid];
                list.push({
                    n:user.name,
                    u:user.uuid,
                    s:user.status,
                    f:user.face
                });
            }
            return list;
        }
    },
    /* remove */
    remove:function(uuid){
        if(uuid && this.database[uuid]){
            delete this.database[uuid];
        }
    }
};
/* user class */
class User {
    constructor(connection,uuid) {
        this.connection = connection;
        this.uuid = uuid;
        this.name = "";
        this.face = 0;
        this.pieceType;
        this.status = 0;
        /*
            case 0: "preparing";
            case 1: "ready";
            case 2: "playing";
            case 3: "watch";
            case 5: "winner";
            case 6: "loser";
         */
    }
}

/* Socket listener */
wsServer.on('request', function (request) {
    /* connection */
    var connection = request.accept(null, request.origin);
    /* user */
    var user = userModel.create(connection);
    /* 讯息 */
    connection.on('message', function (request) {
        if (request.type === 'utf8'){
            // console.log(request.utf8Data);
            try {
                var data = JSON.parse(request.utf8Data);
                switch(data.type){
                    case "login": /* 登入 */
                        control.login(user,{
                            name:data.name,
                            face:data.face
                        });
                        break;
                    case "game":
                        switch(data.method){
                            case "ready":
                                control.ready(user);
                                break;
                            case "mousemove":
                                control.mousemove(data);
                                break;
                            case "select":
                                control.select(data);
                                break;
                        }
                        break;
                }
            } catch(err){console.log(err);}
        }
    });
    /* 离线 */
    connection.on('close', function (data) {
        var uuid = user.uuid
        userModel.remove(uuid);
        control.removeUser(uuid);
    });
});

/* method */
Math.intRandom = function(min,max){
    return Math.floor(Math.random() * (Math.floor(max) - (min = Math.ceil(min)))) + min;
};
Math.strRandom = function(length = 5){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
};