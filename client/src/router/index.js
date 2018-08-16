import Vue from 'vue'
import Router from 'vue-router'
import articleList from '@/components/articleList'
import detail from '@/components/detail'
import login from '@/components/login'
import register from '@/components/register'
import index from '@/components/index'
import test from '@/components/test'
import callback from '@/components/callback'

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
      path     : '/test',
      name     : 'test',
      component: test
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
          component: resolve => require.ensure([], () => resolve(require('@/components/articleManager')), 'admin')
        },
        {
          path     : '/admin/tagManager',
          component: resolve => require.ensure([], () => resolve(require('@/components/tagManager')), 'admin'),
        },
        {
          path     : '/admin/articleManager/:type/:id?',
          name     : 'articleChange',
          component: resolve => require.ensure([], () => resolve(require('@/components/articleChange')), 'admin')
        }
      ]
    }
  ]
})
