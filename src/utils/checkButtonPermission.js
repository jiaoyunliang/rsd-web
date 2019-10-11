export default {
  install(Vue, options) {
    Vue.prototype.checkButton = function(buttonCode) {
      return true; //this.$route.meta.buttons.get(buttonCode);
    };
    Vue.prototype.filePath = (fileUrl = "") => {
      if (fileUrl != "") {
        return options.fileServer + fileUrl;
      } else {
        return "";
      }
    };
    Vue.prototype.apiServer = options.apiServer;
  }
};
