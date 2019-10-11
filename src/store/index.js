import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import getters from "./getters";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";
Vue.config.debug = debug;
export default new Vuex.Store({
  strict: debug, // 这个属性如果设置true 一旦非mutation地方修改store里的值 就会提示error,意思就别随便动我的状态
  modules: {
    user
  },
  getters,
  middlewares: [Vuex.createLogger] // 中间件处理的东西
});
