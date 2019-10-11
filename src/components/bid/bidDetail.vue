<!-- 医院新闻 -->
<template>
  <div>
    <el-row style="padding-top:15px">
      <el-col :span="2">
        <el-upload
          ref="elUpload"
          :action="apiServer + '/file/upload'"
          accept=".xls,.xlsx"
          :headers="headers"
          :show-file-list="false"
          :multiple="false"
          :auto-upload="true"
          :on-success="handleSuccess"
          :before-upload="beforeUpload"
          :limit="1"
        >
          <el-button
            type="primary"
            v-loading.fullscreen.lock="fullscreenLoading"
            >点击上传</el-button
          >
        </el-upload>
      </el-col>
      <el-col :span="22">
        <el-button type="primary" @click="handleDeleteData">全部删除</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-table :data="tableData" v-loading="loading">
          <el-table-column
            v-for="col in cols"
            :key="col.prop"
            :prop="col.prop"
            :label="col.label"
            :width="flexColumnWidth(col)"
            :show-overflow-tooltip="true"
          >
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
  import * as api from "@/api/requestpath";

  export default {
  data() {
    return {
      headers: { token: sessionStorage.getItem("token") },
      loading: false,
      fullscreenLoading: false,
      tableData: [],
      cols: [
        { prop: "bidNumber", label: "标书号" },
        { prop: "bidOrgName", label: "投标企业" },
        { prop: "bidUserName", label: "投标用户" },
        { prop: "ztItemId", label: "组套商品编号" },
        { prop: "ztItemName", label: "组套商品名称" },
        { prop: "projectCategoryId", label: "项目分类编码" },
        { prop: "projectCategoryName", label: "项目分类名称" },
        { prop: "projectCatalogueId", label: "项目目录编码" },
        { prop: "projectCatalogueName", label: "项目目录名称" },
        { prop: "ztItemSpec", label: "组套商品规格" },
        { prop: "ztItemModel", label: "组套商品型号" },
        { prop: "ztRegisterId", label: "组套注册证编号" },
        { prop: "ztRegisterSpec", label: "组套注册证规格" },
        { prop: "ztRegisterModel", label: "组套注册证型号" },
        { prop: "ztItemBrand", label: "组套商品商标" },
        { prop: "ztItemMinNumberUnit", label: "组套商品最小计量单位" },
        { prop: "ztItemPackSpec", label: "组套商品包装规格" },
        { prop: "ztItemPackMaterial", label: "组套商品包装材质" },
        { prop: "ztItemPerformace", label: "组套商品性能组成" },
        { prop: "ztItemScope", label: "组套商品适用范围" },
        { prop: "ztDataCheckState", label: "组套数据审核状态" },
        { prop: "ztCatalogueCheckState", label: "组套目录审核状态" },
        { prop: "composeNumber", label: "构成数量" },
        { prop: "itemBasePrice", label: "商品基准价" },
        { prop: "itemQuote", label: "商品报价" }
      ],
      currentData: {},
      variableCols: [],
      pageInfo: {
        total: 1,
        current: 1,
        size: 10,
        sort: ""
      }
    };
  },
  created: function() {
    this.currentData.projectId = this.$route.query.projectId;
    this.init();
  },
  mounted: function() {},
  computed: {},
  methods: {
    changePageSize: function(pageSize) {
      this.pageInfo.size = pageSize;
      this.fetchData();
    },
    pageIndexChange: function(pageIndex) {
      this.pageInfo.current = pageIndex;
      this.fetchData();
    },
    init() {
      let _this = this;
      return api
        .searchbidlist(_this.currentData.projectId)
        .then(rs => {
          if (rs.result === 200) {
            rs.data.forEach(x => {
              _this.cols.push({ prop: x.columnKey, label: x.columnName });
            });

            _this.fetchData();
          } else {
            _this.$notify.error({
              title: "提示",
              message: rs.message
            });
          }
        })
        .catch(err => {
          console.error("api updateAdApi error", err);
        });
    },
    fetchData() {
      let _this = this;
      let params = {
        pageInput: _this.pageInfo,
        projectId: _this.currentData.projectId
      };
      _this.loading = true;
      api
        .querybideetailpage(params)
        .then(rs => {
          _this.loading = false;
          if (rs.result === 200) {
            _this.$notify.success({
              title: "提示",
              message: rs.message
            });
            _this.pageInfo.total = rs.pageInfo.total;
            _this.tableData = rs.page;
          } else {
            _this.$notify.error({
              title: "提示",
              message: rs.message
            });
          }
        })
        .catch(err => {
          _this.loading = false;
          console.error("api updateAdApi error", err);
        });
    },
    handleDeleteData() {
      let _this = this;
      api
        .biddetaildelete(_this.currentData)
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
          _this.fetchData();
          console.error("api biddetaildelete error", err);
        });
    },
    handleSuccess(response, file, fileList) {
      let _this = this;

      _this.currentData.fileName = response.data.newFile;

      api
        .biddetailprocess(_this.currentData)
        .then(rs => {
          if (rs.result === 200) {
            _this.percentage += 10;
            _this.fetchData();
          } else {
            _this.$notify.error({
              title: "提示",
              message: rs.message
            });
          }
          _this.loading = false;
        })
        .catch(err => {
          _this.loading = false;
          console.error("api biddetailprocess error", err);
        });
    },
    beforeUpload(file) {
      this.loading = true;
      const isText = file.type === "application/vnd.ms-excel";
      const isTextComputer =
        file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      return isText | isTextComputer;
    },
    flexColumnWidth(col) {
      let flexWidth = 0;
      for (const char of col.label) {
        if ((char >= "A" && char <= "Z") || (char >= "a" && char <= "z")) {
          // 如果是英文字符，为字符分配8个单位宽度
          flexWidth += 8;
        } else if (char >= "\u4e00" && char <= "\u9fa5") {
          // 如果是中文字符，为字符分配20个单位宽度
          flexWidth += 24;
        } else {
          // 其他种类字符，为字符分配5个单位宽度
          flexWidth += 5;
        }
      }
      if (flexWidth < 50) {
        // 设置最小宽度
        flexWidth = 200;
      }
      if (flexWidth > 250) {
        // 设置最大宽度
        flexWidth = 250;
      }
      return flexWidth + "px";
    }
  }
};
</script>
