<template>
  <div class="content">
    <el-dialog
      :center="true"
      :title="imageDialogTitle"
      :close-on-click-modal="false"
      :modal="false"
      :visible="isShowDialog"
      @close="tallDataListChanged"
    >
      <div class="content">
        <h1>企业资质</h1>
        <viewer :images="imgs">
          <el-row>
            <img
              width="300px"
              height="400px"
              v-for="src in imgs"
              :src="src.url"
              :key="src.title"
            />
          </el-row>
        </viewer>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  components: {},
  props: {
    imageDialogTitle: "",
    isShowDialog: false,
    fileRelation: Array
  },
  created: function() {},
  mounted: function() {},
  watch: {
    isShowDialog: function(n, o) {
      if (n == true) {
        this.foreachFile(this.fileRelation);
      }
    }
  },
  computed: {},
  data() {
    return {
      imgs: []
    };
  },
  methods: {
    dialogClosed: function() {
      this.imgs = [];
      this.$emit("update:isShowDialog", false);
    },
    tallDataListChanged: function() {
      this.dialogClosed();
      this.$emit("refreshList");
    },
    foreachFile: function(fileinfoarray) {
      console.log("图片地址1" + JSON.stringify(fileinfoarray));
      if (fileinfoarray != "undefined") {
        fileinfoarray.forEach(element => {
          let file = {};
          file.url = this.filePath(element.fileUrl);
          file.title = element.fileName;
          this.imgs.push(file);
        });
      }
    }
  }
};
</script>