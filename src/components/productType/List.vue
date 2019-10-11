<!-- 分类设置 -->
<template>
  <div>
    <el-row style="padding-top:15px">
      <el-col :span="24">
        <el-button
          type="primary"
          v-if="checkButton('001004001')"
          @click="handleAddType"
          >添加分类</el-button
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
          <el-table-column prop="name" label="分类名称" />
          <el-table-column prop="groupName" label="分组" />
          <el-table-column prop="seq" label="显示顺序" />
          <el-table-column prop="clickNum" label="点击量" />
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                v-if="checkButton('001004002')"
                @click="handleEditType(scope.row)"
                >修改</el-button
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

    <ProductTypeDialog
      :dialog-title="dialogTitle"
      :show-dialog.sync="isShowDialog"
      :typeObject="editObject"
      @refreshList="fetchData"
    />
  </div>
</template>

<script>
  import * as api from "@/api";
  import ProductTypeDialog from "@/components/productType/ProductTypeDialog";

  export default {
  components: {
    ProductTypeDialog
  },
  data() {
    return {
      msg: "分类设置",
      dialogTitle: "",
      isShowDialog: false,
      loading: false,
      dataList: [],
      editObject: {},
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
    fetchData() {
      let _this = this;
      _this.loading = true;
      let params = {
        pageInput: _this.pageInfo
      };
      api
        .queryProductTypeApi(params)
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
          console.log("api queryProductTypeApi error", err);
        });
    },
    handleEditType(productType) {
      let _this = this;
      _this.editObject = Object.assign({}, productType);
      _this.isShowDialog = true;
      _this.dialogTitle = "修改分类";
    },
    handleAddType() {
      let _this = this;
      _this.editObject = { seq: 1 };
      _this.isShowDialog = true;
      _this.dialogTitle = "添加分类";
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
