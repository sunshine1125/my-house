import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/login'
import index from '@/components/index'
import register from '@/components/register'
import checkEmail from '@/components/checkEmail'
import forgotPassword from '@/components/forgotPassword'
import dataChange from '@/components/dataChange'
import resetPassword from '@/components/resetPassword'
import detail from '@/components/detail'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path     : '/',
      name     : 'index',
      component: index
    },
    {
      path     : '/login',
      name     : 'login',
      component: login
    },
    {
      path     : '/register',
      name     : 'register',
      component: register
    },
    {
      path     : '/checkEmail',
      name     : 'checkEmail',
      component: checkEmail
    },
    {
      path     : '/forgotPassword',
      name     : 'forgotPassword',
      component: forgotPassword
    },
    {
      path     : '/dataChange',
      name     : 'dataChange',
      component: dataChange
    },
    {
      path     : '/resetPassword',
      name     : 'resetPassword',
      component: resetPassword
    },
    {
      path     : '/detail',
      name     : 'detail',
      component: detail
    }
  ]
})
