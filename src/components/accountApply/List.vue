<!-- 企业申请 -->
<template>
  <div>
    <el-row style="padding-top:15px">
      <el-col :span="24">
        <label class="label">企业名称</label>
        <el-input
          v-model="searchName"
          style="width:240px"
          clearable
          placeholder="企业名称"
        ></el-input>
        <el-button type="primary" @click="handleSearchData">查询</el-button>
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
            label="序号"
            width="50"
            :index="typeIndex"
          />
          <el-table-column
            prop="name"
            label="企业名称"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope"
              ><span v-if="scope.row.isRead == 0">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="标记已读"
                  placement="right"
                >
                  <a
                    href="javascript:void(0)"
                    class="mark"
                    @click="handleMarkRead(scope.row.id)"
                    >{{ scope.row.name }}</a
                  ></el-tooltip
                ></span
              >
              <span v-if="scope.row.isRead == 1">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="enterpriseType" label="企业类型">
            <template slot-scope="scope">
              <span v-if="scope.row.enterpriseType == 0">生产企业</span>
              <span v-if="scope.row.enterpriseType == 1">经销企业</span>
            </template>
          </el-table-column>
          <el-table-column prop="contact" label="联系人" />
          <el-table-column prop="mobile" label="联系电话" />
          <el-table-column prop="remark" label="市场范围" width="250px">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p style="width:400px;">{{ scope.row.remark }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{
                    scope.row.remark.substring(0, 15) + "...."
                  }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="提交时间" width="150px">
            <template slot-scope="scope">
              {{ scope.row.createTime | dateFormat }}
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
  </div>
</template>

<script>
  import * as api from "@/api";

  export default {
  components: {},
  data() {
    return {
      loading: false,
      dataList: [],
      searchName: "",
      pageInfo: {
        total: 1,
        current: 1,
        size: 10,
        sort: ""
      }
    };
  },
  created: function() {
    this.handleSearchData();
  },
  mounted: function() {},
  computed: {},
  methods: {
    handleSearchData() {
      this.pageInfo.total = 1;
      this.pageInfo.current = 1;
      this.pageInfo.size = 10;
      this.pageInfo.sort = "";
      this.fetchData();
    },
    handleMarkRead(_id) {
      let _this = this;
      let params = {
        id: _id
      };
      api
        .updateAccountApplyApi(params)
        .then(rs => {
          if (rs.result === 200) {
            _this.$notify.success({
              title: "提示",
              message: rs.message
            });
            _this.$store.dispatch(
              "updateApplyNonReadNum",
              rs.data.applyNonReadNum
            );
          } else {
            _this.$notify.error({
              title: "提示",
              message: rs.message
            });
          }
          _this.fetchData();
        })
        .catch(err => {
          _this.fetchData();
          console.log("api updateAccountApplyApi error", err);
        });
    },
    fetchData() {
      let _this = this;
      _this.loading = true;
      let params = {
        pageInput: _this.pageInfo,
        name: _this.searchName
      };
      api
        .queryAccountApplyApi(params)
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
          console.log("api queryAccountApplyApi error", err);
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
    }
  }
};
</script>
<style>
a.mark {
  color: #1e9efa;
  font-weight: bold;
  text-decoration: none;
}

a.mark:hover {
  color: #1e1e1e;
  font-weight: bold;
}
</style>
