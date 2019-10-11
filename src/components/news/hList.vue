<!-- 医院新闻 -->
<template>
  <div>
    <el-row style="padding-top:15px">
      <el-col :span="24">
        <label class="label">新闻标题</label>
        <el-input
          v-model="searchParams.title"
          style="width:200px"
          clearable
          placeholder="请输入新闻标题"
        />
        <label class="label">分类</label>
        <el-select v-model="searchParams.newsType" placeholder="分类">
          <el-option
            v-for="item in newsTypes"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
        <el-button type="primary" @click="handleSearchData">查询</el-button>
        <el-button
          type="primary"
          v-if="checkButton('001001002001')"
          @click="handelAddNews"
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
            label="序号"
            width="50"
            :index="typeIndex"
          />
          <el-table-column
            prop="title"
            label="标题"
            :show-overflow-tooltip="true"
          />
          <el-table-column prop="newsType" label="分类">
            <template slot-scope="scope">
              {{ newsTypeText(scope.row.newsType) }}
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="发布时间">
            <template slot-scope="scope">
              {{ scope.row.createTime | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="updateUser" label="操作人" />
          <el-table-column label="操作" width="340">
            <template slot-scope="scope">
              <el-button
                @click="handelEditNewsStatus(scope.row.id, 'top', 1)"
                type="primary"
                size="mini"
                v-if="scope.row.isTop === 0 && checkButton('001001002002')"
                >置顶</el-button
              >
              <el-button
                @click="handelEditNewsStatus(scope.row.id, 'top', 0)"
                type="primary"
                size="mini"
                v-if="scope.row.isTop !== 0 && checkButton('001001002002')"
                >取消置顶</el-button
              >
              <el-button
                @click="handelEditNewsStatus(scope.row.id, 'red', 1)"
                type="primary"
                size="mini"
                v-if="scope.row.isRed === 0 && checkButton('001001002002')"
                >飘红</el-button
              >
              <el-button
                @click="handelEditNewsStatus(scope.row.id, 'red', 0)"
                type="primary"
                size="mini"
                v-if="scope.row.isRed !== 0 && checkButton('001001002002')"
                >取消飘红</el-button
              >
              <el-button
                type="primary"
                size="mini"
                v-if="checkButton('001001002002')"
                @click="handelEditNews(scope.row)"
                >编辑</el-button
              >
              <el-button
                @click="handelEditNewsStatus(scope.row.id, 'del', 1)"
                type="danger"
                size="mini"
                v-if="scope.row.isDel === 0 && checkButton('001001002003')"
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

    <newsDialog
      :dialog-title="dialogTitle"
      :show-dialog.sync="isShowDialog"
      :news-object="newsObject"
      @refreshList="onRefresList"
    />
  </div>
</template>

<script>
  import * as api from "@/api";
  import newsDialog from "@/components/news/NewsDialog";

  export default {
  components: { newsDialog },
  data() {
    return {
      dialogTitle: "",
      isShowDialog: false,
      loading: false,
      dataList: [],
      newsObject: {},
      searchParams: {
        title: "",
        newsType: -1,
        sysId: 2
      },
      newsTypes: [
        { name: "全部", id: -1 },
        { name: "政府文件", id: 4 },
        { name: "工作动态", id: 5 },
        { name: "资料下载", id: 6 },
        { name: "企业评价", id: 7 }
      ],
      pageInfo: {
        total: 1,
        current: 1,
        size: 10,
        sort: ""
      }
    };
  },
  created: function() {
    this.fetchData();
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
      _this.loading = true;
      let params = {
        pageInput: _this.pageInfo,
        sysId: _this.searchParams.sysId,
        title: _this.searchParams.title,
        newsType:
          _this.searchParams.newsType == -1 ? null : _this.searchParams.newsType
      };
      api
        .queryNewsPageApi(params)
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
          console.log("api queryNewsPageApi error", err);
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
    newsTypeText(data) {
      switch (data) {
        case 1:
          return "资料下载";
        case 2:
          return "行业动态";
        case 3:
          return "项目公告";
        case 4:
          return "政府文件";
        case 5:
          return "工作动态";
        case 6:
          return "资料下载";
        case 7:
          return "企业评价";
        default:
          return "";
      }
    },
    handelAddNews() {
      let _this = this;
      _this.dialogTitle = "添加新闻";
      _this.newsObject = {};
      _this.newsObject.id = null;
      _this.newsObject.sysId = _this.searchParams.sysId;
      _this.newsObject.title = "";
      _this.newsObject.content = "";
      _this.isShowDialog = true;
    },
    handelEditNews(news) {
      let _this = this;
      _this.dialogTitle = "修改新闻";
      _this.newsObject = Object.assign({}, news);
      _this.isShowDialog = true;
    },
    handelEditNewsStatus(newsId, status, val) {
      let _this = this;
      _this.newsObject = {};
      _this.newsObject.id = newsId;
      if (status == "top") {
        _this.newsObject.isTop = val;
      }
      if (status == "red") {
        _this.newsObject.isRed = val;
      }
      if (status == "del") {
        _this.newsObject.isDel = val;
      }
      if (confirm("确认修改?")) {
        api
          .saveNewsApi(_this.newsObject)
          .then(rs => {
            if (rs.result === 200) {
              _this.$notify.success({
                title: "提示",
                message: rs.message
              });
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
            console.log("api saveNewsApi error", err);
          });
      }
    }
  }
};
</script>
