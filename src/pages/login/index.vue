<template>
  <div id="login">
    <div class="box">
      <div class="title">用户登录</div>
      <div class="item">
        <span class="label">用户名：</span>
        <el-input v-model="formData.user" suffix-icon="el-icon-phone"></el-input>
      </div>
      <div class="item">
        <span class="label">密码：</span>
        <el-input
          v-model="formData.pwd"
          suffix-icon="el-icon-lock"
          type="password"
          @keyup.enter="login"
        ></el-input>
      </div>
      <div style="display: flex;justify-content: center;">
        <el-button type="primary" style="width: 100%;" @click="login">登 录</el-button>
      </div>
      <div class="bottom_btn">
        <el-button link style="color: #ccc;">忘记密码？</el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, reactive, onBeforeMount } from "vue";
import { ElMessage } from "element-plus";

let formData = reactive({
  user: "",
  pwd: ""
});

// 登录
function login() {
  if (!formData.user || !formData.pwd) {
    ElMessage.error("手机号码和密码不能为空！");
  } else {
    localStorage.setItem("token", "123123");
    // router.push({
    //   path: "/"
    // });
  }
}

// export default {
//   data() {
//     return {
//       user: '',
//       pwd: ''
//     };
//   },
//   created() {
//     if (!!localStorage.lastPhone) {
//       this.user = localStorage.lastPhone;
//     }
//   },
//   methods: {
//     login() {
//       if (!this.user || !this.pwd) {
//         this.$message.error('手机号码和密码不能为空！')
//       } else {
//         localStorage.setItem("token", "123123");
//         this.$router.push({
//           path: "/"
//         })
//       }
//     }
//   },
// }
</script>
<style lang="scss" scoped>
#login {
  width: 100vw;
  height: 100vh;
  // background: url(../../assets/images/loginBg.jpg) no-repeat;
  background-size: cover;
  position: relative;
  .box {
    border-radius: 10px;
    background-color: #00000088;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    padding: 30px 40px 15px;
    .title {
      color: #fff;
      font-size: 22px;
      text-align: center;
      padding-bottom: 30px;
      position: relative;
    }
    .title::after {
      left: 0;
    }
    .title::before,
    .title::after {
      content: "";
      position: absolute;
      right: 0;
      top: 50%;
      transform: translate(0, -13px);
      height: 1px;
      width: 125px;
      background-color: #ccc;
    }
    .bottom_btn {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
    }
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 30px;
      .label {
        width: 80px;
        color: #fff;
      }
      .el-input {
        width: 300px;
      }
    }
  }
}
</style>