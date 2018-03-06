import Vue from 'vue';
import mavonEditor from 'mavon-editor';
import App from './App';
import router from './router';
import 'mavon-editor/dist/css/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import '../static/css/common.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuelidate from 'vuelidate'


Vue.config.productionTip = false
Vue.use(VueAxios, axios);
Vue.use(Vuelidate);
Vue.use(mavonEditor);

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
