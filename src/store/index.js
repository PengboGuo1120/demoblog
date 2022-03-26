import Vue from 'vue'
import Vuex from 'vuex'
// 引入firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import db from '@/firebase/firebaseInit.js'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    // 存储上传的文章 用于展示
    blogPosts: [],
    postLoaded: null,
    blogHTML: '输入你的文章标题...',
    blogTitle: '',
    blogPhotoName: '',
    blogPhotoFileURL: null,
    blogPhotoPreview: null,
    editPost: null,
    user: null,
    profileAdmin: null,
    profileEmail: null,
    profileFirstName: null,
    profileLastName: null,
    profileUsername: null,
    profileId: null,
    profileInitials: null
  },
  getters: {
    blogPostsFeed(state) {
      return state.blogPosts.slice(0, 2)
    },
    blogPostsCards(state) {
      return state.blogPosts.slice(2, 6)
    }
  },
  mutations: {
    // 编辑按钮 获取blogs
    setBlogState(state, payload) {
      state.blogTitle = payload.blogTitle
      state.blogHTML = payload.blogHTML
      state.blogPhotoFileURL = payload.blogCoverPhoto
      state.blogPhotoName = payload.blogCoverPhotoName
    },
    // 删除blog
    filterBlogPost(state, payload) {
      state.blogPosts = state.blogPosts.filter(post => post.blogID !== payload)
    },
    // 获取博客输入框的内容
    newBlogPost(state, payload) {
      state.blogHTML = payload
    },
    updateBolgTitle(state, payload) {
      state.blogTitle = payload
    },
    // 上传图片名称
    fileNameChange(state, payload) {
      state.blogPhotoName = payload
    },
    // 保存上传图片的本地路径URL
    createFileURL(state, payload) {
      state.blogPhotoFileURL = payload
    },
    // 展示与关闭图片预览
    openPhotoPreview(state) {
      state.blogPhotoPreview = !state.blogPhotoPreview
    },
    // blogs界面编辑显示与隐藏按钮回调
    TOGGLEEDITPOST(state, payload) {
      state.editPost = payload
    },
    // 更新用户登录信息(boolean)
    updateUser(satte, payload) {
      satte.user = payload
    },
    // 获取用户信息
    SETPROFILEINFO(state, doc) {
      state.profileId = doc.id
      state.profileEmail = doc.data().email
      state.profileFirstName = doc.data().firstName
      state.profileLastName = doc.data().lastName
      state.profileUsername = doc.data().userName
    },
    // 添加用户管理权限信息
    SETPROFILEADMIN(state, payload) {
      state.profileAdmin = payload
      console.log(state.profileAdmin)
    },
    // 生成用户Name简称
    SETPROFILEINITIALS(state) {
      state.profileInitials = state.profileFirstName.match(/(\b\S)?/g).join('') + state.profileLastName.match(/(\b\S)?/g).join('')
    },
    // 修改个人信息
    changeFirstName(state, payload) {
      state.profileFirstName = payload
    },
    changeLastName(state, payload) {
      state.profileLastName = payload
    },
    changeUsername(state, payload) {
      state.profileUsername = payload
    }
  },
  actions: {
    async getCurrentUser({ commit }, user) {
      const dataBase = await db.collection('users').doc(firebase.auth().currentUser.uid)
      const dbResults = await dataBase.get()
      commit('SETPROFILEINFO', dbResults)
      commit('SETPROFILEINITIALS')
      const token = await user.getIdTokenResult()
      const admin = await token.claims.admin
      commit('SETPROFILEADMIN', admin)
    },
    // 提交个人信息的修改
    async updateUserSettings({ commit, state }) {
      const dataBase = await db.collection('users').doc(state.profileId)
      await dataBase.update({
        firstName: state.profileFirstName,
        lastName: state.profileLastName,
        userName: state.profileUsername
      })
      commit('SETPROFILEINITIALS')
    },
    // 加载文章列表用于展示
    async getPost({ state }) {
      const dataBase = await db.collection('blogPosts').orderBy('date', 'desc')
      const dbResults = await dataBase.get()
      dbResults.forEach(doc => {
        if (!state.blogPosts.some(post => post.blogID === doc.id)) {
          const data = {
            blogID: doc.data().blogID,
            blogHTML: doc.data().blogHTML,
            blogCoverPhoto: doc.data().blogCoverPhoto,
            blogTitle: doc.data().blogTitle,
            blogDate: doc.data().date,
            blogCoverPhotoName: doc.data().blogCoverPhotoName
          }
          state.blogPosts.push(data)
        }
      })
      state.postLoaded = true
    },
    //修改文章
    async updatePost({ commit, dispatch }, payload) {
      commit('filterBlogPost', payload)
      await dispatch('getPost')
    },
    // 删除文章按钮的回调函数 删除blog
    async deletePost({ commit }, payload) {
      const getPost = await db.collection('blogPosts').doc(payload)
      await getPost.delete()
      commit('filterBlogPost', payload)
    }
  },
  modules: {}
})
