<template>
  <div style="line-height:20px;">
    <script :id="ueId" type="text/plain"></script>
  </div>
</template>

<script>
  import "../../static/UE/ueditor.config";
  import "../../static/UE/ueditor.all";
  import "../../static/UE/ueditor.parse";
  import "../../static/UE/lang/zh-cn/zh-cn";

  export default {
  name: "UEditor",
  props: {
    value: {
      type: String
    },
    config: {
      type: Object
    }
  },
  data() {
    return {
      ueId: "editor_" + new Date().getTime(),
      instance: null,
      ready: false
    };
  },
  mounted() {
    //初始化UE
    console.log("UE Init", this.instance);
    this.initEditor();
  },
  watch: {
    value: function(val, oldVal) {
      if (val != null && this.ready) {
        // console.log("watch", val);
        this.instance.setContent(val);
        this.instance.focus(true);
      }
    }
  },
  beforeDestroy() {
    // console.log("UE Destroy", this.instance);
    if (this.instance != null && this.instance.destoryed) {
      this.instance.destory();
    }
  },
  methods: {
    initEditor() {
      let _this = this;
      this.$nextTick(() => {
        this.instance = UE.getEditor(this.ueId, this.config);
        this.instance.addListener("ready", () => {
          this.ready = true;
          this.$emit("ready", this.instance);
        });
      });
    },
    getUEContent: function() {
      return this.instance.getContent();
    },
    getUEContentTxt: function() {
      return this.instance.getContentTxt();
    },
    setUEContent(val) {
      // this.instance = UE.getEditor(this.ueId, this.ueditorConfig);
      this.instance.setContent(val);
    }
  }
};
</script>

<style></style>
