<!--企业黄页 -->
<template>
  <div>
    <div v-if="view == 'list'">
      <el-row style="padding-top:15px">
        <el-col :span="24">
          <label class="label">企业名称</label>
          <el-input
            v-model="searchOrgName"
            style="width:200px"
            clearable
            placeholder="请输入企业名称"
          />
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
              prop="orgName"
              label="企业名称"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="mini"
                  @click="handelViewDetail(scope.row)"
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
    </div>
    <div v-if="view == 'detail'">
      <viewOrgDetail :orgDetail="orgDetail" @back="fetchData" />
    </div>
  </div>
</template>

<script>
  import * as api from "@/api";
  import viewOrgDetail from "@/components/orgDetail/ViewOrgDetail";

  export default {
  components: {
    viewOrgDetail
  },
  data() {
    return {
      loading: false,
      dataList: [],
      orgDetail: {},
      searchOrgName: "",
      view: "list",
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
    fetchData() {
      // console.log("fetchData");
      let _this = this;
      let params = {
        pageInput: _this.pageInfo,
        orgName: _this.searchOrgName
      };
      api
        .queryOrgDetailPageApi(params)
        .then(rs => {
          if (rs.result === 200) {
            _this.loading = false;
            _this.pageInfo.total = rs.pageInfo.total;
            _this.dataList = rs.page;
            _this.view = "list";
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
          console.log("api queryOrgDetailPageApi error", err);
        });
    },
    handelViewDetail(org) {
      let _this = this;
      _this.orgDetail = org;
      _this.view = "detail";
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
