<!-- 后台账号 -->
<template>
  <div style="padding-top:15px">
    <el-tabs v-model="activeName" @tab-click="handleClick" type="border-card">
      <el-tab-pane
        label="用户管理"
        name="account"
        v-if="checkButton('001002003002')"
      >
        <AccountList :is-view="activeName" />
      </el-tab-pane>
      <el-tab-pane
        label="权限管理"
        name="role"
        v-if="checkButton('001002003001')"
      >
        <RoleList :is-view="activeName" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
  import AccountList from "@/components/account/AccountList";
  import RoleList from "@/components/account/RoleList";

  export default {
  components: {
    AccountList,
    RoleList
  },
  data() {
    return {
      activeName: ""
    };
  },
  created: function() {},
  mounted: function() {
    if (this.checkButton("001002003002")) {
      this.activeName = "account";
    } else if (this.checkButton("001002003001")) {
      this.activeName = "role";
    }
  },
  methods: {
    handleClick(tab, event) {}
  }
};
</script>

<style scoped></style>
