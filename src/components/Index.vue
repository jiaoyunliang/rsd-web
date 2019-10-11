<template>
  <div class="login_bt_bg">
    <div class="login_bt_head">
      <img src="../../static/images/lgoin_bt_logo.fw.png" alt="图片" />
    </div>
    <div class="login_bt_table">
      <div class="login_bt_table_cell">
        <div class="login_bt_impor">
          <div class="hspt_header_b">
            <span>Find For You</span> —只为更高效的服务
          </div>
          <div class="login_bt_from">
            <el-form v-bind:model="userObject" :rules="rules" ref="userRef">
              <el-form-item prop="userName">
                <el-input
                  placeholder="请输入用户名"
                  v-model="userObject.userName"
                  @keyup.enter.native="doLogin('userRef')"
                />
              </el-form-item>
              <el-form-item prop="password">
                <el-input
                  type="password"
                  placeholder="请输入密码"
                  v-model="userObject.password"
                  @keyup.enter.native="doLogin('userRef')"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" v-on:click="doLogin('userRef')"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import * as api from "../api";

  export default {
  name: "index",
  data() {
    var validateUsername = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入用户名"));
      } else {
        // if (this.userObject.username !== "") {
        //   this.$refs.userRef.validateField("username");
        // }
        callback();
      }
    };
    var validatePasswd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        // if (this.userObject.password !== "") {
        //   this.$refs.userRef.validateField("password");
        // }
        callback();
      }
    };
    return {
      formLabelWidth: "120px",
      userObject: {
        userName: "admin",
        password: "123456",
        sysId: 1
      },
      rules: {
        userName: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePasswd, trigger: "blur" }]
      }
    };
  },
  created: function() {
    // console.log("index logout");
    this.$store.dispatch("userLogout", {});
  },
  mounted: function() {},
  methods: {
    doLogin: function(formName) {
      let _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          let params = Object.assign({}, _this.userObject);
          let tmp = api
            .login(params)
            .then(rs => {
              if (rs.result === 200) {
                _this.$router.options.routes = [];
                _this.$router.addRoutes([]);
                //console.log("routes a", _this.$router.options.routes);
                _this.$store.dispatch("userLogin", rs.data);
                _this.$store.dispatch("generateRoutes", rs.data.menu);
                _this.$router.options.routes.push(
                  ..._this.$store.getters.routeItems
                );
                _this.$router.addRoutes(_this.$router.options.routes);
                this.$router.push({ path: "/manager" });
              } else {
                this.$notify.error({
                  title: "提示",
                  message: rs.message
                });
              }
            })
            .catch(err => {
              console.log("api login error", err);
            });
        }
      });
    },
    login: function() {
      let _this = this;
    }
  }
};
</script>
<style>
#box-card {
  margin: auto;
  margin-top: 180px;
  width: 480px;
  text-align: center;
}
</style>
