<!-- 管理端-用户列表 -->
<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-input
          v-model="searchParams.userName"
          style="width:200px"
          clearable
          placeholder="请输入账号"
        ></el-input>
      </el-col>
      <el-col :span="6">
        <el-select v-model="searchParams.enableState" placeholder="状态">
          <el-option
            v-for="item in searchState"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>
      <el-col :span="6">
        <el-button type="primary" @click="handleSearchData">查询</el-button>
        <el-button
          type="primary"
          v-if="checkButton('001002003006')"
          @click="handleAddAccount"
          >添加账号</el-button
        >
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table
          :data="dataList"
          style="width: 100%"
          stripe
          v-loading="loading"
        >
          <el-table-column
            type="index"
            :index="typeIndex"
            label="序号"
            width="50"
          ></el-table-column>
          <el-table-column prop="userName" label="账号"></el-table-column>
          <el-table-column prop="nickname" label="姓名"></el-table-column>
          <el-table-column prop="roleName" label="权限名称"></el-table-column>
          <el-table-column prop="mobile" label="手机"></el-table-column>
          <el-table-column label="服务专员">
            <template slot-scope="scope">
              <span v-if="scope.row.isService == 0">否</span>
              <span v-else>是</span>
            </template>
          </el-table-column>
          <el-table-column label="状态">
            <template slot-scope="scope">
              <span v-if="scope.row.enabledState == 0">正常</span>
              <span v-else>禁用</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                v-if="checkButton('001002003008')"
                @click="handleEditAccount(scope.row)"
                >修改</el-button
              >
              <span v-if="scope.row.enabledState === 0">
                <el-button
                  type="danger"
                  size="mini"
                  v-if="checkButton('001002003007')"
                  title="禁用"
                  @click="
                    handleEditAccountStatus({
                      id: scope.row.id,
                      sysId: scope.row.sysId,
                      enabledState: 1
                    })
                  "
                  >禁用</el-button
                >
              </span>
              <span v-if="scope.row.enabledState !== 0">
                <el-button
                  type="danger"
                  size="mini"
                  v-if="checkButton('001002003007')"
                  title="启用"
                  @click="
                    handleEditAccountStatus({
                      id: scope.row.id,
                      sysId: scope.row.sysId,
                      enabledState: 0
                    })
                  "
                  >启用</el-button
                >
              </span>
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
        ></el-pagination>
      </el-col>
    </el-row>

    <AddAccountDialog
      :dialog-title="dialogTitle"
      :show-dialog.sync="isShowDialog"
      :org-id="orgId"
      @refreshList="onRefresList"
    />
    <EditAccountDialog
      :dialog-title="dialogTitle"
      :show-dialog.sync="isShowEditDialog"
      :account-object="editAccount"
      @refreshList="onRefresList"
    />
  </div>
</template>

<script>
  import * as api from "@/api";
  import AddAccountDialog from "@/components/account/AddAccountDialog";
  import EditAccountDialog from "@/components/account/EditAccountDialog";

  export default {
  components: {
    AddAccountDialog,
    EditAccountDialog
  },
  props: {
    isView: ""
  },
  data() {
    return {
      msg: "账户管理",
      dialogTitle: "",
      isShowDialog: false,
      isShowEditDialog: false,
      loading: false,
      searchState: [
        {
          value: -1,
          label: "全部"
        },
        {
          value: 0,
          label: "正常"
        },
        {
          value: 1,
          label: "禁用"
        }
      ],
      searchParams: {
        enableState: -1,
        userName: "",
        orgName: ""
      },
      pageInfo: {
        total: 1,
        current: 1,
        size: 10,
        sort: ""
      },
      sysId: 1,
      dataList: [],
      editAccount: {}
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
      if (n === "account" && typeof this.orgId != "undefined") {
        this.handleSearchData();
      }
    },
    orgId: function(n, o) {
      if (typeof n != "undefined" && this.isView == "account") {
        this.handleSearchData();
      }
    }
  },
  methods: {
    handleEditAccountStatus(account) {
      let _this = this;
      if (confirm("确认修改吗?")) {
        api
          .updateAccountApi(account)
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
            console.log("updateAccountApi error", err);
          });
      }
    },
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
        sysId: _this.sysId,
        orgId: _this.orgId,
        userName: _this.searchParams.userName,
        enabledState:
          _this.searchParams.enableState == -1
            ? null
            : _this.searchParams.enableState
      };
      api
        .queryAccountListApi(params)
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
          console.log("api queryAccountListApi error", err);
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
    handleAddAccount: function() {
      let _this = this;
      _this.isShowDialog = true;
      _this.dialogTitle = "添加账号";
    },
    handleEditAccount: function(account) {
      let _this = this;
      _this.isShowEditDialog = true;
      _this.dialogTitle = "修改账号";
      _this.editAccount = Object.assign({}, account);
    },
    onRefresList: function() {
      this.fetchData();
    }
  }
};
</script>

<style></style>
