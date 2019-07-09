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
import { ipcRenderer, remote } from "electron";
import log from "@/common/fs.js";
const crypto = remote.getGlobal("sharedObject").crypto;
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
              log.mkdir("log/"); // 创建这个用户log的文件夹
              log.mkdir("log/" + this.user.email + "/"); // 创建这个用户log的文件夹

              var keyObject = crypto.rsa_generate();
              localStorage.setItem("pubKey", keyObject.pubKey);
              localStorage.setItem("priKey", keyObject.priKey);
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
    background-image: url("~@/assets/images/bg.jpg");
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
    height: 440px;
    margin: 0 auto;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: #fff;
    border-radius: 5px;
    padding: 50px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
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
      }
    }
  }
  .btn-login {
    display: inline-block;
    width: 60px;
    padding: 10px;
    border-radius: 3px;
    background-color: #009688;
    border: 1px solid #038075;
    color: #fff;
  }
  .regist-link {
    display: block;
    margin-top: 10px;
    color: inherit;
  }
  .toolbar {
    background-color: #fff;
    .popper-link {
      padding: 5px 10px;
      display: inline-block;
    }
  }
}
</style>
