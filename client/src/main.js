import Vue from 'vue';
import App from './App';
import router from './router';
import 'bootstrap/dist/css/bootstrap.css';
import axios from 'axios'
import VueAxios from 'vue-axios'


Vue.config.productionTip = false
Vue.use(VueAxios, axios);


axios.interceptors.request.use(config => {
  if (localStorage.getItem('username')) {
    let token = JSON.parse(localStorage.getItem('username')).token;
    if (token) {
      config.headers.Authorization = token;
    }
  }
  return config;

});

/* eslint-disable no-new */
new Vue({
  el        : '#app',
  router,
  components: {App},
  template  : '<App/>'
});
