<!-- 管理端-用户添加 -->
<template>
  <div>
    <el-dialog
      :top="dialogTop"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible="showDialog"
      @close="tallDataListChanged"
    >
      <el-form
        :model="currentData"
        :rules="rules"
        ref="formObject"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="权限名称" prop="roleId">
          <el-select v-model="currentData.roleId" style="width:240px">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="账号" prop="userName">
          <el-input
            v-model="currentData.userName"
            style="width:240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="currentData.password"
            type="password"
            style="width:240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="姓名" prop="nickname">
          <el-input
            v-model="currentData.nickname"
            style="width:240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="currentData.email" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="currentData.mobile" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="微信">
          <el-input v-model="currentData.wx" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="服务专员" prop="isService">
          <el-radio v-model="currentData.isService" :label="0">否</el-radio>
          <el-radio v-model="currentData.isService" :label="1">是</el-radio>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveAccount">保存</el-button>
        <el-button @click="tallDataListChanged">关闭</el-button>
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
    showDialog: false,
    orgId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      dialogTop: "5vh",
      loading: false,
      currentData: {
        orgId: "",
        roleId: "",
        userName: "",
        password: "",
        nickname: "",
        email: "",
        mobile: "",
        wx: "",
        enabledState: 0,
        sysId: 1,
        isService: 0
      },
      roleOptions: [],
      rules: {
        roleId: [{ required: true, message: "请选择权限", trigger: "change" }],
        userName: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { max: 20, message: "长度 20 个字符以内", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { max: 20, message: "长度 20 个字符以内", trigger: "blur" }
        ],
        nickname: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          { max: 20, message: "长度 20 个字符以内", trigger: "blur" }
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          },
          { max: 40, message: "长度 40 个字符以内", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { max: 20, message: "长度 20 个字符以内", trigger: "blur" }
        ]
      }
    };
  },
  created: function() {},
  mounted: function() {},
  computed: {},
  watch: {
    showDialog: function(n, o) {
      // console.log("showDialog", n, this.orgId);
      if (n == true) {
        this.currentData.orgId = this.orgId;
        this.handleQueryRoleOptions();
      }
    }
  },
  methods: {
    handleQueryRoleOptions: function() {
      let _this = this;
      _this.roleOptions = [];
      _this.currentData.roleId = "";
      if (_this.currentData.orgId != "") {
        let params = {
          sysId: 1,
          orgId: _this.currentData.orgId,
          isDel: 0
        };
        api
          .queryRoleListBySysIdApi(params)
          .then(rs => {
            if (rs.result === 200) {
              if (rs.data != null && rs.data.length > 0) {
                _this.roleOptions = rs.data;
              }
            } else {
              this.$notify.error({
                title: "提示",
                message: rs.message
              });
            }
          })
          .catch(err => {
            console.log("queryRoleListBySysIdApi error", err);
          });
      }
    },
    handleSaveAccount: function() {
      let _this = this;
      // console.log("", _this.currentData);
      this.$refs["formObject"].validate(valid => {
        if (valid) {
          api
            .saveAccountApi(_this.currentData)
            .then(rs => {
              if (rs.result === 200) {
                _this.$notify.success({
                  title: "提示",
                  message: rs.message
                });
              } else {
                _this.$notify.error({
                  title: "提示",
                  message: rs.message
                });
              }
              _this.tallDataListChanged();
            })
            .catch(err => {
              _this.tallDataListChanged();
              console.log("saveAccountApi error", err);
            });
        } else {
          //   console.log("error submit!!");
          return false;
        }
      });
    },
    dialogClosed: function() {
      this.$refs["formObject"].resetFields();
      this.roleOptions = [];
      this.$emit("update:show-dialog", false);
    },
    tallDataListChanged: function() {
      this.dialogClosed();
      this.$emit("refreshList");
    }
  }
};
</script>

<style></style>
