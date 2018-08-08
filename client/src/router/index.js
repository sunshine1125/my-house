import Vue from 'vue'
import Router from 'vue-router'
import articleList from '@/components/articleList'
import login from '@/components/login'
import register from '@/components/register'
import index from '@/components/index'
// import addArticle from '@/components/addArticle'

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
      path     : '/admin',
      name     : 'index',
      component: index,
      redirect : '/admin/articleManager',
      children : [
        {
          path     : '/admin/articleManager',
          component: resolve => require.ensure([], () => resolve(require('@/components/articleManager')), 'admin'),
        },
        {
          path     : '/admin/tagManager',
          component: resolve => require.ensure([], () => resolve(require('@/components/tagManager')), 'admin'),
        },
        {
          path     : '/admin/dataChange/:type',
          name     : 'dataChange',
          component: resolve => require.ensure([], () => resolve(require('@/components/dataChange')), 'admin')
        }
      ]
    }
  ]
})
