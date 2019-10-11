<template>
  <div style="padding-top:15px">
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      type="border-card"
      v-if="this.$route.path === '/manager/project'"
    >
      <el-tab-pane
        label="本院项目"
        name="hospitalProject"
        v-if="checkButton('001006001004')"
      >
        <HosptialList :is-view="activeName" />
      </el-tab-pane>
      <el-tab-pane
        label="全网公开项目"
        name="allProject"
        v-if="checkButton('001006001005')"
      >
        <AllList :is-view="activeName" />
      </el-tab-pane>
    </el-tabs>
    <router-view />
  </div>
</template>
<script>
  import HosptialList from "@/components/project/list";
  import AllList from "@/components/project/alllist";

  export default {
  components: {
    HosptialList,
    AllList
  },
  data() {
    return {
      activeName: "hospitalProject"
    };
  },
  created: function() {},
  mounted: function() {
    if (this.checkButton("001006001004")) {
      this.activeName = "hospitalProject";
    } else if (this.checkButton("001006001005")) {
      this.activeName = "allProject";
    }
  },
  methods: {
    handleClick(tab, event) {},
    showChildBreadcrumb: function(key) {
      this.$parent.$parent.$parent.showChildBreadcrumb(key);ßß
    }
  }
};
</script>

<style scoped></style>
