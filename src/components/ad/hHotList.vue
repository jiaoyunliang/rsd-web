<!-- 医院热门推荐 -->
<template>
  <div>
    <el-row style="padding-top:15px">
      <el-col :span="24" style="text-align:center">
        <el-table
          :data="dataList"
          style="width: 100%"
          stripe
          v-loading="loading"
        >
          <el-table-column type="index" label="序号" width="50" />

          <el-table-column
            prop="name"
            label="关键字"
            width="200"
            :show-overflow-tooltip="true"
          />

          <el-table-column
            prop="adUrl"
            label="链接"
            :show-overflow-tooltip="true"
          >
            <template slot-scope="scope">
              <span v-if="scope.row.adUrl != null && scope.row.adUrl != ''">
                <a :href="scope.row.adUrl" target="_blank" class="link">{{
                  scope.row.adUrl
                }}</a>
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="seq" label="顺序" width="150" />

          <el-table-column prop="status" label="状态" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 0">
                启用
              </span>
              <span v-if="scope.row.status == 1">
                禁用
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button
                type="primary"
                size="mini"
                @click="handelEdit(scope.row)"
                >编辑</el-button
              >
              <el-button
                type="danger"
                size="mini"
                v-if="scope.row.status === 0"
                @click="
                  handelEditStatus({
                    id: scope.row.id,
                    status: 1,
                    adUrl: scope.row.adUrl
                  })
                "
                >禁用</el-button
              >
              <el-button
                type="danger"
                size="mini"
                v-if="scope.row.status === 1"
                @click="
                  handelEditStatus({
                    id: scope.row.id,
                    status: 0,
                    adUrl: scope.row.adUrl
                  })
                "
                >启用</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <hotEditDialog
      :dialog-title="dialogTitle"
      :show-dialog.sync="isShowDialog"
      :ad-object="adObject"
      @refreshList="onRefresList"
    />
  </div>
</template>

<script>
  import * as api from "@/api";
  import hotEditDialog from "@/components/ad/HotEditDialog";

  export default {
  components: {
    hotEditDialog
  },
  data() {
    return {
      dialogTitle: "",
      isShowDialog: false,
      loading: false,
      dataList: [],
      adObject: {},
      sysId: 2
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
        sysId: _this.sysId,
        type: 3
      };
      api
        .queryAdListApi(params)
        .then(rs => {
          if (rs.result === 200) {
            _this.loading = false;
            _this.dataList = rs.data;
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
          console.error("api queryAdListApi error", err);
        });
    },
    onRefresList: function() {
      this.fetchData();
    },
    handelEdit(ad) {
      let _this = this;
      _this.dialogTitle = "修改";
      _this.adObject = Object.assign({}, ad);
      _this.isShowDialog = true;
    },
    handelEditStatus(ad) {
      let _this = this;
      if (ad.status == 0 && ad.adUrl == null) {
        this.$notify({
          message: "链接未填写！",
          type: "warning"
        });
        return false;
      }
      if (confirm("确认修改?")) {
        api
          .updateAdApi(ad)
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
            console.error("api updateAdApi error", err);
          });
      }
    }
  }
};
</script>
<style>
a.link {
  color: #1e9efa;
  text-decoration: none;
}
a.link:hover {
  color: #1e9efa;
  text-decoration: none;
}
</style>
