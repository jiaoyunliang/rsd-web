<!-- 企业-医院-用户添加 -->
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
        <el-form-item label="账号" prop="userName">
          <el-input
            v-model="currentData.userName"
            style="width:240px"
            :disabled="isEdit"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="currentData.password" style="width:240px" />
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
    accountObj: Object
  },
  data() {
    return {
      dialogTop: "5vh",
      loading: false,
      currentData: {},
      isEdit: false,
      rules: {
        userName: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { max: 20, message: "长度 20 个字符以内", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
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
      if (n == true) {
        this.currentData = Object.assign({}, this.accountObj);
        if (this.dialogTitle == "添加账号") {
          this.isEdit = false;
        } else {
          this.isEdit = true;
        }
      }
    }
  },
  methods: {
    handleSaveAccount: function() {
      let _this = this;
      // console.log("", _this.currentData);
      this.$refs["formObject"].validate(valid => {
        if (valid) {
          if (_this.isEdit) {
            api
              .updateAccountApi(_this.currentData)
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
                console.log("updateAccountApi error", err);
              });
          } else {
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
          }
        } else {
          return false;
        }
      });
    },
    dialogClosed: function() {
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
