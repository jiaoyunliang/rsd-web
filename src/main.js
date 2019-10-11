// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import App from "./App";
import router from "./router";
import store from "./store";
import VueProgressBar from "vue-progressbar";
import checkButton from "@/utils/checkButtonPermission";
import gobalFilter from "@/utils/gobalFilter";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import preview from "vue-photo-preview";
import "vue-photo-preview/dist/skin.css";
import Viewer from "v-viewer";
import "viewerjs/dist/viewer.css";

Vue.use(Viewer);
Viewer.setDefaults({
  Options: {
    inline: true,
    button: true,
    navbar: true,
    title: true,
    toolbar: true,
    tooltip: true,
    movable: true,
    zoomable: true,
    rotatable: true,
    scalable: true,
    transition: true,
    fullscreen: true,
    keyboard: true,
    url: "data-source"
  }
});
Vue.config.productionTip = false;
// Vue.prototype.$http = axios;

const options = {
  color: "#bffaf3",
  failedColor: "#874b4b",
  thickness: "5px",
  transition: {
    speed: "0.2s",
    opacity: "0.6s",
    termination: 300
  },
  autoRevert: true,
  location: "left",
  inverse: false
};

Vue.use(VueProgressBar, options);
Vue.use(ElementUI);

// global function
const glOption = {
  apiServer: process.env.API_SERVER,
  fileServer: process.env.FILE_SERVER
};
Vue.use(checkButton, glOption);
let option = {
  fullscreenEl: false,
  modal: true
};
Vue.use(preview, option);
// global filter
for (let name in gobalFilter) {
  Vue.filter(name, gobalFilter[name]);
}

/* eslint-disable no-new */
export default new Vue({
  el: "#app",
  router,
  store,
  components: {
    App
  },
  template: "<App/>"
});
