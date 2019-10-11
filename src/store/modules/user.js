import * as types from "../types";
import {loadView} from "@/utils/import";

function text(data) {
  let routes = [];
  if (data.children != null) {
    data.children.forEach((item, i) => {
      if (item.resType == "2") {
        let route = link(item);
        routes.push(route);
      }
    });
  }
  return routes;
}

function link(data) {
  let route = {};
  route.path = data.resUrl;
  route.component = loadView(data.resComponent);
  route.name = data.resName;
  route.permission = data.resCode;
  route.children = [];
  let buttonMap = new Map();
  if (data.children != null) {
    data.children.forEach((item, i) => {
      if (item.resType == "1") {
        // console.log(i + '---' + item.resType, item);
        route.children = route.children.concat(text(item));
      } else if (item.resType == "2") {
        // console.log(i + '---' + item.resType, item);
        route.children = route.children.concat(link(item));
      } else if (item.resType == "3") {
        // console.log(i + '---' + item.resType, item);
        buttonMap.set(item.resCode, true);
      }
    });
  }
  route.meta = {
    auth: true,
    buttons: buttonMap
  };
  return route;
}

function createRoutes(tmp) {
  let routes = [];
  if (tmp.length != 0) {
    tmp.forEach((item, i) => {
      if (item.resType == "1") {
        let t = text(item);
        routes = routes.concat(t);
      } else if (item.resType == "2") {
        routes.push(link(item));
      }
    });
  }
  return routes;
}

export default {
  state: {
    user: {},
    isLogin: false,
    token: "",
    items: [],
    applyNonReadNum: 0
  },
  mutations: {
    [types.LOGIN]: (state, data) => {
      sessionStorage.setItem("token", data.token);
      state.token = data.token;
      state.isLogin = true;
      state.user = data.user;
    },
    [types.LOGOUT]: (state, data = {}) => {
      sessionStorage.clear();
      state.token = null;
      state.isLogin = false;
      state.user = data;
      state.items = [];
      state.applyNonReadNum = 0;
    },
    [types.VALIDATE_TOKEN]: (state, data) => {
      state.isLogin = true;
      state.token = data.token;
      state.user = data.user;
      state.applyNonReadNum = data.applyNonReadNum;
    },
    [types.ADD_MENUS]: (state, menus) => {
      window.sessionStorage.menus = [];
      sessionStorage.setItem("menus", JSON.stringify(menus));
    },
    [types.ADD_ROUTE]: (state, routes) => {
      state.items = [];
      state.items = routes;
    },
    [types.UPDATE_APPLY_NON_READ_NUM]: (state, num) => {
      state.applyNonReadNum = num;
    }
  },
  actions: {
    userLogout({ commit }, data) {
      commit(types.LOGOUT, data);
    },
    userLogin({ commit }, data) {
      commit(types.LOGIN, data);
    },
    validateToken({ commit }, data) {
      commit(types.VALIDATE_TOKEN, data);
    },
    updateApplyNonReadNum({ commit }, num) {
      commit(types.UPDATE_APPLY_NON_READ_NUM, num);
    },
    generateRoutes({ commit }, menus) {
      return new Promise((resolve, reject) => {
        var menuItems = menus;
        let routes = [];
        if (menuItems.length != 0) {
          routes = createRoutes(menuItems);
          commit(types.ADD_MENUS, menus);
          commit(types.ADD_ROUTE, routes);
        }
        resolve();
      });
    }
  }
};
