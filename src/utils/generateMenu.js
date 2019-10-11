import {loadView} from "../router/import";

export const generateMenu = () => {
  return new Promise((resolve, reject) => {
    let smenu = sessionStorage.getItem("menu");
    var menuItems = JSON.parse(smenu);
    let routes = [];
    if (menuItems.length != 0) {
      menuItems.forEach((x, i) => {
        console.log("item", x);
        let tmp = {};
        tmp.path = x.url;
        tmp.component = loadView(x.component);
        tmp.name = x.name;
        tmp.permission = x.code;
        routes.push(tmp);
      });
      resolve(routes);
    } else {
      reject("");
    }
  });
};

export const isEmptyObject = param => {
  for (var key in param) {
    return false;
  }
  return true;
};
