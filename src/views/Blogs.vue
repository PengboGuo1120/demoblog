<template>
  <div class="blog-card-wrap" @click="currentClickElement($event)">
    <div class="blog-cards container">
      <div v-if="profileAdmin" class="toggle-edit">
        <span>编辑模式</span>
        <input type="checkbox" v-model="editPost" />
      </div>
      <BlogCard :post="post" v-for="(post, index) in blogPosts" :key="index"></BlogCard>
    </div>
  </div>
</template>

<script>
import Bus from '@/utils/Bus.js'
import BlogCard from '@/components/BlogCard'

export default {
  name: 'blogs',
  computed: {
    blogPosts() {
      return this.$store.state.blogPosts
    },
    editPost: {
      get() {
        return this.$store.state.editPost
      },
      set(payload) {
        this.$store.commit('TOGGLEEDITPOST', payload)
      }
    },
    profileAdmin() {
      return this.$store.state.profileAdmin
    }
  },
  methods: {
    currentClickElement(e) {
      const targetElement = Array.from(e.currentTarget.children)

      targetElement.some(item => {
        if (item.className !== 'mobile-nav') {
          Bus.$emit('hideNav')
        }
      })
    }
  },
  components: {
    BlogCard
  },
  beforeDestroy() {
    this.$store.commit('TOGGLEEDITPOST', false)
  }
}
</script>

<style lang="scss" scoped>
.blog-cards {
  position: relative;

  .toggle-edit {
    display: flex;
    align-items: center;
    position: absolute;
    top: -70px;
    right: 0;

    span {
      margin-right: 16px;
    }

    input[type='checkbox'] {
      position: relative;
      border: none;
      -webkit-appearance: none;
      background-color: #fff;
      outline: none;
      width: 80px;
      height: 30px;
      border-radius: 20px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    input[type='checkbox']:before {
      content: '';
      position: absolute;
      width: 30px;
      height: 30px;
      border-radius: 20px;
      top: 0;
      left: 0;
      background: #303030;
      transform: scale(1.1);
      transition: 750ms ease all;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    input:checked[type='checkbox']:before {
      background: #fff;
      left: 52px;
    }
  }
}
</style>
