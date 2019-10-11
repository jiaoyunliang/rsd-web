<!-- 信息反馈 -->
<template>
  <div style="padding-top:15px">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane label="企业" name="enterprise">
        <elist :is-view="activeName" />
      </el-tab-pane>
      <el-tab-pane label="医院" name="hospital">
        <hlist :is-view="activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import elist from "@/components/feedback/Elist";
  import hlist from "@/components/feedback/Hlist";

  export default {
  components: {
    elist,
    hlist
  },
  data() {
    return {
      activeName: ""
    };
  },
  created: function() {},
  mounted: function() {
    this.activeName = "enterprise";
  },
  methods: {
    handleClick(tab, event) {}
  }
};
</script>

<style scoped></style>
