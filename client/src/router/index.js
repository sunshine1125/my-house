import Vue from 'vue'
import Router from 'vue-router'
import articleList from '@/components/frontend/articlesList'
import articleDetail from '@/components/frontend/detail'

Vue.use(Router)

export default new Router({
  // mode  : 'history',
  routes: [
    {
      path     : '/admin',
      name     : 'index',
      component: resolve => require.ensure([], () => resolve(require('@/components/backend/index')), 'admin'),
      redirect : '/admin/articleManager',
      children : [
        {
          path     : '/admin/userManager',
          component: resolve => require.ensure([], () => resolve(require('@/components/backend/userManager')), 'admin'),
        },
        {
          path     : '/admin/articleManager',
          component: resolve => require.ensure([], () => resolve(require('@/components/backend/articleManager')), 'admin'),
        },
        {
          path     : '/admin/tagManager',
          component: resolve => require.ensure([], () => resolve(require('@/components/backend/tagManager')), 'admin'),
        },
        {
          path     : '/admin/dataChange/:type',
          name     : 'dataChange',
          component: resolve => require.ensure([], () => resolve(require('@/components/backend/dataChange')), 'admin')
        },
      ]
    },
    {
      path     : '/admin/login',
      name     : 'login',
      component: resolve => require.ensure([], () => resolve(require('@/components/backend/login')), 'adminLogin')
    },
    {
      path     : '/admin/register',
      name     : 'register',
      component: resolve => require.ensure([], () => resolve(require('@/components/backend/register')), 'adminRegister')
    },
    {
      path     : '/admin/checkEmail',
      name     : 'checkEmail',
      component: resolve => require.ensure([], () => resolve(require('@/components/backend/checkEmail')), 'admin')
    },
    {
      path     : '/admin/forgotPassword',
      name     : 'forgotPassword',
      component: resolve => require.ensure([], () => resolve(require('@/components/backend/forgotPassword')), 'admin')
    },
    {
      path     : '/admin/resetPassword',
      name     : 'resetPassword',
      component: resolve => require.ensure([], () => resolve(require('@/components/backend/resetPassword')), 'admin')
    },
    {
      path     : '/register',
      name     : 'frontRegister',
      component: resolve => require.ensure([], () => resolve(require('@/components/frontend/register')), 'admin')
    },
    {
      path     : '/login',
      name     : 'frontLogin',
      component: resolve => require.ensure([], () => resolve(require('@/components/frontend/login')), 'login')
    },
    {
      path     : '/',
      name     : 'articlesList',
      component: articleList
    },
    {
      path     : '/detail/:id',
      name     : 'detail',
      component: articleDetail
    },
    {
      path     : '/basicSetting',
      name     : 'basicSetting',
      component: resolve => require.ensure([], () => resolve(require('@/components/frontend/basicSetting')), 'basic')
    }
  ]
})
