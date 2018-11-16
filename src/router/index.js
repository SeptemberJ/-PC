import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/home'
import Login from '@/pages/login'
import Sign from '@/pages/sign'
import Guide from '@/pages/guide'
import CreateHome from '@/pages/createHome'
import Control from '@/components/cons/Control/Control'
import {getCookie} from '@/util/util'

Vue.use(VueRouter)

// export default router

const router = new VueRouter({
  routes: [
    {
      path: '/Home',
      name: 'Home',
      component: Home,
      meta: {requireAuth: true}
    },
    {
      path: '/Guide',
      name: 'Guide',
      component: Guide,
      meta: {requireAuth: true}
    },
    {
      path: '/CreateHome',
      name: 'CreateHome',
      component: CreateHome,
      meta: {requireAuth: true}
    },
    {
      path: '/Sign',
      name: 'Sign',
      component: Sign
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/Control',
      name: 'Control',
      component: Control
    },
    {path: '*', redirect: '/Login'}
  ]
})
// 登录控制
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    if (getCookie('btznkz')) {
      next()
    } else {
      console.log('nohas-----')
      next({path: '/Login'})
    }
  } else {
    next()
  }
})
export default router
