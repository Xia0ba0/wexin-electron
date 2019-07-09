/*
这里是加解密在渲染进程的使用样例
使用时仅需修改监听或者发送的活动名及参数
放入***.vue的生命周期函数中
*/

// console.log(ipcRenderer.sendSync("synchronous-message", "ping")); //同步通信，用不到，留着看

var text = "test"// 测试时初始化的明文，使用时自行引入
var key = "0123456789abcdef0123456789abcdef"// 测试时初始化的密钥，使用时自行引入

//AES密钥生成
ipcRenderer.send("aes-generate")//发送生成AES对称密钥请求
ipcRenderer.on("aes-key", (event, key) => {//接收AES密钥
    console.log(key)
})

//AES加密
ipcRenderer.send("aes-encryption", text, key)// 发送明文text和密钥key，aes加密，key为32位
ipcRenderer.on("aes-en-receiver", (event, arg) => { // 接收aes密文，传入arg，使用时自行修改该函数体内容
    console.log(arg)
})

var data = "dQvVpMGPSPL8zCxGByAGIg=="// 测试时使用的密文，使用时自行引入
//AES解密
ipcRenderer.send("aes-decryption", data, key)// 发送密文data和密钥key，aes解密
ipcRenderer.on("aes-de-receiver", (event, data) => { // 接收aes明文，传入data，使用时自行修改该函数体内容
    console.log(data)
})

//RSA密钥对生成
ipcRenderer.send("rsa-generate")//发送生成RSA密钥对请求
ipcRenderer.on("rsa-keys", (event, pubKey, priKey) => { // 接收公私钥并写入localStorage，使用时根据需求修改该函数体内容
    console.log("pubKey:" + pubKey)
    console.log("priKey:" + priKey)
    localStorage.setItem("pubKey", pubKey)
    localStorage.setItem("priKey", priKey)
})

var pubKey = localStorage.getItem('pubKey')// 测试时使用的密钥，使用时自行引入
//RSA加密
ipcRenderer.send("rsa-encrypt", data, pubKey)// 发送明文data和公钥pubKey，RSA加密
ipcRenderer.on("rsa-encoded", (event, cipherText) => { // 接收密文，RSA加密，使用时自行修改该函数体内容
    console.log("RSA加密后:" + cipherText)
    localStorage.setItem('temp', cipherText)
})

let priKey = localStorage.getItem('priKey')// 测试时使用的密钥，使用时自行引入
//RSA解密
ipcRenderer.send("rsa-decrypt", localStorage.getItem('temp'), priKey)// 发送密文（这里的getItem是因为之前写入了localStorage）和私钥，RSA解密
ipcRenderer.on("rsa-decoded", (event, plainText) => { // 接收明文，RSA解密，使用时自行修改该函数体内容
    console.log("RSA解密后：" + plainText)
})
