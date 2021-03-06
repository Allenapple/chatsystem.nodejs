// 实例化 websocket
const WebSocket = require('ws');
// 引用 Player 类
var Player =  require('./player.class');
// 引用 PlayerMgr 类
var PlayerMgr = require('./playermgr.class');
// 引用 ChatRecords 类
var ChatRecords = require('./chatrecords.class');
// 引用 ProfanityFilter 类
var ProfanityFilter = require('./profanityfilter.class');
// 引用 GMMgr 类
var GMMgr = require('./gmmgr.class');
// 引用 PopularMgr 类
var PopularMgr = require('./popularmgr.class');




// 实例化 PlayerMgr
var playermgr = new PlayerMgr();
// 实例化 ChatRecords
var chatrecords = new ChatRecords();
// 实例化 ProfanityFilter
var profantiyfilter = new ProfanityFilter();
// 实例化 GMMgr
var gmmgr = new GMMgr();
// 实例化 PopularMgr
var popularmgr = new PopularMgr();

// 玩家ID索引
var uid = 1;

// 创建 WebSocket 服务
const wss = new WebSocket.Server({ port: 8080 });

// 收到客户端连接
wss.on('connection', function connection(ws) {

    // 客户消息
    ws.on('message', function incoming(message) {
        if (message == 'client request connect') {
          // console.log('some player come in');
          var player = new Player(uid,"玩家名字",ws);
          // 添加玩家
          playermgr.addPlayer(uid,player);
          // 同步聊天记录
          chatrecords.broadCastsChatRecords(player);
          uid++;
        } else {
            // console.log('server rev data:', message);
            playermgr.getPlayerByTask(ws,function (palyer){
            // 检查屏蔽字
            var wordafter =  profantiyfilter.checkWords(palyer.playerInfo()+message);
            // 广播聊天记录
            playermgr.broadCasts(wordafter);
            // 添加聊天记录
            chatrecords.addChatRecord(wordafter);

            var wordaftermessage = profantiyfilter.checkWords(message);
            // 解析GM命令
            gmmgr.parse(wordaftermessage,palyer,popularmgr);
            // 添加流行词
            popularmgr.addPopular(wordaftermessage);
          });
        
        }
    });

    // socket关闭
    ws.on('close', function () {
      // console.log('some player leave');
      playermgr.removePlayerByTask(ws);
  });

    // 服务器发送的数据
    ws.send('connect server successful!!');
});

// 加载屏蔽字库
profantiyfilter.loadTXT();
// 加载GM命令
gmmgr.initGM();

// 一秒定时器
setInterval(function() {
  popularmgr.timeRemovePopular();
}, 1000);

// 服务器启动成功
console.log('server start ok！！');

