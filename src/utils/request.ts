import axios from "axios";
import qs from "qs";
import { Toast } from "vant";
import router from "@/router";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    "X-Requested-With": "XMLHttpRequest"
  },
  timeout: 20000 // request timeout
});

// 退出登录
function LOGIN_OUT() {
  // ... 推出登录操作
  router.replace("/login");
}

// 请求拦截
service.interceptors.request.use(
  (config) => {
    const type = config.headers["Content-Type"];
    const data = type === "application/x-www-form-urlencoded" ? qs.stringify(config.data) : config.data;
    config.data = data;
    return config;
  },
  (error) => {
    // do something with request error
    return Promise.reject(error);
  }
);

// 返回状态判断(添加响应拦截器)
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    if ((!res.code || res.code === 1) && res) {
      return res; // 直接返回全部数据
    } else if (res.code === 405) {
      LOGIN_OUT();
    } else {
      Toast.fail("请求错误！");
      // reject会在控制台显示报错
      return Promise.reject(res.msg || "接口请求超时,请稍后重试！");
    }
  },
  (error) => {
    if (error.response) {
      Toast.fail(error.response.data.msg);
    }
    return Promise.reject(error);
  }
);

export default service;
