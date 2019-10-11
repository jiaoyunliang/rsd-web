<!-- 医院角色 -->
<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-button
          type="primary"
          v-if="checkButton('001002002008')"
          @click="handleEditRole('add', null)"
          >添加权限</el-button
        >
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="dataList" style="width: 100%" v-loading="loading">
          <el-table-column
            type="index"
            :index="typeIndex"
            label="序号"
            width="50"
          >
          </el-table-column>
          <el-table-column prop="name" label="权限名称"></el-table-column>
          <el-table-column prop="sysName" label="系统名称"></el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.isDel == 0">正常</span>
              <span v-else>禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                v-if="checkButton('001002002009')"
                @click="handleEditRole('edit', scope.row)"
                >修改</el-button
              >
              <span v-if="scope.row.isDel === 0"
                ><el-button
                  type="danger"
                  size="mini"
                  v-if="checkButton('001002002009')"
                  title="禁用"
                  @click="handleEditRoleStatus({ id: scope.row.id, isDel: 1 })"
                  >禁用</el-button
                ></span
              >
              <span v-if="scope.row.isDel !== 0"
                ><el-button
                  type="danger"
                  size="mini"
                  v-if="checkButton('001002002009')"
                  title="启用"
                  @click="handleEditRoleStatus({ id: scope.row.id, isDel: 0 })"
                  >启用</el-button
                ></span
              >
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-bind:current-page="pageInfo.current"
          v-bind:page-size="pageInfo.size"
          :total="pageInfo.total"
          layout="total,sizes,prev,pager,next,jumper"
          v-bind:page-sizes="[10, 50, 100]"
          v-on:size-change="changePageSize"
          v-on:current-change="pageIndexChange"
        >
        </el-pagination>
      </el-col>
    </el-row>

    <editRoleDialog
      :dialog-title="dialogTitle"
      :show-dialog.sync="isShowDialog"
      :role-object="saveData"
      :res-data="resData"
      :role-res-list="roleResList"
      @refreshList="onRefresNodeList"
    ></editRoleDialog>
  </div>
</template>

<script>
  import * as api from "@/api";
  import editRoleDialog from "@/components/account/EditRoleDialog";

  export default {
  components: {
    editRoleDialog
  },
  props: {
    isView: ""
  },
  data() {
    return {
      msg: "权限管理",
      dialogTitle: "",
      isShowDialog: false,
      loading: false,
      orgName: "",
      saveData: {},
      resData: [],
      roleResList: [],
      pageInfo: {
        total: 1,
        current: 1,
        size: 10,
        sort: ""
      },
      sysId: 2,
      dataList: []
    };
  },
  created: function() {},
  mounted: function() {},
  computed: {
    orgId() {
      return this.$store.getters.currentUser.orgId;
    }
  },
  watch: {
    isView: function(n, o) {
      if (n === "role" && typeof this.orgId != "undefined") {
        this.handleSearchData();
      }
    },
    orgId: function(n, o) {
      if (typeof n != "undefined" && this.isView == "role") {
        this.handleSearchData();
      }
    }
  },
  methods: {
    handleSearchData() {
      this.pageInfo.total = 1;
      this.pageInfo.current = 1;
      this.pageInfo.size = 10;
      this.pageInfo.sort = "";
      this.fetchData();
    },
    fetchData() {
      let _this = this;
      _this.loading = true;
      let params = {
        pageInput: _this.pageInfo,
        sysId: _this.sysId
      };
      api
        .queryRoleListApi(params)
        .then(rs => {
          if (rs.result === 200) {
            _this.loading = false;
            _this.pageInfo.total = rs.pageInfo.total;
            _this.dataList = rs.page;
          } else {
            _this.loading = false;
            _this.$notify.error({
              title: "提示",
              message: rs.message
            });
          }
        })
        .catch(err => {
          _this.loading = false;
          console.log("api queryRoleListApi error", err);
        });
    },
    changePageSize: function(pageSize) {
      this.pageInfo.size = pageSize;
      this.fetchData();
    },
    pageIndexChange: function(pageIndex) {
      this.pageInfo.current = pageIndex;
      this.fetchData();
    },
    typeIndex: function(index) {
      return index + (this.pageInfo.current - 1) * this.pageInfo.size + 1;
    },
    onRefresNodeList: function() {
      this.saveData = {};
      this.resData = [];
      this.roleResList = [];
      this.fetchData();
    },
    handleEditRoleStatus: function(role) {
      let _this = this;
      if (confirm("确认修改吗?")) {
        api
          .updateRoleStatusApi(role)
          .then(rs => {
            if (rs.result === 200) {
              _this.fetchData();
            } else {
              _this.$notify.error({
                title: "提示",
                message: rs.message
              });
            }
          })
          .catch(err => {
            console.log("updateRoleStatusApi error", err);
          });
      }
    },
    handleEditRole: function(status, role) {
      let _this = this;
      if (status == "edit") {
        let params = {
          sysId: role.sysId,
          id: role.id
        };
        api
          .queryResByRoleApi(params)
          .then(rs => {
            if (rs.result === 200) {
              _this.saveData = role;
              _this.resData = rs.data;
              _this.roleResList = rs.resList;
              _this.isShowDialog = true;
              _this.dialogTitle = "修改权限";
              // console.log("selected", _this.roleResList);
            } else {
              this.$notify.error({
                title: "提示",
                message: rs.message
              });
            }
          })
          .catch(err => {
            console.log("queryResByRoleApi error", err);
          });
      } else {
        let params = {
          sysId: _this.sysId
        };
        api
          .queryResByRoleApi(params)
          .then(rs => {
            if (rs.result === 200) {
              _this.saveData = {};
              _this.saveData.name = "";
              _this.saveData.sysId = _this.sysId;
              _this.saveData.orgId = null;
              _this.roleResList = [];
              _this.resData = rs.data;
              _this.isShowDialog = true;
              _this.dialogTitle = "添加权限";
            } else {
              this.$notify.error({
                title: "提示",
                message: rs.message
              });
            }
          })
          .catch(err => {
            console.log("queryResByRoleApi error", err);
          });
      }
    }
  }
};
</script>

<style></style>
