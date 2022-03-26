import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Blogs from '@/views/Blogs.vue'
import Login from '@/views/Login'
import Register from '@/views/Register'
import ForgotPassword from '@/views/ForgotPassword'
import Profile from '@/views/Profile'
import Admin from '@/views/Admin'
import CreatePost from '@/views/CreatePost'
import BlogPreview from '@/views/BlogPreview'
import ViewBlog from '@/views/ViewBlog'
import EditBlog from '@/views/EditBlog'

import firebase from 'firebase/app'
import 'firebase/auth'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: '首页',
      requiresAuth: false
    }
  },
  {
    path: '/blogs',
    name: 'Blogs',
    component: Blogs,
    meta: {
      title: '博客',
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: '登陆',
      requiresAuth: false
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: '注册',
      requiresAuth: false
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: {
      title: '重置密码',
      requiresAuth: false
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: {
      title: '个人信息',
      requiresAuth: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: Admin,
    meta: {
      title: 'Admin',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/create-post',
    name: 'CreatePost',
    component: CreatePost,
    meta: {
      title: '发表文章',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/post-preview',
    name: 'BlogPreview',
    component: BlogPreview,
    meta: {
      title: '文章预览',
      requiresAuth: true,
      requiresAdmin: true
    }
  },
  {
    path: '/view-blog/:blogid',
    name: 'ViewBlog',
    component: ViewBlog,
    meta: {
      title: '博客预览',
      requiresAuth: false
    }
  },
  {
    path: '/edit-blog/:blogid',
    name: 'EditBlog',
    component: EditBlog,
    meta: {
      title: '编辑博客',
      requiresAuth: true,
      requiresAdmin: true
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  document.title = `${to.meta.title} | MyDemoBlog`
  // 路由跳转 滚动条回到顶部
  // chrome
  document.body.scrollTop = 0
  // firefox
  document.documentElement.scrollTop = 0
  // safari
  window.pageYOffset = 0
  next()
})

router.beforeEach(async (to, from, next) => {
  let user = firebase.auth().currentUser
  let admin = null
  if (user) {
    let token = await user.getIdTokenResult()
    admin = token.claims.admin
  }
  if (to.matched.some(res => res.meta.requiresAuth)) {
    if (user) {
      if (to.matched.some(res => res.meta.requiresAdmin)) {
        if (admin) {
          return next()
        }
        return next({ name: 'Home' })
      }
      return next()
    }
    return next({ name: 'Home' })
  }
  return next()
})

export default router
