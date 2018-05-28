import Vue from 'vue'
import Router from 'vue-router'
import login from '@/components/backend/login'
import index from '@/components/backend/index'
import register from '@/components/backend/register'
import checkEmail from '@/components/backend/checkEmail'
import forgotPassword from '@/components/backend/forgotPassword'
import dataChange from '@/components/backend/dataChange'
import resetPassword from '@/components/backend/resetPassword'
import detail from '@/components/frontend/detail'
import userManager from '@/components/backend/userManager'
import articleManager from '@/components/backend/articleManager'
import tagManager from '@/components/backend/tagManager'
import articlesList from '@/components/frontend/articlesList'
import frontRegister from '@/components/frontend/register'
import frontLogin from '@/components/frontend/login'
import basicSetting from '@/components/frontend/basicSetting'

Vue.use(Router)

export default new Router({
  mode  : 'history',
  routes: [
    {
      path     : '/admin',
      name     : 'index',
      component: index,
      redirect : '/admin/articleManager',
      children : [
        {
          path     : '/admin/userManager',
          component: userManager
        },
        {
          path     : '/admin/articleManager',
          component: articleManager
        },
        {
          path     : '/admin/tagManager',
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
      path     : '/register',
      name     : 'frontRegister',
      component: frontRegister
    },
    {
      path     : '/login',
      name     : 'frontLogin',
      component: frontLogin
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
    },
    {
      path     : '/basicSetting',
      name     : 'basicSetting',
      component: basicSetting
    }
  ]
})
