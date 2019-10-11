<!-- 系统通知 -->
<template>
  <div style="padding-top:15px">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane
        label="企业通知"
        name="enterprise"
        v-if="checkButton('001008001001')"
      >
        <elist :is-view="activeName" />
      </el-tab-pane>
      <el-tab-pane
        label="医院通知"
        name="hospital"
        v-if="checkButton('001008001005')"
      >
        <hlist :is-view="activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import elist from "@/components/notice/Elist";
  import hlist from "@/components/notice/Hlist";

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
    if (this.checkButton("001008001001")) {
      this.activeName = "enterprise";
    } else if (this.checkButton("001008001005")) {
      this.activeName = "hospital";
    }
  },
  methods: {
    handleClick(tab, event) {}
  }
};
</script>

<style scoped></style>
