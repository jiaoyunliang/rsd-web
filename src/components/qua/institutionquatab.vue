<template>
  <div style="padding-top:15px">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-button @click="back" size="mini">返回</el-button>
      <el-tab-pane
        label="产品资质"
        name="productQua"
        v-if="checkButton('001011001002') || checkButton('001011002002')"
      >
        <ProductQuaList :orgInfoDetail="orgInfoDetail" :is-view="activeName" />
      </el-tab-pane>
      <el-tab-pane
        label="企业资质"
        name="institutionQua"
        v-if="checkButton('001011001003') || checkButton('001011002003')"
      >
        <InstitutionQuaList
          :orgInfoDetail="orgInfoDetail"
          :is-view="activeName"
          :typeFlag="typeFlag"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import InstitutionQuaList from "@/components/qua/institutionqualist";
  import ProductQuaList from "@/components/qua/productqualist";

  export default {
  components: { InstitutionQuaList, ProductQuaList },
  props: {
    orgDetail: Object,
    typeFlag: Number
  },
  data() {
    return {
      activeName: "",
      orgInfoDetail: {}
    };
  },
  created: function() {},
  watch: {
    activeName: function(n, o) {
      this.orgInfoDetail = this.orgDetail;
    }
  },
  mounted: function() {
    if (this.checkButton("001011001002") || this.checkButton("001011002002")) {
      this.activeName = "productQua";
    } else if (
      this.checkButton("001011001003") ||
      this.checkButton("001011002003")
    ) {
      this.activeName = "institutionQua";
      this.orgInfoDetail = this.orgDetail;
    }
  },
  methods: {
    handleClick(tab, event) {},
    back() {
      this.$emit("back");
    }
  }
};
</script>
<style scoped></style>
