<!-- 管理端-用户添加 -->
<template>
  <div>
    <el-dialog
      :top="dialogTop"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible="showDialog"
      @close="tallDataListChanged"
    >
      <el-form
        :model="currentData"
        :rules="rules"
        ref="formObject"
        label-position="left"
        label-width="80px"
      >
        <el-form-item label="医院名称" prop="orgId">
          <el-select v-model="currentData.orgId" style="width:240px">
            <el-option
              v-for="item in orgInfoOptions"
              :key="item.id"
              :label="item.orgName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input
            v-model="currentData.projectName"
            style="width:240px"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目时间" prop="projectTime">
          <el-date-picker
            v-model="currentData.projectTime"
            type="month"
            placeholder="请选择项目时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="公开内容">
          <el-table
            ref="multipleTable"
            size="mini"
            height="250"
            :data="tableData"
            style="width:80%"
            row-key="columnKey"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" prop="show"> </el-table-column>
            <el-table-column label="名称" prop="columnName"> </el-table-column>
            <el-table-column label="排序">
              <template slot-scope="scope">
                <el-input-number
                  size="mini"
                  :controls="false"
                  step-strictly
                  :min="1"
                  controls-position="right"
                  v-model="scope.row.columnOrder"
                ></el-input-number>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSaveProject">保存</el-button>
        <el-button @click="tallDataListChanged">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as api from "@/api/requestpath";

  export default {
  components: {},
  props: {
    dialogTitle: "",
    oldCurrentData: {},
    showDialog: false
  },
  data() {
    return {
      dialogTop: "5vh",
      loading: false,
      currentData: {
        orgId: "",
        projectName: "",
        projectTime: "",
        projectType: "1",
        isDel: "0"
      },
      oldCurrentData1: this.oldCurrentData,
      tableData: [
        {
          columnKey: "maintainOrgName",
          show: "false",
          columnName: "维护企业",
          columnOrder: "1"
        },
        {
          columnKey: "produceOrgName",
          show: false,
          columnName: "生产企业",
          columnOrder: "2"
        },
        {
          columnKey: "itemId",
          show: false,
          columnName: "商品编号",
          columnOrder: "3"
        },
        {
          columnKey: "itemName",
          show: false,
          columnName: "商品名称",
          columnOrder: "4"
        },
        {
          columnKey: "itemSpec",
          show: false,
          columnName: "商品规格",
          columnOrder: "5"
        },
        {
          columnKey: "itemModel",
          show: false,
          columnName: "商品型号",
          columnOrder: "6"
        },
        {
          columnKey: "itemRegisterId",
          show: false,
          columnName: "商品注册证编号",
          columnOrder: "7"
        },
        {
          columnKey: "itemRegisterSpec",
          show: false,
          columnName: "商品注册证规格",
          columnOrder: "8"
        },
        {
          columnKey: "itemRegisterModel",
          show: false,
          columnName: "商品注册证型号",
          columnOrder: "9"
        },
        {
          columnKey: "itemRegisterValidDate",
          show: false,
          columnName: "商品注册证有效期至",
          columnOrder: "10"
        },
        {
          columnKey: "itemBrand",
          show: false,
          columnName: "商品商标",
          columnOrder: "11"
        },
        {
          columnKey: "itemMinNumberUnit",
          show: false,
          columnName: "商品最小计量单位",
          columnOrder: "12"
        },
        {
          columnKey: "itemMinPackUnit",
          show: false,
          columnName: "商品最小包装单位",
          columnOrder: "13"
        },
        {
          columnKey: "itemConversionRatio",
          show: false,
          columnName: "商品转算比",
          columnOrder: "14"
        },
        {
          columnKey: "itemPackSpec",
          show: false,
          columnName: "商品包装规格",
          columnOrder: "15"
        },
        {
          columnKey: "itemPackMaterial",
          show: false,
          columnName: "商品包装材质",
          columnOrder: "16"
        },
        {
          columnKey: "itemPerformance",
          show: false,
          columnName: "商品性能组成",
          columnOrder: "17"
        },
        {
          columnKey: "itemScope",
          show: false,
          columnName: "商品适用范围",
          columnOrder: "18"
        },
        {
          columnKey: "itemCheckState",
          show: false,
          columnName: "商品审核状态",
          columnOrder: "19"
        },
        {
          columnKey: "itemCheckPerson",
          show: false,
          columnName: "商品审核人",
          columnOrder: "20"
        }
      ],
      bidShowColumnList: [],
      orgInfoOptions: [],
      rules: {
        orgId: [{ required: true, message: "请选择医院", trigger: "change" }],
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
          { max: 20, message: "长度 20 个字符以内", trigger: "blur" }
        ]
      }
    };
  },
  created: function() {},
  mounted: function() {},
  computed: {},
  watch: {
    showDialog: function(n, o) {
      if (n == true) {
        this.handleQueryOrgInfoOptions();
        //执行项目修改的时候,运行这个方法.
        this.handleQueryColSeq();
      }
    }
  },
  methods: {
    dialogClosed: function() {
      this.$refs["formObject"].resetFields();
      this.orgInfoOptions = [];
      this.$emit("update:show-dialog", false);

      /**
       *初始化表格内容
       */
      let _this = this;
      _this.tableData.forEach((v, i) => {
        v.show = "false";
        v.columnOrder = i + 1;
        _this.$refs.multipleTable.toggleRowSelection(v, false);
      });
    },
    tallDataListChanged: function() {
      console.log("sssssssssss");
      this.dialogClosed();
      this.$emit("refreshList");
    },
    handleSaveProject: function() {
      let _this = this;
      _this.currentData.bidShowColumnList = this.bidShowColumnList;
      console.log("需要保存的项目数据", _this.currentData);
      this.$refs["formObject"].validate(valid => {
        if (valid) {
          api
            .projectadd(_this.currentData)
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
              _this.tallDataListChanged();
            })
            .catch(err => {
              _this.tallDataListChanged();
              console.log("addProjectInfoApi error", err);
            });
        } else {
          //   console.log("error submit!!");
          return false;
        }
      });
    },
    handleQueryColSeq: function() {
      let _this = this;
      if (_this.oldCurrentData.id) {
        this.currentData = _this.oldCurrentData;
        api
          .searchbidlist(_this.oldCurrentData.id)
          .then(rs => {
            if (rs.result === 200) {
              if (rs.data != null && rs.data.length > 0) {
                rs.data.forEach(x => {
                  _this.tableData.forEach(y => {
                    if (x.columnKey === y.columnKey) {
                      y.show = "true";
                      y.columnOrder = x.columnOrder;
                      _this.$refs.multipleTable.toggleRowSelection(y, true);
                    }
                  });
                });
              }
            } else {
              this.$notify.error({
                title: "提示",
                message: rs.message
              });
            }
          })
          .catch(err => {
            console.log("searchorginfolist error", err);
          });
      }
    },
    handleQueryOrgInfoOptions: function() {
      let _this = this;
      let params = {
        sysId: 2,
        isDel: 0
      };
      api
        .searchorginfolist(params)
        .then(rs => {
          if (rs.result === 200) {
            if (rs.data != null && rs.data.length > 0) {
              _this.orgInfoOptions = rs.data;
            }
          } else {
            this.$notify.error({
              title: "提示",
              message: rs.message
            });
          }
        })
        .catch(err => {
          console.log("searchorginfolist error", err);
        });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.bidShowColumnList = val;
    }
  }
};
</script>

<style></style>
