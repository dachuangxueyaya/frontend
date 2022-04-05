<template>
  <div id="login">
    <div class="login_img">
      <div class="login_tit">
        <div></div>
        <div>医疗管理后台</div>
        <div></div>
      </div>
    </div>
    <div class="login_con">
      <div class="login_form">
        <h3>登录</h3>
        <el-form :label-position="labelPosition" :model="form">
          <el-form-item>
            <el-input
              class="phone"
              prefix-icon="el-icon-user-solid"
              v-model="form.number"
              placeholder="请输入账号"
            >
            </el-input>
            <!-- <el-button class="getnum" round type="primary" @click="postCode"
              >获取验证码</el-button
            > -->
          </el-form-item>
          <el-form-item>
            <el-input
              prefix-icon="el-icon-s-goods"
              suffix-icon="el-icon-view"
              type="password"
              v-model="formInline.password"
              placeholder="请输入登录密码"
              @keyup.enter.native="handleSubmit('formInline')"
            ></el-input>
            <!-- 在input中放入小图标 -->
            <!-- 记住按钮的单选框 -->
            <el-checkbox v-model="single">记住密码</el-checkbox> 
          </el-form-item>
          <el-form-item>
            <el-select 
             v-model="form.fileOrgType" 
             placeholder="请选择登录角色"
            >
            <!-- 这里还需要后端的接口进行配合，每个角色分配一个value -->
            <el-option label="医生" value="Y"> </el-option>
            <el-option label="普通用户" value="N"></el-option>
            <el-option label="管理员" value="N"></el-option>
          </el-select>
          </el-form-item>
          <div class="passwordForget">
            <h4>忘记密码?</h4>
          </div>
          <div class="registerLogin">
            <h4 @click="register">没有账号？点击注册</h4>
          </div>
          <el-form-item>
            <el-button class="login" round type="primary" @click="login"
              >登录</el-button
            >
          </el-form-item>
        </el-form>
        <!-- 使用element-ui定义form表单，在样式上做一些调整 -->
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data(){
    return {
      title: {
        instumentPane1: "仪表盘"
      },
      // 登录弹窗
      visible: false,
      // 控制退出按钮的显示和隐蔽
      show: false,
      // 定义空准备接受
      name: ""
    };
  },
  watch: {},
  // 在computed中自定义一个方法，定义一个并取出存入的用户名后返回
  computed: {
    username() {
      let username = localStorage.getItem("userInfo");
      return username ? username : this.name;
    }
  },

  // 调用
  mounted(){
    this.getCookie();
  },

  
  methods: {
    // postCode() {
    //   this.$http("/shiro/getCode", "get", {
    //     phone: this.form.phone,
    //   }).then((res) => {
    //     this.$message({
    //       message: `验证码是` + res.result,
    //       type: "success",
    //     });
        // console.log(res);
    //   });
    //   // 请求登录接口，传递的参数是用户账号与密码
    // },



    // 调用用户登录接口
    handleSubmit(name) {
      // 判断单选框是否被选中
      if (this.single == true) {
        console.log("checked == true");
        //传入账号名，密码，和保存天数7天
        this.setCookie(this.formInline.account, this.formInline.password, 7);
      } else {
        console.log("清空Cookie");
        //清空Cookie
        this.clearCookie();
      }
      if (!this.formInline.account && !this.formInline.password) {
        this.$Message.error("请输入用户名和密码");
      } else if (!this.formInline.account) {
        this.$Message.error("请输入用户名");
      } else if (!this.formInline.password) {
        this.$Message.error("请输入密码");
      } else {
      this.$refs[name].validate(valid => {
        // 将输入框中的用户名和密码打包，准备发送给后端接口
        let val = {
          account: this.formInline.account,
          password: this.formInline.password
        };
        if (valid) {
          // 把输入框的值发送给后端
          this.$ajax.post("shiro/login", val).then(res => {
            console.log(res);
            // 判断后端数据data中的状态码是否为成功码（200）
            if (res.data.code == 200) {
              // 判断是成功码后，调用获取用户信息的方法
              this.initUserInfo();
              this.$$Message.success({
                content: "登录成功",
                duration: 0.3
              });
            }else {
              // 不成功后返回的错误提示信息给前端
              this.$Message.error("用户名不存在，或密码错误");
            }
          });
        } else {
          return false;
        }
      });
      }
    },
    // 获取用户信息自定的调用接口方法
    initUserInfo() {
      this.$ajax.get("/shiro/getUserInfo").then(res => {
        console.log(res);
        // 后端数据的data值
        const userInfo = res.data.data;
        // 将输入框的值存入localStorage中
        localStorage.setItem("userInfo", this.formInline.account);
        // 通过commit调用mutations中的方法mutation方法就是传递的值
        this.$store.commit("changeUserInfo", JSON.stringify(userInfo));
        // 完成后的操作
        this.$router.push({ path:"/tabbar" });
        this.$Message.success({
          content: "登录成功",
          duration: 0.3
          });
      });
    },

    // 获取用户信息
    initUserInfo() {
      this.$ajax.get("/shiro/getUserInfo").then(res => {
        const userInfo = res.data.data;
        // 存储绑定的用户名
        localStorage.setItem("userInfo", this.formInline.account);
        this.$store.commit("changeUserInfo", JSON.stringify(userInfo));
        this.$router.push({ path: "/tabbar" });
        this.$Message.success("登录成功");
      });
    },

    // 调用注册接口
    // register() {

    // }

    // 显示退出按钮
    showQuitBtn() {
      this.show = !this.show;
    },

    // 退出接口
    alertQuit() {
      // 清空localStorage
      localStorage.clear();
      // 清楚登录信息
      this.$store.commit("$_removeStorage");
      this.$router.push({
        name: "login"
      });
    },

    // 设置cookie
    setCookie(c_name, c_pwd, exdays) {
      // 获取时间
      var exdate = new Date();
      // 保存的天数
      exdate.setTime(exdate.getTime() + 24 * 60 * 60 * 1000 * exdays);
      //  字符串拼接cookie
      window.document.cookie =
        "userName" + "=" + c_name + ";path=/;expires=" + exdate.toGMTString();
      window.document.cookie =
        "userPwd" + "=" + c_pwd + ";path=/;expires=" + exdate.toGMTString();
    },

    // 读取cookie
    getCookie: function() {
      if(document.cookie.length > 0) {
        // 这里显示的格式需要切割一下
        var arr = document.cookie.split("; ");
        for (var i = 0; i < arr.length; i++) {
          // 再次切割
          var arr2 = arr[i].split("=");
          // 判断查找相对应的值
          if (arr2[0] == "userName") {
            // 保存到保存数据的地方————用户名
            this.formInline.account = arr2[1];
          }else if (arr2[0] == "userPwd") {
            // 保存到保存数据的地方——密码
            this.formInline.password = arr2[1];
          }
        }
      }
    },

    // 清除cookie
    clearCookie: function() {
      // 修改2值都为空，天数为-1天
      this.setCookie("", "", -1);
    }
  },
};
</script>
<style lang="scss" scope>
body,
html {
  width: 100%;
  height: 100%;
}

#login {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: left;
  align-items: center;
  min-height: 550px;
  min-width: 1200px;
  .login_img {
    height: 100%;
    width: 60%;
    position: absolute;
    background: url(../assets/img/login2.png) right center;

    left: 0px;
    .login_tit {
      display: flex;
      margin-left: 200px;
      font-size: 30px;
      color: #fff;
      div:nth-child(1) {
        width: 0;
        height: 0;
        border-bottom: 50px solid #16dcb8;
        border-left: 30px solid transparent;
      }
      div:nth-child(2) {
        background: #16dcb8;
        width: 230px;
        text-align: center;
        line-height: 50px;
      }
      div:nth-child(3) {
        width: 0;
        height: 0;
        border-top: 50px solid #16dcb8;
        border-right: 30px solid transparent;
      }
      // div:
    }
  }
  .login_con {
    width: 94%;
    height: 80%;
    background: #f2f3f7;
    overflow: hidden;

    .login_form {
      width: 300px;
      float: right;
      margin-right: 200px;
      margin-top: 100px;

      h3 {
        width: 120px;
        font-size: 22px;
        color: #30c0e0;
        border-bottom: 2px solid #30c0e0;
        padding-bottom: 20px;
        margin-bottom: 30px;
        font-weight: normal;
      }
      h4 {
        font-size: 15px;
        color: #30c0e0;
        font-weight: normal;
        padding-left: 10px;
        margin-top: -7px;
      }

      .el-input__inner {
        border-radius: 20px;
      }
      .el-button.login {
        width: 100%;
        background: #30c0e0;
        margin-top: 25px;
        border: none;
      }
      .phone {
        width: 65%;
      }
      .getnum {
        width: 90px;
        font-size: 12px;
        background: #30c0e0;
        padding: 12px;
        margin-left: 5px;
      }
    }
  }
}
</style>