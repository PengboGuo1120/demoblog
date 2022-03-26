<template>
  <div class="reset-password">
    <Modal v-if="modalActive" :modalMessage="modalMessage" v-on:close-modal="closeModal" />
    <Loading v-if="loading" />
    <div class="form-wrap">
      <form class="reset">
        <p class="login-register">
          返回
          <router-link class="router-link" :to="{ name: 'Login' }">登陆</router-link>
        </p>
        <h2>找回密码</h2>
        <p>忘记了你的登录密码？输入注册时的邮箱找回密码</p>
        <div class="inputs">
          <div class="input">
            <input type="text" placeholder="Email" v-model="email" />
            <email class="icon" />
          </div>
        </div>
        <button @click.prevent="resetPassword">提交</button>

        <!-- <div class="angle"></div> -->
      </form>
      <div class="background"></div>
    </div>
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue'
import Modal from '@/components/Modal.vue'
import email from '@/assets/Icons/envelope-regular.svg'
// 引入firebase
import firebase from 'firebase/app'
import 'firebase/auth'
export default {
  name: 'ForgotPassword',
  data() {
    return {
      email: '',
      modalActive: false,
      modalMessage: '',
      loading: null
    }
  },
  components: {
    email,
    Modal,
    Loading
  },
  methods: {
    closeModal() {
      this.modalActive = !this.modalActive
      this.email = ''
    },
    // 重置密码 回调函数
    resetPassword() {
      this.loading = true
      firebase
        .auth()
        .sendPasswordResetEmail(this.email)
        .then(() => {
          this.modalMessage = '密码重置邮件稍后将发送至您的注册邮箱！'
          this.loading = false
          this.modalActive = true
        })
        .catch(err => {
          this.modalMessage = err.message
          this.loading = false
          this.modalActive = true
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.reset-password {
  position: relative;
  .form-wrap {
    .reset {
      h2 {
        margin-bottom: 8px;
      }
      p {
        text-align: center;
        margin-bottom: 32px;
      }
    }
  }
}
</style>
