<!-- 产品管理 -->
<template>
  <div>
    <div v-if="view == 'list'">
      <el-row style="padding-top:15px">
        <el-col :span="24">
          <label class="label">商品名称</label>
          <el-input
            v-model="searchParams.productName"
            style="width:200px"
            clearable
            placeholder="请输入商品名称"
          />

          <label class="label">企业名称</label>
          <el-input
            v-model="searchParams.orgName"
            style="width:200px"
            clearable
            placeholder="请输入企业名称"
          />

          <label class="label">产品分类名称</label>
          <el-input
            v-model="searchParams.productTypeName"
            style="width:200px"
            clearable
            placeholder="请输入产品分类名称"
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
              prop="productName"
              label="商品名称"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="productTypeName"
              label="产品分类名称"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="genericName"
              label="通用名"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="brandName"
              label="品牌"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="manufacturer"
              label="厂家"
              :show-overflow-tooltip="true"
            />
            <el-table-column
              prop="orgName"
              label="企业名称"
              :show-overflow-tooltip="true"
            />
            <el-table-column label="医院首页显示" width="150">
              <template slot-scope="scope">
                <span v-if="scope.row.isHospitalView == 0">
                  <a
                    href="javascript:void(0)"
                    class="mark"
                    @click="handelEdit({ id: scope.row.id, isHospitalView: 1 })"
                  >
                    未显示</a
                  >
                </span>
                <span v-if="scope.row.isHospitalView == 1">
                  <a
                    href="javascript:void(0)"
                    class="mark"
                    @click="handelEdit({ id: scope.row.id, isHospitalView: 0 })"
                  >
                    已显示</a
                  >
                </span>
              </template>
            </el-table-column>
            <el-table-column label="企业首页显示" width="120">
              <template slot-scope="scope">
                <span v-if="scope.row.isOrgView == 0">
                  <a
                    href="javascript:void(0)"
                    class="mark"
                    @click="handelEdit({ id: scope.row.id, isOrgView: 1 })"
                  >
                    未显示</a
                  >
                </span>
                <span v-if="scope.row.isOrgView == 1">
                  <a
                    href="javascript:void(0)"
                    class="mark"
                    @click="handelEdit({ id: scope.row.id, isOrgView: 0 })"
                  >
                    已显示</a
                  >
                </span>
              </template>
            </el-table-column>
            <el-table-column label="推广产品" width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.isHot == 0">
                  <a
                    href="javascript:void(0)"
                    class="mark"
                    @click="handelEdit({ id: scope.row.id, isHot: 1 })"
                  >
                    否</a
                  >
                </span>
                <span v-if="scope.row.isHot == 1">
                  <a
                    href="javascript:void(0)"
                    class="mark"
                    @click="handelEdit({ id: scope.row.id, isHot: 0 })"
                  >
                    是</a
                  >
                </span>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
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
      <viewProductDetail :productDetail="productDetail" @back="fetchData" />
    </div>
  </div>
</template>

<script>
  import * as api from "@/api";
  import viewProductDetail from "@/components/product/ViewProductDetail";

  export default {
  components: {
    viewProductDetail
  },
  data() {
    return {
      loading: false,
      dataList: [],
      productDetail: {},
      searchOrgName: "",
      searchParams: {
        orgName: "",
        productTypeName: "",
        productName: ""
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
        productTypeName: _this.searchParams.productTypeName,
        productName: _this.searchParams.productName
      };
      api
        .queryProductPageApi(params)
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
          console.log("api queryProductPageApi error", err);
        });
    },
    handelEdit(product) {
      let _this = this;
      if (confirm("确认修改?")) {
        api
          .updateProductApi(product)
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
            console.log("api updateProductApi error", err);
          });
      }
    },
    handelViewDetail(product) {
      let _this = this;
      _this.productDetail = product;
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
<style>
a.mark {
  color: #1e9efa;
  text-decoration: none;
}

a.mark:hover {
  color: #1e1e1e;
  text-decoration: none;
}
</style>
