<!-- ad  修改 -->
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
        <el-form-item label="广告位名称" prop="name">
          <el-input
            v-model="currentData.name"
            style="width:300px;"
            :disabled="true"
          />
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
        <el-form-item label="上传">
          <el-upload
            class="upload-demo"
            ref="elUpload"
            :action="apiServer + '/file/upload'"
            :headers="uploadHeaders"
            accept="image/jpeg,image/gif,image/png"
            :multiple="false"
            :before-upload="handleBeforeUpload"
            :on-exceed="handleExceed"
            :on-preview="handlePreview"
            :before-remove="beforeRemove"
            :on-success="handleSuccess"
            :file-list="fileList"
            list-type="picture"
            :limit="1"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png/gif文件，且不超过1M
            </div>
          </el-upload>
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
      uploadHeaders: {
        token: sessionStorage.getItem("token")
      },
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
        if (
          this.currentData.picPath != null &&
          this.currentData.picPath != ""
        ) {
          this.fileList = [
            {
              response: {
                data: {
                  newFile: this.currentData.picPath.substr(
                    this.currentData.picPath.lastIndexOf("/") + 1
                  ),
                  url: this.currentData.picPath
                }
              },
              name: this.currentData.picPath.substr(
                this.currentData.picPath.lastIndexOf("/") + 1
              ),
              url: this.filePath(this.currentData.picPath)
            }
          ];
        } else {
          this.fileList = [];
        }
      }
    }
  },
  methods: {
    saveAd() {
      let _this = this;
      if (
        _this.$refs.elUpload.uploadFiles == null ||
        _this.$refs.elUpload.uploadFiles.length == 0
      ) {
        this.$notify({
          message: "文件未上传！",
          type: "warning"
        });
        return false;
      }
      _this.$refs["formObject"].validate(valid => {
        if (valid) {
          if (confirm("确认修改?")) {
            _this.currentData.picPath =
              _this.$refs.elUpload.uploadFiles[0].response.data.url;
            // _this.currentData.fileName =
            //   _this.$refs.elUpload.uploadFiles[0].response.data.newFile;
            // console.log("---", _this.currentData);
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
    handleBeforeUpload(file) {
      const isIMAGE = file.type === "image/jpeg" || "image/gif" || "image/png";
      const isLt1M = file.size / 1024 / 1024 < 1;

      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      if (!isLt1M) {
        this.$message.error("上传文件大小不能超过 1MB!");
      }
      return isIMAGE && isLt1M;
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      // this.$message.warning(
      //   `当前限制选择 1 个文件，本次选择了 ${
      //     files.length
      //   } 个文件，共选择了 ${files.length + fileList.length} 个文件`
      // );
      this.$notify.warning({
        title: "提示",
        message: `当前限制选择 1 个文件`
      });
    },
    handleSuccess(response, file, fileList) {
      //   console.log("handleSuccess", response, file, fileList);
    },
    beforeRemove(file, fileList) {
      console.log("beforeRemove", fileList);
      return this.$confirm(`确定移除 ${file.name}？`);
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
