// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import Swiper from 'swiper/dist/js/swiper.js'
import 'swiper/dist/css/swiper.css'
window.Swiper = Swiper

import 'weui/dist/style/weui.css'
import 'flex.css'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
