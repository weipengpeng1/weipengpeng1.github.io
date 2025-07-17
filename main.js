import App from './App'
import uView from "uview-ui";

import { $http } from '@escook/request-miniprogram'
// import VueClipboard from 'vue-clipboard2'
import 'animate.css';
uni.$http = $http
$http.baseUrl = "https://api-driver.sph56.cn/api";

// Vue.use(VueClipboard)


uni.$showMsg = function(title = '数据请求失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}

// 请求开始之前做一些事情
$http.beforeRequest = function (options) {
	console.log("options",options)
  // uni.showLoading({
  //   title: '数据加载中...',
  // })
}

// 请求完成之后做一些事情
$http.afterRequest = function (options) {
    //uni.hideLoading()
}
// 封装弹框的方法
uni.$showMsg = function(title = '数据请求失败！', duration = 1500) {
  uni.showToast({
    title,
    duration,
    icon: 'none'
  })
}


Vue.use(uView);


// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif