<template>
  <div>
    <el-row>
      <el-col :span="24">{{ msg }}</el-col>
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
          <el-table-column prop="quaName" label="资质类型"></el-table-column>
          <el-table-column prop="sum" label="资质数量"></el-table-column>
          <el-table-column label="最后更新时间">
            <template slot-scope="scope">
              {{ scope.row.updateTime | dateFormatFull }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <!--<el-button
                type="primary"
                icon="el-icon-edit"
                v-if="checkButton('001006001003')"
                @click="handleEditAccount(scope.row)"
              ></el-button>-->
              <el-button
                type="primary"
                icon="el-icon-search"
                v-if="
                  checkButton('001011002004') || checkButton('001011001004')
                "
                @click="handleSearchQuaDetail(scope.row)"
              ></el-button>
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
    <InstitutionQuaDetailList
      :dialogTitle="dialogTitle"
      :showDialog.sync="isShowDialog"
      :typeFlag="typeFlag"
      :orgInfo="quaInfo"
      @refreshList="onRefresList"
    />
  </div>
</template>

<script>
  import InstitutionQuaDetailList from "@/components/qua/institutionquadetaillist";
  import * as api from "@/api/requestpath";

  export default {
  components: { InstitutionQuaDetailList },
  props: {
    orgInfoDetail: Object,
    typeFlag: Number,
    isView: Function
  },
  data() {
    return {
      msg: "",
      dialogTitle: "",
      isShowDialog: false,
      isShowEditDialog: false,
      quaInfo: {},
      loading: false,
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
  created: function() {},
  mounted: function() {},
  watch: {
    isView: function(n, o) {
      if (n === "institutionQua") {
        this.quaInfo = this.orgInfoDetail;
        this.handleSearchData();
      }
    }
  },
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
        typeFlag: this.typeFlag,
        orgInfoId: _this.orgInfoDetail.orgInfoId,
        quaType: _this.orgInfoDetail.quaType
      };
      api
        .searchinstitutionqualist(params)
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
          console.log("api searchinstitutionqualist error", err);
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
    handleSearchQuaDetail: function(quaInfoDetail) {
      let _this = this;
      _this.quaInfo = quaInfoDetail;
      _this.isShowDialog = true;
      _this.dialogTitle = "查看详细资质";
    }
  }
};
</script>

<style></style>
