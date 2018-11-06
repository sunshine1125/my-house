import Vue from 'vue'
import Router from 'vue-router'
import articleList from '@/components/views/articleList'
import detail from '@/components/views/detail'
import login from '@/components/views/login'
import register from '@/components/views/register'
import index from '@/components/views/index'
import callback from '@/components/callback'
import setting from '@/components/views/setting'
import password from '@/components/views/password'
import NotFoundComponent from '@/components/notFound'
import profile from '@/components/views/profile'
import follow from '@/components/views/follow'
import news from '@/components/views/news'

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
      path     : '/u/:id',
      name     : 'profile',
      component: profile
    },
    {
      path     : '/follow',
      name     : 'follow',
      component: follow
    },
    {
      path     : '/news',
      name     : 'news',
      component: news,
      redirect : '/news/comments',
      children : [
        {
          path     : '/news/comments',
          component: resolve => require.ensure([], () => resolve(require('@/components/views/n_comment')), 'news')
        },
        {
          path     : '/news/write',
          component: resolve => require.ensure([], () => resolve(require('@/components/views/n_write')), 'news')
        },
        {
          path     : '/news/like',
          component: resolve => require.ensure([], () => resolve(require('@/components/views/n_like')), 'news')
        },
        {
          path     : '/news/follow',
          component: resolve => require.ensure([], () => resolve(require('@/components/views/n_follow')), 'news')
        }
      ]
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
        },
        {
          path     : '/admin/userManager',
          name     : 'userManager',
          component: resolve => require.ensure([], () => resolve(require('@/components/views/userManager')), 'admin')
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
