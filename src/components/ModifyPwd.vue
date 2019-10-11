<!-- 修改密码 -->
<template>
  <div>
    <el-dialog
      :top="dialogTop"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible="showDialog"
      @close="dialogClosed"
    >
      <el-form
        :model="currentData"
        :rules="rules"
        ref="formObject"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="原密码" prop="originPwd">
          <el-input
            v-model="currentData.originPwd"
            type="password"
            style="width:240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input
            v-model="currentData.password"
            type="password"
            style="width:240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPass">
          <el-input
            v-model="currentData.checkPass"
            type="password"
            style="width:240px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveAccount">保存</el-button>
        <el-button @click="dialogClosed">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as api from "@/api";

  export default {
  components: {},
  props: {
    dialogTitle: "",
    showDialog: false
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else if (value.length > 20) {
        callback(new Error("长度 20 个字符以内"));
      } else {
        if (this.currentData.checkPass !== "") {
          this.$refs.formObject.validateField("checkPass");
        }
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入确认密码"));
      } else if (value !== this.currentData.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogTop: "5vh",
      loading: false,
      currentData: {
        userName: "",
        originPwd: "",
        password: "",
        checkPass: "",
        sysId: null
      },
      rules: {
        originPwd: [
          { required: true, message: "请输入原密码", trigger: "blur" }
        ],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      }
    };
  },
  created: function() {},
  mounted: function() {},
  computed: {},
  watch: {
    showDialog: function(n, o) {
      if (n == true) {
        this.currentData.userName = this.$store.getters.currentUser.userName;
      }
    }
  },
  methods: {
    handleSaveAccount: function() {
      let _this = this;
      this.$refs["formObject"].validate(valid => {
        if (valid) {
          if (confirm("确认保存吗?")) {
            _this.currentData.sysId = 1;
            api
              .updatePwdApi(_this.currentData)
              .then(rs => {
                if (rs.result === 200) {
                  _this.$notify.success({
                    title: "提示",
                    message: rs.message + " 请重新登录！"
                  });
                  setTimeout(() => {
                    _this.$router.push({ path: "/index" });
                  }, 2000);
                } else {
                  _this.$notify.error({
                    title: "提示",
                    message: rs.message
                  });
                  _this.dialogClosed();
                }
              })
              .catch(err => {
                _this.dialogClosed();
                console.log("updatePwdApi error", err);
              });
          }
        } else {
          return false;
        }
      });
    },
    dialogClosed: function() {
      this.$refs["formObject"].resetFields();
      this.$emit("update:show-dialog", false);
    }
  }
};
</script>

<style></style>
