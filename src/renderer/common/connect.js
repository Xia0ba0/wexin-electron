const { remote } = require("electron");
const crypto = remote.getGlobal("sharedObject").crypto;

function request(currentUser, requestUser) {
    //截取密钥的前十六位
    var aesKey = crypto.aes_generate().subString(0, 15)
    var encryptedKey = crypto.rsa_encrypt(aesKey, requestUser.key)

    var websock = new WebSocket(`'ws://${requestUser.ip}:${requestUser.port}`)
    websock.onopen = function (evt) {
        websock.send(JSON.stringify({
            "type": "request",
            "email": currentUser.email,
            "key": encryptedKey
        }))
    }

    return {
        "connection": websock,
        "requestKey": aesKey
    }
}

function response(currentUser, responseUser) {
    //截取密钥的前十六位
    var aesKey = crypto.aes_generate().subString(0, 15)
    var encryptedKey = crypto.rsa_encrypt(aesKey, responseUser.key)

    var websock = new WebSocket(`'ws://${responseUser.ip}:${responseUser.port}`)
    websock.onopen = function (evt) {
        websock.send(JSON.stringify({
            "type": "response",
            "email": currentUser.email,
            "key": encryptedKey
        }))
    }

    return {
        "connection":websock,
        "responseKey":aesKey
    }
}

export { request, response }