<template>
  <div>
    <el-dialog
      :center="true"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible="showDialog"
      @close="tallDataListChanged"
    >
      <el-row>
        <el-col :span="24">
          <el-table
            :data="this.tableData"
            height="400px"
            max-height="400px"
            size="small"
            style="width: 100%"
            row-class-name="row"
            cell-class-name="column"
            :highlight-current-row="true"
            fit
          >
            <el-table-column
              type="index"
              :index="typeIndex"
              label="序号"
              width="50"
            ></el-table-column>
            <el-table-column
              v-for="(item, index) in tableLabel"
              :key="index"
              :prop="item.prop"
              :width="item.width"
              :label="item.label"
            >
            </el-table-column>
            <el-table-column label="资质图片" width="150">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-search"
                  v-if="
                    checkButton('001011001006') || checkButton('001011002006')
                  "
                  @click="handleSearchQuaImage(scope.row.imgstr)"
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
      <WatchQuaImage
        :imageDialogTitle="imageDialogTitleName"
        :isShowDialog.sync="isShowDialog"
        :fileRelation="filesRelation"
      />
    </el-dialog>
  </div>
</template>
<script>
  import WatchQuaImage from "@/components/qua/watchquaimage";
  import * as api from "@/api/requestpath";

  export default {
  components: { WatchQuaImage },
  props: {
    dialogTitle: String,
    typeFlag: Number,
    showDialog: Boolean,
    orgInfo: Object
  },
  data() {
    return {
      imageDialogTitleName: "",
      isShowDialog: false,
      filesRelation: [],
      loading: false,
      pageInfo: {
        total: 1,
        current: 1,
        size: 10,
        sort: ""
      },
      tableData: [],
      tableLabel: [],
      editAccount: {}
    };
  },
  created: function() {},
  mounted: function() {},
  computed: {},
  watch: {
    showDialog: function(n, o) {
      if (n == true) {
        console.log("进来了");
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
      console.log("传递的信息1111" + JSON.stringify(this.orgInfo));
      let params = {
        pageInput: _this.pageInfo,
        orgInfoId: this.orgInfo.orgInfoId,
        typeFlag: this.typeFlag,
        quaCode: this.orgInfo.quaCode,
        quaType: 2
      };
      api
        .searchproductquadetaillist(params)
        .then(rs => {
          if (rs.result === 200) {
            _this.loading = false;
            _this.pageInfo.total = rs.pageInfo.total;
            _this.tableData = rs.page.tableData;
            _this.tableLabel = rs.page.tableLabel;
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
          console.log("api searchproductquadetaillist error", err);
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
    dialogClosed: function() {
      this.$emit("update:show-dialog", false);
    },
    tallDataListChanged: function() {
      this.dialogClosed();
      this.$emit("refreshList");
    },
    handleSearchQuaImage: function(imgstr) {
      console.log("图片地址2" + JSON.stringify(imgstr));
      let _this = this;
      let files = new Array();
      let strs = new Array(); //定义一数组
      strs = imgstr.split(","); //字符分割
      strs.pop();
      let file = {};
      strs.forEach(element => {
        file.fileUrl = element;
        files.push(file);
      });
      _this.filesRelation = files;
      _this.isShowDialog = true;
      _this.imageDialogTitleName = "资质图片查看";
    }
  }
};
</script>

<style></style>
