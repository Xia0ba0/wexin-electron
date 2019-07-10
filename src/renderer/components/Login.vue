<template>
  <div class="login-page">
    <div class="bg-wrap"></div>
    <div class="login-wrap">
      <p class="toolbar text-right" style="-webkit-app-region: drag">
        <a
          href="javascript:void(0)"
          class="popper-link"
          title="最小化"
          @click="minimize"
          style="-webkit-app-region: no-drag"
        >
          <i class="icon icon-minimize"></i>
        </a>
        <a
          href="javascript:void(0)"
          class="popper-link max-link"
          title="最大化"
          @click="maximize"
          style="-webkit-app-region: no-drag"
        >
          <i class="icon" :class="maximized ? 'icon-unmaximize' : 'icon-maximize'"></i>
        </a>
        <a
          href="javascript:void(0)"
          class="popper-link close-link"
          title="关闭"
          @click="close"
          style="-webkit-app-region: no-drag"
        >
          <i class="icon icon-close"></i>
        </a>
      </p>
      <form>
        <p>
          <label>邮箱名</label>
          <input type="email" v-model="user.email" required />
        </p>
        <p>
          <label>密码</label>
          <input type="password" v-model="user.password" @keyup.enter="signIn" required />
        </p>
        <p class="text-center">
          <a href="javascript:void(0)" class="btn btn-login" @click="signIn">登录</a>
          <router-link :to="{path: '/regist'}" class="regist-link">没有账号？注册一个！</router-link>
        </p>
      </form>
    </div>
  </div>
</template>
<script>
import { ipcRenderer } from "electron";

export default {
  data() {
    return {
      user: {
        email: "",
        password: ""
      },
      maximized: false
    };
  },
  mounted() {
    // if (localStorage.getItem('isLogged')) {
    //     this.$router.push({
    //         "path": '/weixin'
    //     })
    // }
  },
  methods: {
    signIn() {
      if (this.user.email && this.user.password) {
        this.$store
          .dispatch("signIn", {
            ...this.user
          })
          .then(res => {
            if (res.data.message === "Success") {
              ipcRenderer.send("rsa-generate"); //发送生成RSA公钥请求
              ipcRenderer.on("rsa-keys", (event, pubKey, priKey) => {
                // 接收公私钥并写入localStorage，使用时根据需求修改该函数体内容
                console.log("pubKey:" + pubKey);
                console.log("priKey:" + priKey);
                localStorage.setItem("pubKey", pubKey);
                localStorage.setItem("priKey", priKey);
                this.$store
                  .dispatch("TransportPublickey", {
                    key: localStorage.getItem("pubKey")
                  })
                  .then(res => {
                    if (res.data.message === "Success") {
                      console.log("Transport publickey Success");
                    }
                  })
                  .then(res => {
                    this.$router.push({
                      path: "/weixin"
                    });
                  });
              });
            } else if (res.data.message === "Error") {
              alert(res.data.Error);
            }
          });
      }
    },
    maximize() {
      ipcRenderer.send("max");
      this.maximized = !this.maximized;
    },
    minimize() {
      ipcRenderer.send("min");
    },
    close() {
      ipcRenderer.send("close");
    }
  }
};
</script>
<style lang="less" scoped>
.login-page {
  .bg-wrap {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-image: url("~@/assets/images/8.jpg");
    background-size: cover;
    background-position: center;
  }
  .login-wrap {
    position: absolute;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.3);
    width: 100%;
    height: 100%;
  }
  form {
    width: 460px;
    height: 360px;
    margin: 0 auto;
    position: absolute;
    top: 52.5%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 5px;
    padding: 45px 50px 30px 50px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    box-shadow: 0 0 20px 1px #4b4b4b;
    p {
      label {
        display: block;
        margin-bottom: 5px;
      }
      input {
        padding: 8px;
        width: 90%;
        border-radius: 3px;
        border: 1px solid #ccc;
        font-size: 14px;
        &:focus {
          border:1px solid #4aa8ff;
        }
      }
    }
  }
  .btn-login {
    display: inline-block;
    width: 60px;
    padding: 10px;
    border-radius: 15px;
    background-color: #ffffff;
    border: 1.5px solid #2192da;
    color: #2192da;
    &:hover {
      background-color: #2192da;
      color: #ffffff;
    }
  }
  .regist-link {
    display: block;
    margin-top: 8px;
    font-size: 15px;
    color: inherit;
  }
  .toolbar {
    background-color: #fff;
    opacity:0.6;
    .popper-link {
      padding: 5px 10px;
      display: inline-block;
      &:hover{
        background-color: #c7c7c7;
      }
    }
  }
}
</style>
