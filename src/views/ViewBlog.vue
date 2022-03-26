<template>
  <div class="post-view" v-if="currentBlog">
    <div class="container quillWrapper">
      <h2>{{ this.currentBlog[0].blogTitle }}</h2>
      <h4>发表于： {{ new Date(this.currentBlog[0].blogDate).toLocaleString('en-us', { dateStyle: 'long' }) }}</h4>
      <img :src="this.currentBlog[0].blogCoverPhoto" alt="image" />
      <div class="post-content ql-editor" v-html="this.currentBlog[0].blogHTML"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ViewBlog',
  data() {
    return {
      currentBlog: null
    }
  },
  methods: {
    // 获取博客信息
    async getPostList() {
      this.currentBlog = await this.$store.state.blogPosts.filter(post => {
        return post.blogID === this.$route.params.blogid
      })
    }
  },
  mounted() {
    this.getPostList()
  }
}
</script>

<style lang="scss">
.post-view {
  h4 {
    font-weight: 400;
    font-size: 14px;
    margin-bottom: 24px;
  }
}
</style>
