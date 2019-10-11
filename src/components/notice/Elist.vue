<!-- 企业通知 -->
<template>
  <div>
    <el-row>
      <el-col :span="24">
        <label class="label">标题</label>
        <el-input
          v-model="searchParams.title"
          style="width:200px"
          clearable
          placeholder="请输入标题"
        ></el-input>
        <el-button type="primary" @click="handleSearchData">查询</el-button>
        <el-button type="primary" @click="handelAdd">添加</el-button>
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
          />
          <el-table-column
            prop="title"
            label="标题"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            prop="orgName"
            label="收件机构"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              {{ scope.row.orgName != null ? scope.row.orgName : "全部" }}
            </template>
          </el-table-column>
          <el-table-column prop="createUser" label="操作人" />
          <el-table-column prop="createTime" label="发布时间">
            <template slot-scope="scope">
              {{ scope.row.createTime | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="240">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="handelView(scope.row)"
                >查看</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="handelEdit(scope.row)"
                >修改</el-button
              >
              <el-button
                type="danger"
                size="mini"
                @click="handelDel(scope.row.id)"
                >删除</el-button
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
        ></el-pagination>
      </el-col>
    </el-row>
    <editNoticeDialog
      :dialog-title="dialogTitle"
      :show-dialog.sync="isShowDialog"
      :notice-obj="currentData"
      @refreshList="onRefresList"
    />

    <viewNoticeDialog
      :dialog-title="dialogTitle"
      :show-dialog.sync="isViewDialog"
      :notice-obj="currentData"
      @refreshList="onRefresList"
    />
  </div>
</template>

<script>
  import * as api from "@/api";
  import editNoticeDialog from "@/components/notice/EditNoticeDialog";
  import viewNoticeDialog from "@/components/notice/ViewNoticeDialog";

  export default {
  components: {
    editNoticeDialog,
    viewNoticeDialog
  },
  props: {
    isView: ""
  },
  data() {
    return {
      dialogTitle: "",
      isShowDialog: false,
      isViewDialog: false,
      loading: false,
      searchParams: {
        title: ""
      },
      pageInfo: {
        total: 1,
        current: 1,
        size: 10,
        sort: ""
      },
      sysId: 3,
      dataList: [],
      currentData: {}
    };
  },
  created: function() {},
  mounted: function() {},
  computed: {},
  watch: {
    isView: function(n, o) {
      if (n === "enterprise") {
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
        sysId: _this.sysId,
        type: 1,
        title: _this.searchParams.title
      };
      api
        .querySysNoticePageApi(params)
        .then(rs => {
          if (rs.result === 200) {
            _this.loading = false;
            _this.pageInfo.total = rs.pageInfo.total;
            _this.dataList = rs.page;
          } else {
            _this.loading = false;
            _this.$notify.error({
              title: "提示",
              message: rs.exceptionMsg
            });
          }
        })
        .catch(err => {
          _this.loading = false;
          console.log("api querySysNoticePageApi error", err);
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
    handelAdd() {
      let _this = this;
      _this.currentData = {};
      _this.currentData.sysId = _this.sysId;
      _this.currentData.type = 1;
      _this.dialogTitle = "发布通知";
      _this.isShowDialog = true;
    },
    handelEdit(notice) {
      let _this = this;
      _this.currentData = Object.assign({}, notice);
      _this.dialogTitle = "修改通知";
      _this.isShowDialog = true;
    },
    handelView(notice) {
      let _this = this;
      _this.currentData = Object.assign({}, notice);
      _this.dialogTitle = "查看通知";
      _this.isViewDialog = true;
    },
    handelDel(noticeId) {
      let _this = this;
      if (confirm("确认删除?")) {
        api
          .saveNoticeApi({ id: noticeId, isDel: 1 })
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
            _this.handleSearchData();
          })
          .catch(err => {
            _this.handleSearchData();
            console.log("api saveNoticeApi error", err);
          });
      }
    }
  }
};
</script>

<style></style>
