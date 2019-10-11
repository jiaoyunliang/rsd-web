<!-- 分类设置-添加-修改 -->
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
        ref="formObject"
        :rules="rules"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="分组" prop="groupId">
          <el-select v-model="currentData.groupId" style="width:240px">
            <el-option
              v-for="item in typeGroupOptions"
              :key="item.id"
              :label="item.dictName"
              :value="item.dictId"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="currentData.name" style="width:240px"></el-input>
        </el-form-item>
        <el-form-item label="顺序">
          <el-input-number
            v-model="currentData.seq"
            :min="1"
            style="width:240px"
          ></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveType">保存</el-button>
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
    typeObject: Object
  },
  data() {
    return {
      dialogTop: "5vh",
      loading: false,
      currentData: {},
      typeGroupOptions: [],
      rules: {
        groupId: [{ required: true, message: "请选择分组", trigger: "change" }],
        name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          { max: 100, message: "长度 100 个字符以内", trigger: "blur" }
        ]
      }
    };
  },
  created: function() {},
  mounted: function() {},
  computed: {},
  watch: {
    showDialog: function(n, o) {
      // console.log("showDialog", n);
      if (n == true) {
        this.currentData = this.typeObject;
        this.handleQueryTypeGroup();
      }
    }
  },
  methods: {
    handleQueryTypeGroup() {
      let _this = this;
      let param = {
        dictCategoryId: 9
      };
      api
        .queryDictByCategoryIdApi(param)
        .then(rs => {
          if (rs.result === 200) {
            _this.typeGroupOptions = rs.data;
          } else {
            _this.loading = false;
            _this.$notify.error({
              title: "提示",
              message: rs.message
            });
          }
        })
        .catch(err => {
          console.log("api queryDictByCategoryIdApi error", err);
        });
    },
    handleSaveType() {
      let _this = this;
      this.$refs["formObject"].validate(valid => {
        if (valid) {
          if (_this.dialogTitle == "添加分类") {
            api
              .saveProductTypeApi(_this.currentData)
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
                console.log("saveProductTypeApi error", err);
              });
          } else if (_this.dialogTitle == "修改分类") {
            api
              .updateProductTypeApi(_this.currentData)
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
                console.log("updateProductTypeApi error", err);
              });
          }
        } else {
          //   console.log("error submit!!");
          return false;
        }
      });
    },
    dialogClosed: function() {
      this.currentData = {};
      this.$emit("update:show-dialog", false);
    },
    tallDataListChanged: function() {
      this.dialogClosed();
      this.$emit("refreshList");
    }
  }
};
</script>
