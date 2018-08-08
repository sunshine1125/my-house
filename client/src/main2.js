import Vue from 'vue';
import mavonEditor from 'mavon-editor';
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App';
import router from './router/index2';
import 'mavon-editor/dist/css/index.css';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery'
import 'bootstrap/dist/js/bootstrap.min';
import '../static/css/common.css'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuelidate from 'vuelidate'
import Validate from './tools/validate'
import moment from 'moment'
import SocialSharing from 'vue-social-sharing'


Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueAxios, axios);
Vue.use(Vuelidate);
Vue.use(mavonEditor);
Vue.use(Validate);
Vue.use(SocialSharing);
Vue.prototype.$moment = moment;


axios.interceptors.request.use(config => {
  if (localStorage.getItem('userInfo')) {
    let token = JSON.parse(localStorage.getItem('userInfo')).token;
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
