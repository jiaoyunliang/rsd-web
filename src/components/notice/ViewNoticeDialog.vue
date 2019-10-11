<!-- 查看通知 -->
<template>
  <div>
    <el-dialog
      :top="dialogTop"
      :title="dialogTitle"
      :close-on-click-modal="false"
      :visible="showDialog"
      @close="dialogClosed"
    >
      <el-row>
        <el-col :span="24" style="text-align:center;font-weight:bold;">{{
          currentData.title
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="text-align:center;line-height: 40px;">{{
          currentData.createTime | dateFormat
        }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="24" style="line-height: 25px;">{{
          currentData.content
        }}</el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    dialogTitle: "",
    showDialog: false,
    noticeObj: Object
  },
  data() {
    return {
      dialogTop: "5vh",
      currentData: {}
    };
  },
  created: function() {},
  mounted: function() {},
  computed: {},
  watch: {
    showDialog: function(n, o) {
      if (n == true) {
        this.currentData = Object.assign({}, this.noticeObj);
      }
    }
  },
  methods: {
    dialogClosed: function() {
      this.$emit("update:show-dialog", false);
    }
  }
};
</script>

<style></style>
