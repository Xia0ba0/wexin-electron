// 导入WebSocket模块:
const WebSocket = require('ws');

// 引用Server类:
const WebSocketServer = WebSocket.Server;

// 实例化:
const wss = new WebSocketServer({
    port: 8899
});

const connections = new Array()

let ServerMainWindow

function initSocketServer(mainWindow) {
    ServerMainWindow = mainWindow
    wss.on('connection', function (ws) {
        ws.on('message', function (message) {
            console.log("handshake")
            let data = JSON.parse(message)
            console.log("hello")

            if(data.type === 'request'){
                ws.email = data.email
                connections[data.email] = ws
                ServerMainWindow.webContents.send("newConnection",ws.email, data)
            }else if(data.type === 'response'){
                ws.email = data.email
                connections[data.email] = ws
                ServerMainWindow.webContents.send("connectionConfirm", ws.email.data)
            }
            else if(ws.hasOwnProperty("email")){ // 已经握手成功
                ServerMainWindow.webContents.send("newMessage",ws.email, data)
            }else{
                ws.close()
            }
        })
        ws.on("close", function(){
            delete connections[ws.email]
        })
    });
}
export default initSocketServer