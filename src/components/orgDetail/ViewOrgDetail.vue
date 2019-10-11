<template>
  <div>
    <el-row style="padding-top:15px">
      <el-col :span="20">{{ orgDetail.orgName }}</el-col>
      <el-col :span="4" style="text-align:right"
        ><el-button @click="back" size="mini">返回</el-button></el-col
      >
    </el-row>
    <el-row class="row">
      <el-col :span="6">
        <el-card shadow="always" class="card">
          <img
            v-if="logo.fileUrl != ''"
            :src="filePath(logo.fileUrl)"
            class="logoImage"
          />
        </el-card>
      </el-col>
      <el-col :span="18" class="remark">{{ orgDetail.remark }}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="2">联系人:</el-col>
      <el-col :span="22">{{ orgDetail.contact }}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="2">联系方式:</el-col>
      <el-col :span="22">{{ orgDetail.contactInfo }}</el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="2">企业网址:</el-col>
      <el-col :span="22"
        ><a :href="'http://' + orgDetail.website" target="_black">{{
          orgDetail.website
        }}</a></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="10"><hr /></el-col>
      <el-col :span="4" style="text-align:center"
        ><span v-if="orgDetail.brandType == 1">自主品牌</span
        ><span v-if="orgDetail.brandType == 2">代理品牌</span></el-col
      >
      <el-col :span="10"><hr /></el-col>
    </el-row>
    <el-row
      type="flex"
      v-for="i in Math.ceil(brandPics.length / 4)"
      v-bind:key="i + `s`"
    >
      <el-col
        :span="6"
        v-for="(item, j) in brandPics.slice((i - 1) * 4, i * 4)"
        v-bind:key="j + `e`"
      >
        <img :src="filePath(item.fileUrl)" :key="item.id" class="brandImage" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as api from "@/api";

  export default {
  components: {},
  props: {
    orgDetail: Object
  },
  data() {
    return {
      logo: {
        fileUrl: ""
      },
      brandPics: []
    };
  },
  created: function() {
    this.handelQueryPic();
  },
  mounted: function() {},
  computed: {},
  watch: {},
  methods: {
    handelQueryPic() {
      let _this = this;
      let params = {
        orgId: _this.orgDetail.orgId
      };
      api
        .queryOrgDetailPicsApi(params)
        .then(rs => {
          if (rs.result === 200) {
            _this.loading = false;
            if (rs.data.logo != null) {
              _this.logo = rs.data.logo;
            }
            if (rs.data.brandPics != null && rs.data.brandPics.length > 0) {
              _this.brandPics = rs.data.brandPics;
            }
            // console.log("query", rs.data, _this.logo, _this.brandPics);
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
          console.log("api handelQueryPic error", err);
        });
    },
    back() {
      this.$emit("back");
    }
  }
};
</script>

<style>
.row {
  padding-top: 10px;
}
.card {
  text-align: center;
}
.logoImage {
  width: 100%;
  display: block;
}
.brandImage {
  margin: 0 auto;
  width: 222px;
  height: 67px;
  display: block;
}
.remark {
  padding: 0 10px;
  line-height: 25px;
}
</style>
