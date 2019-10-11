<!-- 资源管理-添加 -->
<template>
  <div>
    <el-dialog
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible="showDialog"
      @close="dialogClosed"
    >
      <el-form
        :model="currentNode"
        ref="formObject"
        :rules="rules"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="资源类型" prop="resType">
          <el-radio-group v-model="currentNode.resType">
            <template v-if="nodeObject.parentType == '1'">
              <el-radio :label="2">链接</el-radio>
            </template>
            <template v-if="nodeObject.parentType == '2'">
              <template v-if="nodeObject.parentCode.length == 3">
                <el-radio :label="1">文本</el-radio>
                <el-radio :label="2">链接</el-radio>
                <el-radio :label="3">Button</el-radio>
              </template>
              <template v-else>
                <el-radio :label="2">链接</el-radio>
                <el-radio :label="3">Button</el-radio>
              </template>
            </template>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="资源名称" prop="resName">
          <el-input v-model="currentNode.resName"></el-input>
        </el-form-item>

        <el-form-item label="路由地址" prop="resUrl">
          <el-input v-model="currentNode.resUrl"></el-input>
        </el-form-item>

        <el-form-item label="组件" prop="resComponent">
          <el-input v-model="currentNode.resComponent"></el-input>
        </el-form-item>

        <el-form-item label="授权机构">
          <el-checkbox
            v-model="currentNode.adminFlag"
            :true-label="trueLabel"
            :false-label="falseLabel"
            disabled
            >海虹</el-checkbox
          >
          <el-checkbox
            v-model="currentNode.hospitalFlag"
            :true-label="trueLabel"
            :false-label="falseLabel"
            disabled
            >医院</el-checkbox
          >
          <el-checkbox
            v-model="currentNode.orgFlag"
            :true-label="trueLabel"
            :false-label="falseLabel"
            disabled
            >企业</el-checkbox
          >
        </el-form-item>

        <el-form-item label="顺序">
          <el-input-number
            v-model="currentNode.seq"
            :min="0"
            :max="10"
          ></el-input-number>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveNode('formObject')"
          >保存</el-button
        >
        <el-button @click="tallDataListChanged">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as api from "@/api";

  export default {
  props: {
    dialogTitle: "",
    showDialog: false,
    nodeObject: Object
  },
  data() {
    var validateResType = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入资源类型"));
      } else {
        callback();
      }
    };
    var validateResComponent = (rule, value, callback) => {
      if (this.currentNode.resType == "2" && value == "") {
        callback(new Error("请输入组件"));
      } else {
        callback();
      }
    };
    var validateResUrl = (rule, value, callback) => {
      if (this.currentNode.resType == "2" && value == "") {
        callback(new Error("请输入路由地址"));
      } else {
        callback();
      }
    };
    return {
      myShowDialog: this.showDialog,
      currentNode: {
        resUrl: "",
        resType: "",
        resName: "",
        resComponent: "",
        resCode: "",
        adminFlag: 0,
        hospitalFlag: 0,
        orgFlag: 0,
        seq: 0
      },
      trueLabel: 1,
      falseLabel: 0,
      rules: {
        resName: [
          { required: true, message: "请输入资源名称", trigger: "blur" }
        ],
        resType: [{ validator: validateResType, trigger: "change" }],
        resComponent: [{ validator: validateResComponent, trigger: "blur" }],
        resUrl: [{ validator: validateResUrl, trigger: "blur" }]
      }
    };
  },
  watch: {
    showDialog: function(n, o) {
      this.myShowDialog = n;
    },
    nodeObject: function(n) {
      console.log("---", n);
      this.currentNode = Object.assign({}, n);
    }
  },
  mounted: function() {
    // console.log("myShowDialog", this.myShowDialog);
  },
  methods: {
    handleSaveNode: function(formName) {
      let _this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (confirm("确认保存资源吗?")) {
            if (this.currentNode.resType != "2") {
              this.currentNode.resComponent = "";
            }
            let params = Object.assign({}, { param: this.currentNode });
            api
              .saveResApi(params)
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
                console.log("api saveResApi error", err);
              });
          } else {
            _this.tallDataListChanged();
          }
        } else {
          return false;
        }
      });
    },
    dialogClosed: function() {
      this.currentNode = {};
      this.$emit("update:show-dialog", false);
    },
    tallDataListChanged: function() {
      this.dialogClosed();
      this.$emit("refreshList");
    }
  }
};
</script>
