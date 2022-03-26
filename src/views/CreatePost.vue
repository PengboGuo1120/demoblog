<template>
  <div class="create-post">
    <BlogCoverPreview v-show="this.$store.state.blogPhotoPreview" />
    <!-- 上传blog后的加载页面 -->
    <Loading v-show="loading" />
    <div class="container">
      <div :class="{ invisible: !error }" class="err-message">
        <p><span>Error:</span>{{ this.errorMsg }}</p>
      </div>
      <div class="blog-info">
        <input type="text" placeholder="输入你的文章标题" v-model="blogTitle" />
        <div class="upload-file">
          <label for="blog-photo">上传文章封面</label>
          <input type="file" ref="blogPhoto" id="blog-photo" @change="fileChange" accept=".png, .jpg, .jpeg" />
          <button @click="openPreview" class="preview" :class="{ 'button-inactive': !this.$store.state.blogPhotoFileURL }">预览封面</button>
          <span>File Chosen : {{ this.$store.state.blogPhotoName }}</span>
        </div>
      </div>
      <div class="editor">
        <vue-editor :editorOptions="editorSettings" v-model="blogHTML" useCustomImageHandler @image-added="imageHandler"></vue-editor>
      </div>
      <div class="blog-actions">
        <button @click="uploadBlog">发布文章</button>
        <router-link class="router-button" :to="{ name: 'BlogPreview' }">文章预览</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/Loading'
import BlogCoverPreview from '@/components/BlogCoverPreview'
import firebase from 'firebase/app'
import 'firebase/storage'
import db from '../firebase/firebaseInit'
import Quill from 'quill'
window.Quill = Quill
const ImageResize = require('quill-image-resize-module').default
Quill.register('modules/imageResize', ImageResize)

export default {
  name: 'CreatePost',
  data() {
    return {
      // 存储上传的图片
      file: null,
      error: null,
      errorMsg: null,
      editorSettings: {
        modules: {
          imageResize: {}
        }
      },
      loading: null
    }
  },
  components: {
    BlogCoverPreview,
    Loading
  },
  methods: {
    // 上传图片的回调函数 onchange
    fileChange() {
      this.file = this.$refs.blogPhoto.files[0]
      const fileName = this.file.name
      this.$store.commit('fileNameChange', fileName)
      this.$store.commit('createFileURL', URL.createObjectURL(this.file))
    },
    // 打开图片预览
    openPreview() {
      this.$store.commit('openPhotoPreview')
    },
    // 将图片添加到文章列表
    imageHandler(file, Editor, cursorLocation, resetUploader) {
      const storageRef = firebase.storage().ref()
      const docRef = storageRef.child(`documents/blogPostPhotos/${file.name}`)
      docRef.put(file).on(
        'state_changed',
        snapshot => {
          console.log(snapshot)
        },
        err => {
          console.log(err)
        },
        async () => {
          const downloadURL = await docRef.getDownloadURL()
          Editor.insertEmbed(cursorLocation, 'image', downloadURL)
          resetUploader()
        }
      )
    },
    // 上传文章
    uploadBlog() {
      if (this.blogTitle.length !== 0 && this.blogHTML.length !== 0) {
        if (this.file) {
          this.loading = true
          // 上传服务器
          const storageRef = firebase.storage().ref()
          const docRef = storageRef.child(`documents/BlogCoverPhoto/${this.$store.state.blogPhotoName}`)
          docRef.put(this.file).on(
            'state_changed',
            snapshot => {
              console.log(snapshot)
            },
            err => {
              //
              console.log(err)
              this.loading = false
            },
            async () => {
              const downloadURL = await docRef.getDownloadURL()
              const timestamp = await Date.now()
              const dataBase = await db.collection('blogPosts').doc()

              await dataBase.set({
                blogID: dataBase.id,
                blogHTML: this.blogHTML,
                blogCoverPhoto: downloadURL,
                blogCoverPhotoName: this.blogCoverPhotoName,
                blogTitle: this.blogTitle,
                profileId: this.profileId,
                date: timestamp
              })
              await this.$store.dispatch('getPost')
              this.loading = false
              this.$router.push({ name: 'ViewBlog', params: { blogid: dataBase.id } })
            }
          )
          return
        }
        this.error = true
        this.errorMsg = '文章封面不能为空！'
        setTimeout(() => {
          this.error = false
        }, 4000)
        return
      }
      this.error = true
      this.errorMsg = '文章标题和文章内容不能为空！'
      setTimeout(() => {
        this.error = false
      }, 4000)
      return
    }
  },
  computed: {
    profileId() {
      return this.$store.state.profileId
    },
    blogCoverPhotoName() {
      return this.$store.state.blogPhotoName
    },
    blogTitle: {
      get() {
        return this.$store.state.blogTitle
      },
      set(payload) {
        this.$store.commit('updateBolgTitle', payload)
      }
    },
    blogHTML: {
      get() {
        return this.$store.state.blogHTML
      },
      set(payload) {
        this.$store.commit('newBlogPost', payload)
      }
    }
  }
}
</script>

<style lang="scss">
.create-post {
  position: relative;
  height: 100%;

  button {
    margin-top: 0;
  }

  .router-button {
    text-decoration: none;
    color: white;
  }

  label,
  button,
  .router-button {
    transition: 0.5s ease-in-out all;
    align-self: center;
    font-size: 14px;
    cursor: pointer;
    border-radius: 20px;
    padding: 12px 24px;
    color: #fff;
    background-color: #303030;
    text-decoration: none;

    &:hover {
      background-color: rgba(48, 48, 48, 0.7);
    }
  }

  .container {
    position: relative;
    height: 100%;
    padding: 10px 25px 60px;
  }

  //错误信息样式
  .invisible {
    opacity: 0 !important;
  }

  .err-message {
    width: 100%;
    padding: 12px;
    border-radius: 8px;
    color: #fff;
    margin-bottom: 10px;
    background-color: #303030;
    opacity: 1;
    transition: 0.5s ease all;

    p {
      font-size: 14px;
    }

    span {
      font-weight: 600;
    }
  }

  .blog-info {
    display: flex;
    margin-bottom: 32px;

    input:nth-child(1) {
      min-width: 300px;
    }

    input {
      transition: 0.5s ease-in-out all;
      padding: 10px 40px;
      border: none;
      border-bottom: 1px solid #303030;

      &:focus {
        outline: none;
        box-shadow: 0 1px 0 0 #303030;
      }
    }

    .upload-file {
      flex: 1;
      margin-left: 16px;
      position: relative;
      display: flex;

      input {
        display: none;
      }

      .preview {
        margin-left: 16px;
        text-transform: initial;
      }

      span {
        font-size: 12px;
        margin-left: 16px;
        align-self: center;
      }
    }
  }

  .editor {
    height: 60vh;
    display: flex;
    flex-direction: column;

    .quillWrapper {
      position: relative;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .ql-container {
      display: felx;
      flex-direction: column;
      height: 100%;
      overflow: scroll;
    }

    .qi-editor {
      padding: 20px 16px 30px;
    }
  }

  .blog-actions {
    margin-top: 32px;

    button {
      margin-right: 16px;
    }
  }
}
</style>
