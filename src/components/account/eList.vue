<!-- 企业账号 -->
<template>
  <div style="padding-top:15px">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane
        label="机构管理"
        name="org"
        v-if="checkButton('001002001001')"
      >
        <EorgList :is-view="activeName" />
      </el-tab-pane>
      <el-tab-pane
        label="权限管理"
        name="role"
        v-if="checkButton('001002001004')"
      >
        <EroleList :is-view="activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import EorgList from "@/components/account/EorgList";
  import EroleList from "@/components/account/EroleList";

  export default {
  components: {
    EorgList,
    EroleList
  },
  data() {
    return {
      activeName: ""
    };
  },
  created: function() {},
  mounted: function() {
    if (this.checkButton("001002001001")) {
      this.activeName = "org";
    } else if (this.checkButton("001002001004")) {
      this.activeName = "role";
    }
  },
  methods: {
    handleClick(tab, event) {}
  }
};
</script>

<style scoped></style>
