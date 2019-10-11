<!-- 添加医院 -->
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
        <el-form-item label="医院名称" prop="orgName">
          <el-input
            v-model="currentData.orgName"
            style="width:240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="权限" prop="orgLevel">
          <el-select v-model="currentData.orgLevel" style="width:240px">
            <el-option
              v-for="item in roleOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="到期时间" prop="expireDate">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="currentData.expireDate"
            style="width:240px"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="联系人" prop="contact">
          <el-input
            v-model="currentData.contact"
            style="width:240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="currentData.mobile" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="currentData.email" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="地区">
          <el-input v-model="currentData.area" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="currentData.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveOrg">保存</el-button>
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
    orgObject: Object
  },
  data() {
    return {
      dialogTop: "5vh",
      loading: false,
      currentData: {},
      roleOptions: [],
      rules: {
        orgLevel: [
          { required: true, message: "请选择权限", trigger: "change" }
        ],
        orgName: [
          { required: true, message: "请输入医院名称", trigger: "blur" },
          { max: 40, message: "长度 40 个字符以内", trigger: "blur" }
        ],
        contact: [
          { required: true, message: "请输入联系人", trigger: "blur" },
          { max: 40, message: "长度 40 个字符以内", trigger: "blur" }
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
        ],
        expireDate: [
          { required: true, message: "请选择到期时间", trigger: "change" }
        ],
        remark: [{ max: 80, message: "长度 80 个字符以内", trigger: "blur" }]
      }
    };
  },
  created: function() {},
  mounted: function() {},
  computed: {},
  watch: {
    showDialog: function(n, o) {
      if (n == true) {
        this.currentData = Object.assign({}, this.orgObject);
        this.handleQueryRoleOptions();
      }
    }
  },
  methods: {
    handleQueryRoleOptions: function() {
      let _this = this;
      _this.roleOptions = [];
      if (_this.currentData.sysId != "") {
        let params = {
          sysId: _this.currentData.sysId,
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
    handleSaveOrg() {
      let _this = this;
      this.$refs["formObject"].validate(valid => {
        if (valid) {
          if (confirm("确认保存?")) {
            // console.log("", _this.currentData);
            api
              .saveOrgApi(_this.currentData)
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
                console.log("api saveOrgApi error", err);
              });
          } else {
            _this.tallDataListChanged();
          }
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
