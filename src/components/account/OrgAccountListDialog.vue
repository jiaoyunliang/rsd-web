<!-- 企业-账号-列表 -->
<template>
  <div>
    <el-dialog
      :top="dialogTop"
      :title="dialogTitle"
      width="60%"
      :close-on-click-modal="false"
      :visible="showAccountDialog"
      @close="tallDataListChanged"
    >
      <el-row>
        <el-col :span="24"
          ><el-button
            type="primary"
            @click="handleAddAccount"
            v-if="checkButton('001002001006')"
            >添加</el-button
          ></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-table
            :data="dataList"
            style="width: 100%"
            height="300"
            stripe
            v-loading="loading"
          >
            <el-table-column
              type="index"
              :index="typeIndex"
              label="序号"
              width="50"
            />
            <el-table-column prop="userName" label="账号"></el-table-column>
            <el-table-column label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.enabledState == 0">正常</span>
                <span v-else>禁用</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200px">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  v-if="checkButton('001002001007')"
                  @click="handleEditAccount(scope.row)"
                  >修改</el-button
                >
                <span v-if="scope.row.enabledState == 0">
                  <el-button
                    size="mini"
                    type="danger"
                    v-if="checkButton('001002001007')"
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
                <span v-if="scope.row.enabledState != 0">
                  <el-button
                    size="mini"
                    type="danger"
                    v-if="checkButton('001002001007')"
                    @click="
                      handleEditAccountStatus({
                        id: scope.row.id,
                        sysId: scope.row.sysId,
                        enabledState: 0
                      })
                    "
                    >开启</el-button
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
            v-bind:page-sizes="[5, 10]"
            v-on:size-change="changePageSize"
            v-on:current-change="pageIndexChange"
          />
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="tallDataListChanged">关闭</el-button>
      </div>
    </el-dialog>

    <addOrgAccountDialog
      :dialog-title="title"
      :show-dialog.sync="isShowDialog"
      :accountObj="currentData"
      @refreshList="onRefresList"
    />
  </div>
</template>

<script>
  import * as api from "@/api";
  import addOrgAccountDialog from "@/components/account/AddOrgAccountDialog";

  export default {
  components: {
    addOrgAccountDialog
  },
  props: {
    dialogTitle: "",
    showAccountDialog: false,
    orgObject: Object
  },
  data() {
    return {
      dialogTop: "5vh",
      loading: false,
      title: "",
      isShowDialog: false,
      currentData: {},
      dataList: [],
      pageInfo: {
        total: 1,
        current: 1,
        size: 5,
        sort: ""
      }
    };
  },
  created: function() {},
  mounted: function() {},
  computed: {},
  watch: {
    showAccountDialog: function(n, o) {
      // console.log("showAccountDialog", n);
      if (n == true) {
        this.currentData = {};
        this.fetchData();
      }
    }
  },
  methods: {
    handleAddAccount() {
      let _this = this;
      _this.currentData = {
        sysId: _this.orgObject.sysId,
        orgId: _this.orgObject.id,
        roleId: _this.orgObject.orgLevel
      };
      _this.title = "添加账号";
      _this.isShowDialog = true;
    },
    handleEditAccount(account) {
      let _this = this;
      _this.currentData = account;
      _this.title = "修改账号";
      _this.isShowDialog = true;
    },
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
    fetchData() {
      let _this = this;
      _this.loading = true;
      let params = {
        pageInput: _this.pageInfo,
        sysId: _this.orgObject.sysId,
        orgId: _this.orgObject.id
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
    onRefresList: function() {
      this.fetchData();
    },
    dialogClosed: function() {
      this.$emit("update:show-account-dialog", false);
    },
    tallDataListChanged: function() {
      this.dialogClosed();
      this.$emit("refreshList");
    }
  }
};
</script>

<style></style>
