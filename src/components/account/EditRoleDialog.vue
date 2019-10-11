<!-- 角色-添加-修改 -->
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
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="权限名称">
          <el-input v-model="currentData.name" style="width:240px"></el-input>
        </el-form-item>
      </el-form>
      <div style="height:400px;overflow-y:auto">
        <el-tree
          :data="treeData"
          :props="defaultProps"
          :expand-on-click-node="false"
          :check-strictly="true"
          show-checkbox
          node-key="id"
          highlight-current
          default-expand-all
          :default-checked-keys="treeSelectData"
          ref="tree"
          @check="handleNodeClick"
        ></el-tree>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveRole">保存</el-button>
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
    roleObject: Object,
    resData: Array,
    roleResList: Array
  },
  data() {
    return {
      dialogTop: "5vh",
      myShowDialog: this.showDialog,
      loading: false,
      treeData: [],
      treeSelectData: [],
      currentData: {},
      defaultProps: {
        children: "children",
        label: "resName",
        id: "id"
      }
    };
  },
  watch: {
    showDialog: function(n, o) {
      this.myShowDialog = n;
    },
    roleObject: function(n, o) {
      this.currentData = Object.assign({}, n);
    },
    resData: function(n, o) {
      this.treeData = [...n];
    },
    roleResList: function(n, o) {
      this.treeSelectData = [...n];
      // console.log("treeSelectData", this.treeSelectData);
      // this.$nextTick(function() {
      //   this.$refs.tree.setCheckedKeys([5, 16], true);
      // });
    }
  },
  mounted: function() {},
  computed: {
    orgId() {
      return this.$store.getters.currentUser.orgId;
    }
  },
  methods: {
    handleNodeClick(a, b) {
      let node = this.$refs.tree.getNode(a.id);
      let flag = false;
      let tmp = 0;
      // console.log("-----", node);
      if (node.level === 1) {
        if (node.checked) {
          flag = node.checked;
          this.$refs.tree.setChecked(a.id, true);
        } else {
          tmp = node.childNodes.length;
          if (tmp > 0) {
            node.childNodes.forEach(item => {
              if (item.checked === false) {
                tmp = tmp - 1;
              }
            });
            if (tmp !== 0) {
              this.$refs.tree.setChecked(a.id, true);
              this.$message({
                message: "请先取消子节点！",
                type: "error"
              });
            }
          }
        }
      } else {
        if (node.checked) {
          flag = node.checked && node.parent.checked;
          // console.log("-----", node, node.checked, node.parent.checked, flag);
          if (flag) {
            this.$refs.tree.setChecked(a.id, flag);
          } else {
            this.$refs.tree.setChecked(a.id, flag);
            this.$message({
              message: "请先勾选父节点！",
              type: "error"
            });
          }
        } else {
          // console.log("-----", node);
          tmp = node.childNodes.length;
          if (tmp > 0) {
            node.childNodes.forEach(item => {
              if (item.checked === false) {
                tmp = tmp - 1;
              }
            });
            if (tmp !== 0) {
              this.$refs.tree.setChecked(a.id, true);
              this.$message({
                message: "请先取消子节点！",
                type: "error"
              });
            }
          }
        }
      }
    },
    handleClearOrg() {
      this.orgOptions = [];
    },
    handleSaveRole() {
      let resTmp = this.$refs.tree.getCheckedNodes(false, true);
      let resIds = [];
      let _this = this;
      resTmp.forEach((item, i) => {
        resIds.push(item.id);
      });

      if (_this.currentData.name == "") {
        _this.$message({
          message: "请填写权限名称！",
          type: "error"
        });
        return;
      }

      if (resIds.length > 0) {
        _this.currentData.resIds = resIds;
        if (confirm("确认保存吗?")) {
          api
            .saveRoleApi(_this.currentData)
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
              console.log("saveRoleApi error", err);
            });
        }
      } else {
        _this.$message({
          message: "请选择资源！",
          type: "error"
        });
      }
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
