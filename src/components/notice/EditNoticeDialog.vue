<!-- 添加通知 -->
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
        <el-form-item
          label="收件机构"
          prop="orgId"
          v-if="dialogTitle != '修改通知'"
        >
          <el-select
            v-model="currentData.orgId"
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="loadOrgOptions"
            :loading="loading"
          >
            <el-option
              v-for="item in orgOptions"
              :key="item.id"
              :label="item.orgName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="currentData.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input
            type="textarea"
            :rows="5"
            v-model="currentData.content"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSave">保存</el-button>
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
    noticeObj: Object
  },
  data() {
    return {
      dialogTop: "5vh",
      loading: false,
      currentData: {},
      orgOptions: [],
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { max: 100, message: "长度 100 个字符以内", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入内容", trigger: "blur" },
          { max: 1000, message: "长度 500 个字符以内", trigger: "blur" }
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
        this.currentData = Object.assign({}, this.noticeObj);
      }
    }
  },
  methods: {
    loadOrgOptions: function(keyword) {
      let _this = this;
      let param = {
        sysId: _this.currentData.sysId,
        orgName: keyword
      };
      api
        .queryOrgListApi(param)
        .then(rs => {
          if (rs.result === 200) {
            _this.orgOptions = rs.data;
          } else {
            _this.$notify.error({
              title: "提示",
              message: rs.exceptionMsg
            });
            _this.tallDataListChanged();
          }
        })
        .catch(err => {
          _this.tallDataListChanged();
          console.log("api saveNoticeApi error", err);
        });
    },
    handleSave: function() {
      let _this = this;
      console.log("", _this.currentData);
      this.$refs["formObject"].validate(valid => {
        if (valid) {
          if (confirm("确认保存?")) {
            api
              .saveNoticeApi(_this.currentData)
              .then(rs => {
                if (rs.result === 200) {
                  _this.$notify.success({
                    title: "提示",
                    message: rs.message
                  });
                } else {
                  _this.$notify.error({
                    title: "提示",
                    message: rs.exceptionMsg
                  });
                }
                _this.tallDataListChanged();
              })
              .catch(err => {
                _this.tallDataListChanged();
                console.log("api saveNoticeApi error", err);
              });
          }
        } else {
          return false;
        }
      });
    },
    dialogClosed: function() {
      this.orgOptions = [];
      this.$refs["formObject"].resetFields();
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
