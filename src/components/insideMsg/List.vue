<!-- 站内消息 -->
<template>
  <div>
    <div v-if="view == 'list'">
      <el-row style="padding-top:15px">
        <el-col :span="24">
          <label class="label">标题</label>
          <el-input
            v-model="searchParams.title"
            style="width:200px"
            clearable
            placeholder="请输入标题"
          />
          <label class="label">医院名称</label>
          <el-input
            v-model="searchParams.orgName"
            style="width:200px"
            clearable
            placeholder="请输入医院名称"
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
              prop="title"
              label="标题"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="orgName"
              label="发送医院"
              :show-overflow-tooltip="true"
            />
            <el-table-column prop="createTime" label="发送时间">
              <template slot-scope="scope">
                {{ scope.row.createTime | dateFormat }}
              </template>
            </el-table-column>
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
      <viewMsgDetail :msgDetail="msgDetail" @back="fetchData" />
    </div>
  </div>
</template>

<script>
  import * as api from "@/api";
  import viewMsgDetail from "@/components/insideMsg/ViewMsgDetail";

  export default {
  components: {
    viewMsgDetail
  },
  data() {
    return {
      loading: false,
      dataList: [],
      msgDetail: {},
      searchParams: {
        title: "",
        orgName: ""
      },
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
      let _this = this;
      let params = {
        pageInput: _this.pageInfo,
        orgName: _this.searchParams.orgName,
        title: _this.searchParams.title
      };
      api
        .queryMsgPageApi(params)
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
          console.log("api queryMsgPageApi error", err);
        });
    },
    handelViewDetail(msg) {
      let _this = this;
      _this.msgDetail = msg;
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
