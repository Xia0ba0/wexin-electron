import ajax from '@/common/ajax.js'
const state = {
    user: {},
    isLogged: false
}

const mutations = {
    setUser (state, data) {
        if (data) {
            state.user = data
            state.user.image = "https://ae01.alicdn.com/kf/HTB1LXf3XuH2gK0jSZFE763qMpXaw.png"
            localStorage.setItem('username', data.email)
        } else {
            state.user = {}
            localStorage.setItem('username', '')
        }
    },
    setIsLogged (state, booldata) {
        if (booldata) {
            state.isLogged = true
            localStorage.setItem('isLogged', true)
        } else {
            state.isLogged = false
            localStorage.setItem('isLogged', false)
        }
    },
    setUserImage (state, url) {
        state.user.image = url
    },
    setCookie (data) {
        localStorage.setItem('Cookie', data)
    }
}

const actions = {
    /*getUserInfo (store) {
        return ajax.get('/chat/user/get_user_info', {}, true).then(res => {
            store.commit('setUser', {
                ...res.data
            })
            return res
        })
    },*/
    /*
    saveUserInfo (store, data) {
        return ajax.post('/chat/user/save_info', data).then(res => {
            alert('保存成功')
            store.commit('setUser', {
                ...res.data.userInfo
            })
            return res
        })
    },*/
    AddFriend (store, data) {
        //console.log(data)
        return ajax.post('/friend/request', data)
    },
    ReplyRequest (store, data) {
        //console.log(data)
        return ajax.post('/friend/handlerequest', data)
    },
    DeleteFriend (store, data) {
        console.log(data)
        return ajax.post('/friend/delete', data)
    },
    TransportPublickey (store, data) {
        //console.log(data)
        return ajax.post('/user/key', data)
    },
    signIn ({commit}, data) {
        return ajax.post('/user/login', data).then((res) => {
            console.log(data)
            commit('setUser',data)
            commit('setIsLogged', true)
            commit('setCookie', res.data.Cookie)
            return res
        })
    },
    signUp (store, data) {
        return ajax.post('/user/register', data)
    },
    signOut ({commit}) {
        return ajax.get('user/logout')
            .then((res) => {
                commit('setUser', null)
                commit('setIsLogged', false)
                commit('setCookie', '')
                return res
            })
    },
    uploadUserImage (store, data) {
        return ajax.postform('/chat/user/upload_head_img', data).then(res => {
            alert(res.data.message)
            store.commit('setUserImage', res.data.src)
        })
    },
    getUsers () {
        let contactlists = []
        return ajax.get('/friend/get').then(res=>{
            res.data.onlineUsers.map(item=>{
                contactlists.push({
                    image:'https://ae01.alicdn.com/kf/HTB1LXf3XuH2gK0jSZFE763qMpXaw.png',
                    isLogin:true,
                    name:item.username,
                    key:item.key,
                    ip:item.ip,
                    port:item.port
                })
            })
            res.data.offlineUsers.map(item=>{
                contactlists.push({
                    image:'https://ae01.alicdn.com/kf/HTB1LXf3XuH2gK0jSZFE763qMpXaw.png',
                    isLogin:false,
                    name:item.username,
                    key:item.key,
                    ip:"",
                    port:0
                })
            })
            return contactlists
        })
    }
}

var getters = {}

export default {state, mutations, actions, getters}
