import Bus from './bus.js'
import Message from '@/plugin/message'

var websock = null
var websockPromise = null
var interval = null
function initWebSocket () {
    websockPromise = new Promise((resolve, reject) => {
        websock = new WebSocket('ws://localhost:8090/websocket')
        websock.onopen = (evt) => {
            resolve(websock)
            websocketOpen()
        }
        websock.onmessage = (evt) => {
            websocketonmessage(evt)
        }
        websock.onclose = (evt) => {
            websocketclose(evt)
        }
        websock.onerror = (evt) => {
            Message.$error('WebSocket连接发生错误')
            reject(new Error('WebSocket连接发生错误'))
        }
    })
}

// 数据接收
function websocketonmessage (e) {
    console.log(e.data)
    if(e.data === 'Refresh'){
        Bus.$emit('onRefreshFriends')
    }
}

// 数据发送
function websocketsend (data) {
    websock.send(JSON.stringify(data))
}

// 关闭
function websocketclose (e) {
    console.log("connection closed (" + e.code + ")")
    clearInterval(interval)
}

function websocketOpen (e) {
    console.log("连接成功")
    sendSocket("连接成功")
    interval = setInterval(() => {
        sendSocket({
            type: "ping"
        }, () => {})
    }, 30000)
}

function sendSocket (data, callback) {
    // 测试回调的一些作用域问题（这里{a:1, b:2}是假设为websocket响应的聊天数据）
    websockPromise
        .then(() => {
            websocketsend(data)
        })
        .catch(err => {
            Message.$error(err.message)
        })
}

function closeSocket(){
    websock.close()
}

export {initWebSocket, sendSocket, closeSocket}
