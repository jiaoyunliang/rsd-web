import Vue from "vue";
import Router from "vue-router";
import store from "@/store";
import Index from "@/components/Index";
import NotFound from "@/components/NotFound";

Vue.use(Router);
var menus = window.sessionStorage.menus; // 登录成功返回的菜单

function isEmptyObject(obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}

let generateRoutesFromMenu = ms => {
  var menuItems = [];
  if (!isEmptyObject(ms)) {
    menuItems = JSON.parse(ms);
  }
  store.dispatch("generateRoutes", menuItems);
  return store.getters.routeItems;
};

let routes = [
  {
    path: "/",
    redirect: "/index",
    meta: {
      auth: false
    }
  },
  {
    path: "/index",
    name: "index",
    component: Index,
    meta: {
      auth: false
    }
  },
  // {
  //   path: "/hw",
  //   name: "HelloWorld",
  //   component: HelloWorld
  // },
  ...generateRoutesFromMenu(menus),
  {
    path: "*",
    //redirect: "/index",
    component: NotFound
  }
];

export default new Router({
  routes: routes
});
