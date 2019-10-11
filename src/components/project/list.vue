<template>
  <div>
    <el-row>
      <el-col :span="24">{{ msg }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        项目名称:
        <el-input
          v-model="searchParams.projectName"
          style="width:360px"
          placeholder="请输入项目名称"
          @keyup.enter.native="handleSearchData"
        ></el-input>
        <el-button type="primary" @click="handleSearchData">查询</el-button>
        <el-button
          type="primary"
          v-if="checkButton('001006001001')"
          @click="handleAddProject"
          >添加</el-button
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
          <el-table-column
            prop="bnzOrgInfo.orgName"
            label="医院"
          ></el-table-column>
          <el-table-column
            prop="projectName"
            label="项目名称 "
          ></el-table-column>
          <el-table-column label="项目时间">
            <template slot-scope="scope">
              {{ scope.row.projectTime | dateFormatMonth }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="350">
            <template slot-scope="scope">
              <el-button
                type="primary"
                v-if="checkButton('001006001003')"
                @click="handleEditProject(scope.row)"
              >编辑</el-button>
              <el-button
                type="primary"
                v-if="checkButton('001006001002')"
                @click="handleDeleteProject(scope.row)"
                >删除</el-button
              >
              <el-button type="primary" @click="handleShowProject(scope.row)"
                >查看</el-button
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
    <AddProjectDialog
      :dialogTitle="dialogTitle"
      :showDialog.sync="isShowDialog"
      :oldCurrentData="oldCurrentData"
      @refreshList="onRefresList"
    />
  </div>
</template>

<script>
  import * as api from "@/api/requestpath";
  import AddProjectDialog from "@/components/project/addproject";

  export default {
  components: { AddProjectDialog },
  props: {
    isView: ""
  },
  data() {
    return {
      msg: "",
      dialogTitle: "",
      isShowDialog: false,
      oldCurrentData: {},
      isShowEditDialog: false,
      loading: false,
      searchParams: {
        projectName: "",
        projectType: "1"
      },
      pageInfo: {
        total: 1,
        current: 1,
        size: 10,
        sort: ""
      },
      dataList: [],
      editAccount: {}
    };
  },
  created: function() {
    this.fetchData();
  },
  mounted: function() {},
  methods: {
    handleSearchData() {
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
        projectType: 1,
        projectName: _this.searchParams.projectName
      };
      api
        .projectlist(params)
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
          console.log("api projectlist error", err);
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
    handleAddProject: function() {
      let _this = this;
      _this.isShowDialog = true;
      _this.oldCurrentData = {};
      _this.dialogTitle = "添加项目";
    },
    handleEditProject: function(projectInfo) {
      let _this = this;
      _this.isShowDialog = true;
      _this.oldCurrentData = projectInfo;
      _this.dialogTitle = "编辑项目";
    },
    onRefresList: function() {
      this.fetchData();
    },
    handleDeleteProject: function(projectInfo) {
      let _this = this;
      let param = { id: projectInfo.id };
      api.projectdelete(param).then(rs => {
        if (rs.result === 200) {
          _this.fetchData();
        } else {
          _this.$notify.error({
            title: "提示",
            message: rs.message
          });
        }
      });
    },
    handleShowProject: function(projectInfo) {
      if (projectInfo) {
        this.$router.push({
          path: "/manager/project/bid",
          query: { projectId: projectInfo.id, c: "001006001" }
        });
        this.$parent.$parent.$parent.showChildBreadcrumb(
          projectInfo.projectName
        );
      }
    }
  }
};
</script>
