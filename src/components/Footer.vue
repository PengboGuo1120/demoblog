<template>
  <footer>
    <div class="container">
      <div class="left">
        <div class="col-1">
          <router-link class="header" :to="{ name: 'Home' }">MyDemoBlog</router-link>
          <ul>
            <li>
              <a href="#"><weibo class="svg-icon aliIcon"/></a>
            </li>
            <li>
              <a href="#"><weixin class="svg-icon aliIcon"/></a>
            </li>
            <li>
              <a href="#"><instagram class="svg-icon"/></a>
            </li>
            <li>
              <a href="#"><linkedin class="svg-icon"/></a>
            </li>
          </ul>
        </div>
        <div class="col-2">
          <ul>
            <router-link class="link" :to="{ name: 'Home' }">首页</router-link>
            <router-link class="link" :to="{ name: 'Blogs' }">博客</router-link>
            <!-- v-if="admin" -->
            <router-link v-if="admin" class="link" :to="{ name: 'CreatePost' }">发布博客</router-link>
            <!-- v-if="!user" -->
            <router-link v-if="!user" class="link" :to="{ name: 'Login' }">登陆 / 注册</router-link>
          </ul>
        </div>
      </div>
      <div class="right">
        <p>2022 Thank you for viewing this site</p>
      </div>
    </div>
  </footer>
</template>

<script>
// svg icon 图标
import instagram from '../assets/Icons/instagram-brands.svg'
import linkedin from '../assets/Icons/linkedin-brands.svg'
import weibo from '../assets/Icons/weibo (1).svg'
import weixin from '../assets/Icons/微信 (2).svg'
export default {
  name: 'footer-vue',
  components: {
    instagram,
    linkedin,
    weibo,
    weixin
  },
  computed: {
    user() {
      return this.$store.state.user
    },
    admin() {
      return this.$store.state.profileAmin
    }
  }
}
</script>

<style lang="scss" scoped>
footer {
  margin-top: auto;
  padding: 100px 25px;
  background-color: #303030;

  .container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    @media (min-width: 750px) {
      flex-direction: row;
      gap: 0px;
    }
    > div {
      display: flex;
      flex: 1;
    }
    .left {
      gap: 32px;
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      @media (min-width: 750px) {
        flex-direction: row;
        align-items: initial;
        gap: 0;
      }
      .header {
        text-align: center;
        font-size: 24px;
        color: #fff;
        margin-bottom: 16px;
        text-decoration: none;
        font-weight: 600;
        @media (min-width: 750px) {
          text-align: initial;
        }
      }
      ul {
        gap: 16px;
        list-style: none;
        display: flex;
      }
      .col-1,
      .col-2 {
        gap: 32px;
        display: flex;
        flex: 1;
        @media (min-width: 750px) {
          gap: 0;
        }
      }
      .col-1 {
        flex-direction: column;
        h2 {
          text-align: center;
          @media (min-width: 750px) {
            text-align: initial;
          }
        }
        ul {
          margin-top: auto;
          li {
            display: flex;
            align-items: center;
            .svg-icon {
              width: 24px;
              height: auto;
              color: #fff;
            }
            .aliIcon {
              width: 30px;
              height: auto;
            }
          }
        }
      }
      .col-2 {
        ul {
          height: 100%;
          justify-content: center;
          flex-direction: row;
          flex-wrap: wrap;
          @media (min-width: 750px) {
            flex-direction: column;
          }
          .link {
            font-size: 16px;
            font-weight: 500;
            color: #fff;
            text-decoration: none;
          }
        }
      }
    }
    .right {
      gap: 32px;
      color: #fff;
      align-items: center;
      flex-direction: column;
      @media (min-width: 750px) {
        align-items: flex-end;
        gap: 0;
      }
    }
    p {
      margin-top: auto;
    }
  }
}
</style>
