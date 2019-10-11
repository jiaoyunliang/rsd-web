<!-- 医院 反馈 -->
<template>
  <div>
    <el-row>
      <el-col :span="24">
        <label class="label">医院名称</label>
        <el-input
          v-model="searchParams.orgName"
          style="width:200px"
          clearable
          placeholder="请输入医院名称"
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
            :index="typeIndex"
            label="序号"
            width="50"
          />

          <el-table-column
            prop="orgName"
            label="医院名称"
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
                    >{{ scope.row.orgName }}</a
                  >
                </el-tooltip></span
              >
              <span v-if="scope.row.isRead == 1">{{ scope.row.orgName }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="content" label="反馈内容">
            <template slot-scope="scope">
              <el-popover trigger="hover" placement="top">
                <p style="width:400px;">{{ scope.row.content }}</p>
                <div slot="reference" class="name-wrapper">
                  <el-tag size="medium">{{
                    scope.row.content.substring(0, 20) + "...."
                  }}</el-tag>
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="反馈时间">
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
  props: {
    isView: ""
  },
  data() {
    return {
      loading: false,
      searchParams: {
        orgName: ""
      },
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
  computed: {},
  watch: {
    isView: function(n, o) {
      if (n === "hospital") {
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
        orgName: _this.searchParams.orgName
      };
      api
        .queryFeedbackPageApi(params)
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
          console.log("api queryFeedbackPageApi error", err);
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
    handleMarkRead(_id) {
      let _this = this;
      _this.loading = true;
      let params = {
        id: _id,
        isRead: 1
      };
      api
        .updateFeedbackApi(params)
        .then(rs => {
          if (rs.result === 200) {
            _this.loading = false;
            _this.$notify.success({
              title: "提示",
              message: rs.message
            });
            _this.fetchData();
          } else {
            _this.loading = false;
            _this.$notify.error({
              title: "提示",
              message: rs.message
            });
            _this.fetchData();
          }
        })
        .catch(err => {
          _this.loading = false;
          _this.fetchData();
          console.log("api updateFeedbackApi error", err);
        });
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
