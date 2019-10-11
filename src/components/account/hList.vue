<!-- 医院账号 -->
<template>
  <div style="padding-top:15px">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane
        label="医院管理"
        name="org"
        v-if="checkButton('001002002001')"
      >
        <HorgList :is-view="activeName" />
      </el-tab-pane>
      <el-tab-pane
        label="权限管理"
        name="role"
        v-if="checkButton('001002002004')"
      >
        <HroleList :is-view="activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import HorgList from "@/components/account/HorgList";
  import HroleList from "@/components/account/HroleList";

  export default {
  components: {
    HorgList,
    HroleList
  },
  data() {
    return {
      activeName: ""
    };
  },
  created: function() {},
  mounted: function() {
    if (this.checkButton("001002002001")) {
      this.activeName = "org";
    } else if (this.checkButton("001002002004")) {
      this.activeName = "role";
    }
  },
  methods: {
    handleClick(tab, event) {}
  }
};
</script>

<style scoped></style>
