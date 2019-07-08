import { ipcMain } from 'electron'

var NodeRSA = require('node-rsa')
let mainWindow

function initEncryp (window) {
    mainWindow = window
}

function startListen () {
    /*
    使用时复制粘贴需要的监听函数，只需：
    ipcMain.on('修改这里', )
    mainWindow.webContents.send("修改这里", )
    修改成需要监听的活动就可以了
    */

    // 异步通信

    // AES加解密
    ipcMain.on('aes-encryption', (event, data, key) => { // aes加密，data是明文，key是密钥
        console.log(data)
        var crypto = require('crypto')
        var iv = ""// 初始向量设为空
        var clearEncoding = 'utf8'
        var cipherEncoding = 'base64'
        var cipherChunks = []
        var cipher = crypto.createCipheriv('aes-256-ecb', key, iv)
        cipher.setAutoPadding(true)
        cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding))
        cipherChunks.push(cipher.final(cipherEncoding))
        console.log(cipherChunks.join(''))

        mainWindow.webContents.send("aes-en-receiver", cipherChunks.join(''))

    })

    ipcMain.on('aes-decryption', (event, data, key) => { // aes解密，data是密文，key是密钥
        console.log(data)
        var crypto = require('crypto')
        if (!data) {
            mainWindow.webContents.send("aes-de-receiver", "")
        }
        var iv = ""// 初始向量设为空
        var clearEncoding = 'utf8'
        var cipherEncoding = 'base64'
        var cipherChunks = []
        var decipher = crypto.createDecipheriv('aes-256-ecb', key, iv)
        decipher.setAutoPadding(true)
        cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding))
        cipherChunks.push(decipher.final(clearEncoding))
        console.log(cipherChunks.join(''))

        mainWindow.webContents.send("aes-de-receiver", cipherChunks.join(''))
    })

    // RSA密钥对生成
    ipcMain.on('rsa-generate', e => {
        var key = new NodeRSA({ b: 512 })// 生成512位秘钥
        key.setOptions({ encryptionScheme: 'pkcs1' })

        var privatePem = key.exportKey('pkcs1-private-pem')
        var publicPem = key.exportKey('pkcs1-public-pem')

        mainWindow.webContents.send("rsa-keys", publicPem, privatePem)
    })

    // RSA加解密
    ipcMain.on('rsa-encrypt', (event, data, pubKey) => { // RSA加密，接收明文和私钥，返回密文
        var key = new NodeRSA(pubKey)
        let cipherText = key.encrypt(data, 'base64')
        console.log(cipherText)
        mainWindow.webContents.send("rsa-encoded", cipherText)
    })

    ipcMain.on('rsa-decrypt', (event, data, priKey) => { // RSA解密,， 接收密文和私钥，返回明文
        var key = new NodeRSA(priKey)
        let plainText = key.decrypt(data, 'utf8')
        console.log(plainText)
        mainWindow.webContents.send("rsa-decoded", plainText)
    })

    // 同步通信，用不到，放这里
    ipcMain.on('synchronous-message', (event, arg) => {
        console.log(arg) // prints "ping"
        event.returnValue = 'pong'
    })
}

export { initEncryp, startListen }
