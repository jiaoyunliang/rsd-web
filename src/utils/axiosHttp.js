import axios from "axios";
import router from "@/router";
import app from "@/main";
import {Notification} from "element-ui";

axios.defaults.baseURL = process.env.API_SERVER;
axios.defaults.timeout = 30000;
//axios.defaults.headers.common['Authorization'] = '';
axios.defaults.headers.post["Content-Type"] = "application/json";

axios.interceptors.request.use(
  config => {
    app.$Progress.start();
    return config;
  },
  error => {
    console.log("request error", error);
  }
);

axios.interceptors.response.use(
  response => {
    app.$Progress.finish();
    return response;
  },
  error => {
    if (error instanceof Error) {
      if (typeof error.response != "undefined") {
        switch (error.response.status) {
          case 401:
            Notification({
              title: "错误",
              message: "您的令牌已经失效，请重新登陆!",
              type: "error"
            });
            break;
          case 402:
            Notification({
              title: "错误",
              message: "您的令牌已经失效，请重新登陆!",
              type: "error"
            });
            router.push("/index");
            break;
          case 403:
            Notification({
              title: "错误",
              message: "您的令牌已经失效，请重新登陆!",
              type: "error"
            });
            break;
          default:
            Notification({
              title: "错误",
              message: "请检查服务器是否有响应！",
              type: "error"
            });
        }
        return Promise.reject(error.response.data);
      } else {
        Notification({
          title: "错误",
          message: "请检查服务器是否有响应！",
          type: "error"
        });
        router.push("/index");
        return Promise.reject(new Error("请检查服务器是否有响应！"));
      }
    }
  }
);

export default axios;

export const fetchPostToken = (url, params) => {
  return axios({
    method: "post",
    url: url,
    headers: {
      token: sessionStorage.getItem("token")
    },
    data: params
  })
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      // console.log("fetchPostToken error", error);
      return Promise.reject(error);
    });
};

export const fetchPost = (url, params) => {
  return axios({
    method: "post",
    url: url,
    data: params
  })
    .then(function(response) {
      return response.data;
    })
    .catch(function(error) {
      // console.log("fetchPost error", error);
      return Promise.reject(error);
    });
};
