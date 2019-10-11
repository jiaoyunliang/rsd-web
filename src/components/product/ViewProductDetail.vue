<template>
  <div>
    <el-row style="padding-top:15px">
      <el-col :span="20" class="prodName">{{
        productDetail.productName
      }}</el-col>
      <el-col :span="4" style="text-align:right"
        ><el-button @click="back" size="mini">返回</el-button></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-carousel height="360px" direction="vertical">
          <el-carousel-item v-for="(item, i) in picList" :key="i">
            <img :src="filePath(item.fileUrl)" class="prodImage" />
          </el-carousel-item>
        </el-carousel>
      </el-col>
      <el-col :span="12">
        <el-row>
          <el-col :span="24" style="height:40px;padding-left:10px"
            >商品名称：{{ productDetail.productName }}</el-col
          >
          <el-col :span="24" style="height:40px;padding-left:10px"
            >品牌：{{ productDetail.brandName }}</el-col
          >
          <el-col :span="24" style="height:40px;padding-left:10px"
            >厂家：{{ productDetail.manufacturer }}</el-col
          >
          <el-col :span="24" style="height:240px;text-align:center">
            <video
              v-if="video != null"
              :src="filePath(video.fileUrl)"
              controls="controls"
              width="350px"
              height="100%"
            >
              your browser does not support the video tag
            </video>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <hr />
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="产品介绍" name="tab1">
        <div class="remark">{{ productDetail.remark }}</div>
      </el-tab-pane>
      <el-tab-pane
        label="规格价格"
        name="tab2"
        style="width:80%;margin:0 auto;"
      >
        <el-table :data="priceList" stripe border style="width: 100%">
          <el-table-column
            prop="spec"
            label="规格"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            prop="price"
            label="价格"
            :show-overflow-tooltip="true"
          />
          <el-table-column
            prop="amount"
            label="数量"
            :show-overflow-tooltip="true"
          />
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import * as api from "@/api";

  export default {
  components: {},
  props: {
    productDetail: Object
  },
  data() {
    return {
      priceList: [],
      picList: [],
      video: {},
      activeName: "tab1"
    };
  },
  created: function() {
    this.handelProduct();
  },
  mounted: function() {},
  computed: {},
  watch: {},
  methods: {
    handelProduct() {
      let _this = this;
      let params = {
        id: _this.productDetail.id
      };
      api
        .queryProductApi(params)
        .then(rs => {
          if (rs.result === 200) {
            _this.priceList = rs.data.priceList;
            _this.picList = rs.data.picList;
            _this.video = rs.data.video;
          } else {
            _this.$notify.error({
              title: "提示",
              message: rs.message
            });
          }
        })
        .catch(err => {
          console.log("api queryProductApi error", err);
        });
    },
    back() {
      this.$emit("back");
    },
    handleClick(tab, event) {}
  }
};
</script>

<style>
.row {
  padding-top: 10px;
}
.prodName {
  font-size: 14px;
  font-weight: bold;
}
.card {
  text-align: center;
}
.prodImage {
  margin: 0 auto;
  height: 360px;
  display: block;
}
.remark {
  padding: 0 10px;
  line-height: 25px;
}
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>
