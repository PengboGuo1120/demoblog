<template>
  <header>
    <nav class="container">
      <div class="branding">
        <router-link class="header" :to="{ name: 'Home' }">MyDemoBlog</router-link>
      </div>
      <div class="nav-links">
        <ul v-show="!mobile">
          <router-link :class="{ selected: $route.path === '/' ? true : false }" class="link" :to="{ name: 'Home' }">首页</router-link>
          <router-link :class="{ selected: $route.path === '/blogs' ? true : false }" class="link" :to="{ name: 'Blogs' }">文章</router-link>
          <router-link v-if="admin" class="link" :to="{ name: 'CreatePost' }">发表文章</router-link>
          <router-link v-if="!user" class="link" :to="{ name: 'Login' }">登陆/注册</router-link>
        </ul>
        <!-- 个人信息弹出按钮 -->
        <div v-if="user" @click="toggleProfileMenu" class="profile" :class="{ mobileMenu: mobile ? true : false }" ref="profile">
          <span>{{ this.$store.state.profileInitials }}</span>
          <div class="profile-menu" v-show="profileMenu">
            <div class="info">
              <p class="initials">{{ this.$store.state.profileInitials }}</p>
              <div class="right">
                <p>{{ this.$store.state.profileFirstName }} {{ this.$store.state.profileLastName }}</p>
                <p>{{ this.$store.state.profileUsername }}</p>
                <p>{{ this.$store.state.profileEmail }}</p>
              </div>
            </div>
            <div class="options">
              <div class="option">
                <router-link class="option" :to="{ name: 'Profile' }">
                  <userIcon class="icon" />
                  <p>个人信息</p>
                </router-link>
              </div>
            </div>
            <div v-if="admin" class="options">
              <div class="option">
                <router-link class="option" :to="{ name: 'Admin' }">
                  <adminIcon class="icon" />
                  <p>权限管理</p>
                </router-link>
              </div>
            </div>
            <div class="options">
              <div @click="signOut" class="option">
                <signOutIcon class="icon" />
                <p>退出登录</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <menuIcon @click="toggleMobileNav" class="menu-icon" v-show="mobile" />
    <transition name="mobile-nav">
      <ul class="mobile-nav" v-show="mobileNav">
        <router-link :class="{ selected: $route.path === '/' ? true : false }" class="link" :to="{ name: 'Home' }">首页</router-link>
        <router-link :class="{ selected: $route.path === '/blogs' ? true : false }" class="link" :to="{ name: 'Blogs' }">文章</router-link>
        <router-link v-if="admin" class="link" :to="{ name: 'CreatePost' }">发表文章</router-link>
        <router-link v-if="!user" class="link" :to="{ name: 'Login' }">登陆 / 注册</router-link>
      </ul>
    </transition>
  </header>
</template>

<script>
import Bus from '@/utils/Bus.js'
import menuIcon from '../assets/Icons/bars-regular.svg'
import userIcon from '../assets/Icons/user-alt-light.svg'
import adminIcon from '../assets/Icons/user-crown-light.svg'
import signOutIcon from '../assets/Icons/sign-out-alt-regular.svg'
// 引入firebase
import firebase from 'firebase/app'
import 'firebase/auth'
export default {
  name: 'navigation',
  components: {
    menuIcon,
    userIcon,
    adminIcon,
    signOutIcon
  },
  data() {
    return {
      mobile: null,
      mobileNav: null,
      windowWidth: null,
      // 用户信息菜单显示与隐藏
      profileMenu: null
    }
  },
  created() {
    // 监听屏幕变化 调用函数
    window.addEventListener('resize', this.checkScreen)
    this.checkScreen()
  },
  mounted() {
    // 点击其他区域 隐藏移动模式的菜单按钮
    Bus.$on('hideNav', () => {
      this.mobileNav = false
    })
  },
  methods: {
    // 确认屏幕大小 决定是否显示mobile导航栏
    checkScreen() {
      this.windowWidth = window.innerWidth
      if (this.windowWidth <= 750) {
        this.mobile = true
        return
      }
      this.mobile = false
      this.mobileNav = false
      return
    },
    // 切换移动端导航栏的显示/隐藏
    toggleMobileNav() {
      this.mobileNav = !this.mobileNav
    },
    // 点击个人名称按钮显示隐藏个人信息操作栏
    toggleProfileMenu(e) {
      if (e.target === this.$refs.profile) {
        this.profileMenu = !this.profileMenu
      }
    },
    // 退出登录的回调函数
    signOut() {
      firebase.auth().signOut()
      window.location.reload()
    }
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    admin() {
      return this.$store.state.profileAdmin
    }
  }
}
</script>

<style lang="scss" scoped>
header {
  background-color: #fff;
  padding: 0 25px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  z-index: 99;

  .container {
    .selected {
      color: #1eb8b8;
      font-weight: 700;
    }
  }

  .link {
    font-weight: 500;
    padding: 0 8px;
    transition: 0.3s color ease;
    &:hover {
      color: #1eb8b8;
    }
  }
  nav {
    display: flex;
    padding: 25px 0;

    .branding {
      display: flex;
      align-items: center;

      .header {
        font-weight: 600;
        font-size: 24px;
        color: black;
        text-decoration: none;
      }
    }
    .nav-links {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;

      ul {
        margin-right: 32px;

        .link {
          margin-right: 32px;
        }

        .link:last-child {
          margin-right: 0;
        }
      }
      // 个人信息菜单 按钮
      .profile {
        position: relative;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        color: #fff;
        background-color: #303030;

        span {
          pointer-events: none;
        }

        .profile-menu {
          position: absolute;
          top: 60px;
          right: 0;
          width: 250px;
          background-color: #303030;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

          .info {
            display: flex;
            align-items: center;
            padding: 15px;
            border-bottom: 1px solid #fff;

            .initials {
              position: initial;
              width: 40px;
              height: 40px;
              background-color: #fff;
              color: #303030;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 50%;
            }

            .right {
              flex: 1;
              margin-left: 24px;

              p:nth-child(1) {
                font-size: 14px;
              }

              p:nth-child(2),
              p:nth-child(3) {
                font-size: 12px;
              }
            }
          }

          .options {
            padding: 15px;

            .option {
              text-decoration: none;
              color: #fff;
              display: flex;
              align-items: center;
              margin-bottom: 12px;

              .icon {
                width: 18px;
                height: auto;
              }

              p {
                font-size: 14px;
                margin-left: 12px;
              }
              &:last-child {
                margin-bottom: 0px;
              }
            }
          }
        }
      }
      // mobile模式的个人信息按钮 左移
      .mobileMenu {
        margin-right: 40px;
        width: 32px;
        height: 32px;
      }
    }
  }
  // 菜单列表icon样式
  .menu-icon {
    cursor: pointer;
    position: absolute;
    top: 30px;
    right: 25px;
    height: 25px;
  }

  .mobile-nav {
    padding: 20px;
    width: 70%;
    max-width: 250px;
    display: flex;
    flex-direction: column;
    position: fixed;
    height: 100%;
    background-color: #303030;
    top: 0;
    left: 0;

    .link {
      padding: 15px 0;
      color: white;
    }
  }
  // mobile导航栏进入淡出样式
  .mobile-nav-enter-active,
  .mobile-nav-leave-active {
    transition: all 1s ease;
  }

  .mobile-nav-enter {
    transform: translateX(-250px);
  }

  .mobile-nav-enter-to {
    transform: translateX(0);
  }

  .mobile-nav-leave-to {
    transform: translateX(-250px);
  }
}
</style>
