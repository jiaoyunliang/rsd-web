<!-- 医院热门推荐 修改 -->
<template>
  <div>
    <el-dialog
      :top="dialogTop"
      :title="dialogTitle"
      :close-on-click-modal="false"
      width="50%"
      :visible="showDialog"
      @close="dialogClosed"
    >
      <el-form
        :model="currentData"
        ref="formObject"
        :rules="rules"
        label-position="left"
        label-width="100px"
      >
        <el-form-item label="关键字" prop="name">
          <el-input v-model="currentData.name" style="width:300px;" />
        </el-form-item>
        <el-form-item label="链接" prop="adUrl">
          <el-input
            v-model="currentData.adUrl"
            style="width:300px;"
            placeholder="http://"
          />
        </el-form-item>
        <el-form-item label="顺序" prop="seq">
          <el-input-number
            v-model="currentData.seq"
            :min="1"
            :max="100"
            style="width:300px;"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="currentData.status">
            <el-radio :label="0">启用</el-radio>
            <el-radio :label="1">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="saveAd">保存</el-button>
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
    showDialog: false,
    adObject: Object
  },
  data() {
    return {
      dialogTop: "5vh",
      loading: false,
      currentData: {},
      fileList: [],
      rules: {
        name: [
          { required: true, message: "请输入广告位名称", trigger: "blur" },
          { max: 100, message: "长度 100 个字符以内", trigger: "blur" }
        ],
        adUrl: [
          { required: true, message: "请输入链接", trigger: "blur" },
          { max: 100, message: "长度 100 个字符以内", trigger: "blur" },
          { type: "url", message: "请输入正确链接", trigger: "blur" }
        ],
        seq: [{ required: true, message: "请输入顺序值", trigger: "blur" }]
      }
    };
  },
  created: function() {},
  mounted: function() {},
  computed: {},
  watch: {
    showDialog: function(n, o) {
      if (n == true) {
        this.currentData = Object.assign({}, this.adObject);
      }
    }
  },
  methods: {
    saveAd() {
      let _this = this;
      _this.$refs["formObject"].validate(valid => {
        if (valid) {
          if (confirm("确认修改?")) {
            api
              .updateAdApi(_this.currentData)
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
                console.error("api updateAdApi error", err);
              });
          }
        } else {
          return false;
        }
      });
    },
    dialogClosed: function() {
      this.currentData = {};
      this.fileList = [];
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
