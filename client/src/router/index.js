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
import userManager from '@/components/userManager'
import articleManager from '@/components/articleManager'
import tagManager from '@/components/tagManager'
import articlesList from '@/components/articlesList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path     : '/admin',
      name     : 'index',
      component: index,
      redirect : '/admin/articleManager',
      children : [
        {
          path: '/admin/userManager',
          component: userManager
        },
        {
          path: '/admin/articleManager',
          component: articleManager
        },
        {
          path: '/admin/tagManager',
          component: tagManager
        },
        {
          path     : '/admin/dataChange/:type',
          name     : 'dataChange',
          component: dataChange
        },
      ]
    },
    {
      path     : '/admin/login',
      name     : 'login',
      component: login
    },
    {
      path     : '/admin/register',
      name     : 'register',
      component: register
    },
    {
      path     : '/admin/checkEmail',
      name     : 'checkEmail',
      component: checkEmail
    },
    {
      path     : '/admin/forgotPassword',
      name     : 'forgotPassword',
      component: forgotPassword
    },
    {
      path     : '/admin/resetPassword',
      name     : 'resetPassword',
      component: resetPassword
    },
    {
      path     : '/',
      name     : 'articlesList',
      component: articlesList
    },
    {
      path     : '/detail/:id',
      name     : 'detail',
      component: detail
    }
  ]
})
