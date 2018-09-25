import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/pages/home'
import Login from '@/pages/login'

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
      path: '/Login',
      name: 'Login',
      component: Login
    }
  ]
})
// 登录控制
router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) {
    next({path: '/Login'})
  } else {
    next()
  }
})
export default router
