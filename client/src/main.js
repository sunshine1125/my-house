// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import router from './router';
import ElmentUI from 'element-ui';
import Validate from './tools/validate';
import moment from 'moment';
import mavonEditor from 'mavon-editor';
import 'bootstrap/dist/css/bootstrap.css';
import $ from 'jquery'
import 'element-ui/lib/theme-chalk/index.css';
import '../static/css/common.css';


import App from './App'

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(ElmentUI);
Vue.use(Validate);
Vue.use(mavonEditor);

Vue.prototype.$moment = moment;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
