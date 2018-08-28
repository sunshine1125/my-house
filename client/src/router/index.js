import Vue from 'vue'
import Router from 'vue-router'
import articleList from '@/components/views/articleList'
import detail from '@/components/views/detail'
import login from '@/components/views/login'
import register from '@/components/views/register'
import index from '@/components/index'
import callback from '@/components/callback'
import setting from '@/components/views/setting'
import password from '@/components/views/password'
import NotFoundComponent from '@/components/notFound'

Vue.use(Router)

export default new Router({
  mode  : 'history',
  routes: [
    {
      path     : '/register',
      name     : 'register',
      component: register
    },
    {
      path     : '/login',
      name     : 'login',
      component: login
    },
    {
      path     : '/',
      name     : 'articleList',
      component: articleList
    },
    {
      path     : '/detail/:id',
      name     : 'detail',
      component: detail
    },
    {
      path     : '/setting',
      name     : 'setting',
      component: setting
    },
    {
      path     : '/password/:type',
      name     : 'password',
      component: password
    },
    {
      path     : '/github/oauth/callback',
      name     : 'callback',
      component: callback
    },
    {
      path     : '/admin',
      name     : 'index',
      component: index,
      redirect : '/admin/articleManager',
      children : [
        {
          path     : '/admin/articleManager',
          component: resolve => require.ensure([], () => resolve(require('@/components/views/articleManager')), 'admin')
        },
        {
          path     : '/admin/tagManager',
          component: resolve => require.ensure([], () => resolve(require('@/components/views/tagManager')), 'admin'),
        },
        {
          path     : '/admin/articleManager/:type/:id?',
          name     : 'articleChange',
          component: resolve => require.ensure([], () => resolve(require('@/components/views/articleChange')), 'admin')
        }
      ]
    },
    {
      path     : '/404',
      name     : '404',
      component: NotFoundComponent
    },
    {
      path     : '*',
      component: NotFoundComponent
    }
  ]
})
