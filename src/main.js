import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
// 引入element-ui和css文件
import "./assets/styles/reset.css";
// 引入样式重置的css样式
import http from "./http";
Vue.prototype.$http = http;
// 引入http文件中定义的http方法，并把http方法挂载为全局的方法
// http文件中定义了axios拦截器，使得每次请求都携带token，并且定义了请求数据的方法http

axios.defaults.headers.post["Contenst-Type"] = "application/json;";
// 在header中添加token
axios.defaults.headers.common["token"] = store.state.token;
Vue.config.productionTip = false;
Vue.prototype.$ajax = axios;
if(localStorage.getItem("token")){
  store.commit("set_token", localStorage.getItem("token"));
}
const myfilter = {
  bzdate: date => {
    if(date) {
      let timestring = new Date(date);
      return (
        timestring.toLocaleDateString() +
        " " +
        timestring.toTimeString().substr(0, 8)
      );
    }
  }
};
for (let key in myfilter) {
  Vue.filter(key, myfilter[key]);
}
// 添加请求拦截器
axios.interceptors.request.use(
  function(config) {
    // 在发送请求之前做些什么
    // 判断是否存在token，如果存在的话，将每个页面的header添加token
    if(store.state.token) {
      config.headers.common["token"] = store.state.token;
    }
    return config;
  },
  function(error) {
    router.push("/login");
    return Promise.reject(error);
  }
);
// 添加响应拦截器
axios.interceptors.response.use(
  function(response) {
    // 对响应数据做什么
    return response;
  },
  function (error) {
    // 对相应数据做点什么
    if(error.response) {
      switch (error.response.status) {
        case 401:
          store.commit("del_token");
          router.push("/login");
      }
    }
    return Promise.reject(error);
  }
);

Vue.config.productionTip = false;
Vue.use(ElementUI);
// 使用element - ui

Vue.use(Vuex);
// 其他用户属性可以在这里初始化，默认为未登录
const state = {
  userInfo: {},
  login: false
};
const mutations = {
  changeUserInfo(state, v) {
    // v就是传递的值
    state.userInfo = v;
  },
  $_setToken(state, value) {
    // 设置存储的token
    state.token = value;
    // 存储token
    localStorage.setItem("token", value);
  },
  $_removeStorage(state, value) {
    // 删除token
    localStorage.removeItem("token");
  }
};
// 监听数据变化的，来获取本地存储的登录信息
const getters = {
  // 监听数据变化的
  getStorage(state) {
    // 获取本地存储的登录信息
    if(!state.token) {
      state.token = JSON.parse(localStorage.getItem(key));
    }
    return state.token;
  }
};

export default new Vuex.Store({
  state,
  mutations,
  getters
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount("#app");
