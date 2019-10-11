<!-- 资源管理 -->
<template>
  <div class="Manager">
    <el-row>
      <el-col :span="24"
        ><h1>{{ msg }}</h1></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="12">
        <div style="width: 400px;height:600px;overflow-y:auto">
          <template>
            <el-radio-group v-model="sysId" @change="handleSelSys">
              <el-radio :label="1">管理端</el-radio>
              <el-radio :label="2">医院端</el-radio>
              <el-radio :label="3">企业端</el-radio>
            </el-radio-group>
          </template>
          <el-tree
            :data="data"
            :props="defaultProps"
            highlight-current
            default-expand-all
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          ></el-tree></div
      ></el-col>
      <el-col :span="12">
        <table>
          <tr>
            <td>资源类型:</td>
            <td>
              <el-radio v-model="currentNode.resType" label="1" disabled
                >文本</el-radio
              >
              <el-radio v-model="currentNode.resType" label="2" disabled
                >链接</el-radio
              >
              <el-radio v-model="currentNode.resType" label="3" disabled
                >Button</el-radio
              >
            </td>
          </tr>
          <tr>
            <td>资源名称:</td>
            <td>
              <el-input
                v-model="currentNode.resName"
                size="mini"
                width="20"
                placeholder="请输入内容"
              />
            </td>
          </tr>
          <tr>
            <td>资源编码:</td>
            <td>
              <el-input
                v-model="currentNode.resCode"
                size="mini"
                width="20"
                disabled
              />
            </td>
          </tr>
          <tr>
            <td>路由地址:</td>
            <td>
              <el-input
                v-model="currentNode.resUrl"
                :disabled="currentNode.resType != '2'"
                size="mini"
                width="20"
                placeholder="请输入内容"
              />
            </td>
          </tr>
          <tr>
            <td>组件:</td>
            <td>
              <el-input
                v-model="currentNode.resComponent"
                :disabled="currentNode.resType != '2'"
                size="mini"
                width="20"
                placeholder="请输入内容"
              />
            </td>
          </tr>
          <tr>
            <td>授权机构:</td>
            <td>
              <el-checkbox
                v-model="currentNode.adminFlag"
                :true-label="trueLabel"
                :false-label="falseLabel"
                disabled
              >后台
              </el-checkbox
              >
              <!--el-checkbox
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
              -->
            </td>
          </tr>
          <tr>
            <td>顺序:</td>
            <td>
              <el-input-number
                v-model="currentNode.seq"
                :min="0"
                :max="10"
                size="small"
              />
            </td>
          </tr>
          <tr>
            <td colspan="2">
              <el-button type="primary" v-on:click="handleAddNode(currentNode)"
                >添加子节点</el-button
              >
              <el-button type="primary" v-on:click="handleEditNode(currentNode)"
                >保存修改</el-button
              >
              <el-button
                type="primary"
                v-on:click="handleRemoveNode(currentNode)"
                >删除</el-button
              >
            </td>
          </tr>
        </table>
      </el-col>
      <addResDialog
        :dialog-title="dialogTitle"
        :show-dialog.sync="isShowDialog"
        :node-object="saveNode"
        @refreshList="onRefresNodeList"
      ></addResDialog>
    </el-row>
  </div>
</template>

<script>
  import * as api from "@/api";
  import addResDialog from "@/components/res/AddResDialog";

  export default {
  components: {
    addResDialog
  },
  data() {
    return {
      msg: "资源管理",
      dialogTitle: "",
      isShowDialog: false,
      sysId: 1,
      currentNode: {},
      saveNode: {},
      data: [],
      defaultProps: {
        children: "children",
        label: "resName"
      },
      trueLabel: 1,
      falseLabel: 0
    };
  },
  created: function() {
    this.fetchData();
  },
  mounted: function() {},
  methods: {
    handleSelSys() {
      this.currentNode = {};
      this.fetchData();
    },
    fetchData() {
      let _this = this;
      let params = Object.assign({}, { param: { sysId: _this.sysId } });
      api
        .queryResListApi(params)
        .then(rs => {
          // console.log("api queryResListApi", rs);
          if (rs.result === 200) {
            _this.data = rs.data;
          } else {
            _this.$notify.error({
              title: "提示",
              message: rs.message
            });
          }
        })
        .catch(err => {
          console.log("api login error", err);
        });
    },
    handleNodeClick(data) {
      this.currentNode = Object.assign({}, data);
      // console.log("this.currentNode", this.currentNode);
    },
    handleAddNode(data) {
      if (data && data.id) {
        if (data.resType != 3) {
          this.saveNode = {};
          this.saveNode.parentType = data.resType;
          this.saveNode.parentCode = data.resCode;
          this.saveNode.sysId = data.sysId;
          this.saveNode.resCode = "";
          this.saveNode.resComponent = "";
          this.saveNode.resUrl = "";
          this.saveNode.resType = "";
          this.saveNode.seq = 1;
          this.saveNode.adminFlag = data.sysId == 1 ? 1 : 0;
          this.saveNode.hospitalFlag = data.sysId == 2 ? 1 : 0;
          this.saveNode.orgFlag = data.sysId == 3 ? 1 : 0;

          if (data.children && data.children.length > 0) {
            let tmp = [];
            data.children.forEach(item => {
              tmp.push(item.resCode);
            });
            let maxCode = tmp.sort()[tmp.length - 1];
            // console.log("children max resCode", maxCode);
            let tmpNum = parseInt(maxCode.substring(maxCode.length - 3));
            if (tmpNum >= 999) {
              alert("当前节点不可创建！");
            } else {
              let newCode = "";
              tmpNum = tmpNum + 1;
              if (tmpNum <= 9) {
                newCode =
                  maxCode.substring(0, maxCode.length - 3) + "00" + tmpNum;
              } else if (tmpNum <= 99) {
                newCode =
                  maxCode.substring(0, maxCode.length - 3) + "0" + tmpNum;
              } else {
                newCode = maxCode.substring(0, maxCode.length - 3) + tmpNum;
              }
              this.saveNode.resCode = newCode;
              this.isShowDialog = true;
              this.dialogTitle = "添加资源";
            }
          } else {
            this.saveNode.resCode = data.resCode + "001";
            this.isShowDialog = true;
            this.dialogTitle = "添加资源";
          }
        } else {
          alert("按钮节点不可创建！");
        }
      } else {
        alert("请选择父级节点！");
      }
    },
    handleEditNode(data) {
      // console.log("this.currentNode", this.currentNode);
      if (typeof this.currentNode.id === "undefined") {
        this.$notify.error({
          title: "提示",
          message: "请选择相应的资源！"
        });
      } else {
        if (confirm("确认修改资源吗?")) {
          let params = Object.assign({}, { param: this.currentNode });
          api
            .updateResApi(params)
            .then(rs => {
              if (rs.result === 200) {
                this.currentNode = {};
                this.fetchData();
              } else {
                this.$notify.error({
                  title: "提示",
                  message: rs.message
                });
              }
            })
            .catch(err => {
              console.log("api updateResApi error", err);
            });
        }
      }
    },
    handleRemoveNode(data) {
      if (data && data.id) {
        if (data.children && data.children.length > 0) {
          alert("请先删除子节点！");
        } else {
          if (confirm("确认删除此资源吗?")) {
            let params = Object.assign({}, { param: data.id });
            api
              .delResByIdApi(params)
              .then(rs => {
                // console.log("api delResByIdApi", rs);
                if (rs.result === 200) {
                  this.currentNode = {};
                  this.fetchData();
                } else {
                  this.$notify.error({
                    title: "提示",
                    message: rs.message
                  });
                }
              })
              .catch(err => {
                console.log("delResByIdApi error", err);
              });
          }
        }
      } else {
        alert("请选择要删除的资源！");
      }
    },
    onRefresNodeList: function() {
      this.currentNode = {};
      this.fetchData();
    }
  }
};
</script>

<style scoped></style>
