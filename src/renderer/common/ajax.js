import axios from 'axios'
import {Loading} from 'element-ui'
import thisvue from '../main.js'
import Message from '../plugin/message'
var options = {
    baseURL: 'http://localhost:8090',
    withCredentials: true
}
var _ajax = axios.create(options)

// 添加请求拦截器
var loading
_ajax.interceptors.request.use(config => {
    // 请求前到请求到数据这段时间用加载动画来代替，以服务方式调用
    loading = Loading.service({
        fullscreen: true,
        text: '拼命加载中...'
    })
    return config
}, error => {
    // loading = Loading.service({})
    loading.close() // 关闭加载前，记得重新定义实例
    Message.$error('加载超时')
    return Promise.reject(error)
})

// http response 拦截器
_ajax.interceptors.response.use(response => {
    // loading = Loading.service({})
    loading.close()
    return response
},
error => {
    // loading = Loading.service({
    //     "fullscreen": true,
    //     "text": '拼命加载中...'
    // })
    loading.close()
    Message.$error('加载失败')
    return Promise.reject(error)
})

var ajax = {
    get (url, noAlert = false) {
        return _ajax.get(url)
            .then(res => {
                if (res.data.message === 'Success') {
                    return res.data
                } else {
                    return Promise.reject(res)
                }
            })
            .catch(err => {
                console.log(err)
                /*
                if (err.data.errorId === 999) {
                    !noAlert && Message.$error(err.data.message)
                    thisvue.$router.push('/')
                } else {
                    !noAlert && Message.$error(err.data.message)
                }
                */
                return Promise.reject(err)
            })
    },
    post (_url, data) {
        let datas = {
            ...data
        }
        // let _url = url + '?ck=' + encodeURIComponent(localStorage.getItem('ck') || '')
        return _ajax.post(_url, JSON.stringify(datas))
            .catch(err => {
                console.log(err)
                /*
                if (err.data.errorId === 999) {
                    Message.$error(err.data.message)
                    thisvue.$router.push('/')
                } else {
                    Message.$error(err.data.message)
                }
                */
                return Promise.reject(err)
            })
    },
    postform (url, data) {
        let config = {
            headers: {'Content-Type': 'multipart/form-data'}
        }
        let _url = url + '?ck=' + encodeURIComponent(localStorage.getItem('ck') || '')
        return _ajax.post(_url, data, config)
            .then(res => {
                if (res.data.success) {
                    return res.data
                } else {
                    return Promise.reject(res)
                }
            })
            .catch(err => {
                console.log(err)
                if (err.data.errorId === 999) {
                    Message.$error(err.data.message)
                    thisvue.$router.push('/')
                } else {
                    Message.$error(err.data.message)
                }
                return Promise.reject(err)
            })
    }
}

export default ajax
