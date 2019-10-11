<template>
  <div>
    <el-card shadow="always" class="box-card">
      {{ msg }}<br />
      <router-link to="/">返回首页</router-link>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      msg: "没有对应的操作权限，请联系管理员！"
    };
  },
  created: function() {},
  mounted: function() {},
  computed: {},
  methods: {}
};
</script>

<style>
.box-card {
  width: 480px;
  margin: 0 auto;
  text-align: center;
  margin-top: 200px;
}
</style>
