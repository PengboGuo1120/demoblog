<template>
  <div class="home" @click="currentClickElement($event)">
    <BlogPost v-if="!user" :post="welcomeScreen"></BlogPost>
    <BlogPost :post="post" v-for="(post, index) in blogPostsFeed" :key="index"></BlogPost>
    <div class="blog-card-wrap">
      <div class="container">
        <h3>浏览更多</h3>
        <div class="blog-cards">
          <BlogCard :post="post" v-for="(post, index) in blogPostsCards" :key="index"></BlogCard>
        </div>
      </div>
    </div>
    <div v-if="!user" class="updates">
      <div class="container">
        <h2>获取最新博客，快来注册你的免费账户吧！</h2>
        <router-link class="router-button" :to="{ name: 'Register' }">
          注册DemoBlog账户
          <Arrow class="arrow arrow-light" />
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Bus from '@/utils/Bus.js'
import Arrow from '@/assets/Icons/arrow-right-light.svg'
import BlogCard from '@/components/BlogCard'
import BlogPost from '@/components/BlogPost.vue'
export default {
  name: 'Home',
  components: {
    BlogPost,
    BlogCard,
    Arrow
  },
  data() {
    return {
      // 欢迎模块
      welcomeScreen: {
        title: 'Welcome!',
        blogPost: '该DemoBlog基于Vue2及其全家桶进行开发，是一个单页面应用。使用Google Firebase作为后端，前后端分离，响应式布局。实现了用户注册、登陆、发布文章、编辑/维护文章等功能。（Firebase服务器由谷歌提供服务，页面需要代理才能正常显示）',
        welcomeScreen: true,
        photo: 'coding'
      }
    }
  },
  computed: {
    // 下方博客卡片展示数据
    blogPostsCards() {
      return this.$store.getters.blogPostsCards
    },
    // 主页面博客内容展示数据
    blogPostsFeed() {
      return this.$store.getters.blogPostsFeed
    },
    user() {
      return this.$store.state.user
    }
  },
  methods: {
    currentClickElement(e) {
      const targetElement = Array.from(e.currentTarget.children)
      console.log(e.currentTarget.children)

      targetElement.some(item => {
        if (item.className !== 'mobile-nav') {
          Bus.$emit('hideNav')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.blog-card-wrap {
  h3 {
    font-weight: 300;
    font-size: 28px;
    margin-bottom: 32px;
  }
}

.updates {
  .container {
    padding: 100px 25px;
    display: flex;
    flex-direction: column;
    align-items: center;
    @media (min-width: 800px) {
      padding: 125px 25px;
      flex-direction: row;
    }

    .router-button {
      display: flex;
      font-size: 14px;
      text-decoration: none;
      @media (min-width: 800px) {
        margin-left: auto;
      }
    }

    h2 {
      font-weight: 300;
      font-size: 32px;
      max-width: 425px;
      width: 100%;
      text-align: center;
      text-transform: uppercase;
      @media (min-width: 800px) {
        text-align: initial;
        font-size: 40px;
      }
    }
  }
}
</style>
