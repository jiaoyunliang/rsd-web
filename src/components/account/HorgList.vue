<!-- 医院机构 -->
<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-input
          v-model="searchParams.orgName"
          style="width:200px"
          clearable
          placeholder="请输入医院名称"
        ></el-input>
        <el-button type="primary" @click="handleSearchData">查询</el-button>
        <el-button
          type="primary"
          v-if="checkButton('001002002002')"
          @click="handleAddOrg"
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
          />
          <el-table-column prop="orgName" label="医院名称"></el-table-column>
          <el-table-column prop="roleName" label="权限名称"></el-table-column>
          <el-table-column prop="joinDate" label="加入时间">
            <template slot-scope="scope">
              {{ scope.row.joinDate | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="expireDate" label="到期时间">
            <template slot-scope="scope">
              {{ scope.row.expireDate | dateFormat }}
            </template>
          </el-table-column>
          <el-table-column prop="contact" label="联系人"></el-table-column>
          <el-table-column prop="mobile" label="电话"></el-table-column>
          <el-table-column prop="email" label="邮箱"></el-table-column>
          <el-table-column prop="area" label="地区"></el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                v-if="checkButton('001002002005')"
                @click="handelAccount(scope.row)"
                >账号</el-button
              >
              <el-button
                type="primary"
                size="mini"
                v-if="checkButton('001002002003')"
                @click="handleEditOrg(scope.row)"
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

    <addHospDialog
      :dialog-title="dialogTitle"
      :show-dialog.sync="isShowDialog"
      :orgObject="orgObject"
      @refreshList="onRefresList"
    />
    <hospAccountListDialog
      :dialog-title="dialogTitle"
      :show-account-dialog.sync="isShowAccountDialog"
      :orgObject="orgObject"
      @refreshList="onRefresList"
    />
  </div>
</template>

<script>
  import * as api from "@/api";
  import addHospDialog from "@/components/account/AddHospDialog";
  import hospAccountListDialog from "@/components/account/HospAccountListDialog";

  export default {
  components: {
    addHospDialog,
    hospAccountListDialog
  },
  props: {
    isView: ""
  },
  data() {
    return {
      dialogTitle: "",
      isShowDialog: false,
      isShowAccountDialog: false,
      loading: false,
      searchState: [
        {
          value: -1,
          label: "全部"
        },
        {
          value: 0,
          label: "正常"
        },
        {
          value: 1,
          label: "禁用"
        }
      ],
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
      dataList: [],
      orgObject: {},
      orgTypes: []
    };
  },
  created: function() {},
  mounted: function() {},
  computed: {},
  watch: {
    isView: function(n, o) {
      if (n === "org") {
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
        .queryOrgPageApi(params)
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
          console.log("api queryAccountListApi error", err);
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
    handelAccount(org) {
      let _this = this;
      _this.orgObject = org;
      _this.dialogTitle = org.orgName + " 账号信息";
      _this.isShowAccountDialog = true;
    },
    handleAddOrg() {
      let _this = this;
      _this.orgObject = {};
      _this.orgObject.orgLevel = "";
      _this.orgObject.orgTypeIds = [];
      _this.orgObject.isDel = 0;
      _this.orgObject.sysId = _this.sysId;
      _this.dialogTitle = "添加医院";
      _this.isShowDialog = true;
    },
    handleEditOrg(org) {
      let _this = this;
      api
        .queryOrgTypesApi(org)
        .then(rs => {
          if (rs.result === 200) {
            _this.orgObject = org;
            _this.orgObject.orgTypeIds = [];
            if (rs.data != null && rs.data.length > 0) {
              _this.orgObject.orgTypeIds = rs.data;
            }
            _this.dialogTitle = "修改医院";
            _this.isShowDialog = true;
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
          console.log("api queryOrgTypesApi error", err);
        });
    }
  }
};
</script>

<style></style>
