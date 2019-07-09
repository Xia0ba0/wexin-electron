import { ipcMain } from 'electron'
const crypto = require('crypto')
const NodeRSA = require('node-rsa')

function startListen() {
    /*
    使用时复制粘贴需要的监听函数，只需：
    ipcMain.on('修改这里', )
    mainWindow.webContents.send("修改这里", )
    修改成需要监听的活动就可以了
    

    // 异步通信

    //随机生成AES对称密钥
    ipcMain.on('aes-generate', e => {
        let str = "";
        let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        for (var i = 0; i < 32; i++) {
            let pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        mainWindow.webContents.send("aes-key", str)
    })

    // AES加解密
    ipcMain.on('aes-encryption', (event, data, key) => { // aes加密，data是明文，key是密钥
        console.log(data)
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
    })*/
}
const Mycrypto = {
    "aes_generate":function(){
        let str = "";
        let arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        for (var i = 0; i < 32; i++) {
            let pos = Math.round(Math.random() * (arr.length - 1));
            str += arr[pos];
        }
        return str
    },
    "aes_encrypt":function(data,key){
        console.log(data)
        if (!data) {
            return ""
        }
        var iv = ""// 初始向量设为空
        var clearEncoding = 'utf8'
        var cipherEncoding = 'base64'
        var cipherChunks = []
        var decipher = crypto.createDecipheriv('aes-256-ecb', key, iv)
        decipher.setAutoPadding(true)
        cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding))
        cipherChunks.push(decipher.final(clearEncoding))

        return cipherChunks.join('')
    },
    "aes_decrypt":function(data,key){
        if (!data) {
            return ""
        }
        var iv = ""// 初始向量设为空
        var clearEncoding = 'utf8'
        var cipherEncoding = 'base64'
        var cipherChunks = []
        var decipher = crypto.createDecipheriv('aes-256-ecb', key, iv)
        decipher.setAutoPadding(true)
        cipherChunks.push(decipher.update(data, cipherEncoding, clearEncoding))
        cipherChunks.push(decipher.final(clearEncoding))

        return cipherChunks.join('')
    },
    "rsa_generate":function(){
        var key = new NodeRSA({ b: 512 })// 生成512位秘钥
        key.setOptions({ encryptionScheme: 'pkcs1' })

        var privatePem = key.exportKey('pkcs1-private-pem')
        var publicPem = key.exportKey('pkcs1-public-pem')

        return {
            "pubKey":publicPem,
            "priKey":privatePem
        }
    },
    "rsa_encrypt":function(data,pubKey){
        var key = new NodeRSA(pubKey)
        let cipherText = key.encrypt(data, 'base64')
        return cipherText
    },
    "rsa_decrypt":function(data,priKey){
        var key = new NodeRSA(priKey)
        let plainText = key.decrypt(data, 'utf8')
        return plainText
    }
}
export default Mycrypto
