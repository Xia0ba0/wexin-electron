// 导入WebSocket模块:
const WebSocket = require('ws');

// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wss = new WebSocketServer({
    port: 8899
});

let ServerMainWindow

function initSocketServer(mainWindow) {
    ServerMainWindow = mainWindow
    wss.on('connection', function (ws) {
        ws.on('message', function (message) {
            let data = JSON.parse(message)

            if(data.type === 'request'){
                ws.email = data.email
                ServerMainWindow.webContents.send("newConnection",ws.email, data.key)
            }else if(data.type === 'response'){
                ws.email = data.email
                ServerMainWindow.webContents.send("connectionConfirm", ws.email, data.key)
            }
            else if(ws.hasOwnProperty("email")){ // 已经握手成功
                ServerMainWindow.webContents.send("newMessage",ws.email, data)
            }else{
                console.log(message)
            }
        });

        ws.on('close',()=>{
            if(ws.hasOwnProperty("email")){
                ServerMainWindow.webContents.send("connectionClose",ws.email)
            }
        })
    });
}
export default initSocketServer