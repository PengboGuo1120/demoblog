<template>
  <div class="form-wrap">
    <form class="register">
      <p class="login-register">
        已拥有MyDemoBlog账号？立即
        <router-link class="router-link" :to="{ name: 'Login' }">登陆</router-link>
        <br />
        返回
        <router-link class="router-link" :to="{ name: 'Home' }">首页</router-link>
      </p>

      <h2>注册MyDemoBlog账号</h2>
      <div class="inputs">
        <div class="input">
          <input type="text" placeholder="First Name" v-model="firstName" />
          <user class="icon" />
        </div>
        <div class="input">
          <input type="text" placeholder="last Name" v-model="lastName" />
          <user class="icon" />
        </div>
        <div class="input">
          <input type="text" placeholder="Username" v-model="userName" />
          <user class="icon" />
        </div>
        <div class="input">
          <input type="text" placeholder="E-mail" v-model="email" />
          <email class="icon" />
        </div>
        <div class="input">
          <input type="password" placeholder="Password" v-model="password" />
          <password class="icon" />
        </div>
        <div v-show="error" class="error">{{ this.errorMsg }}</div>
      </div>
      <button @click.prevent="register">注 册</button>
    </form>
    <div class="background"></div>
  </div>
</template>

<script>
import email from '@/assets/Icons/envelope-regular.svg'
import password from '@/assets/Icons/lock-alt-solid.svg'
import user from '@/assets/Icons/user-alt-light.svg'
// 引入firebase
import firebase from 'firebase/app'
import 'firebase/auth'
import db from '@/firebase/firebaseInit.js'
export default {
  name: 'Register',
  data() {
    return {
      firstName: '',
      lastName: '',
      userName: '',
      email: '',
      password: '',
      error: '',
      errorMsg: ''
    }
  },
  components: {
    email,
    password,
    user
  },
  methods: {
    // 用户注册点击按钮的回调函数
    async register() {
      if (
        // 简单地进行注册验证 保证表单不为空
        this.email !== '' &&
        this.password !== '' &&
        this.firstName !== '' &&
        this.lastName !== '' &&
        this.userName !== ''
      ) {
        this.error = false
        this.errorMsg = ''
        // 调用firebaseAPI 收集用户填写的信息创建用户信息
        const firebaseAuth = await firebase.auth()

        // 通过该方法创建用户时 会返回独一无二的id
        const createUser = await firebaseAuth.createUserWithEmailAndPassword(this.email, this.password)
        const result = await createUser
        const dataBase = db.collection('users').doc(result.user.uid)
        await dataBase.set({
          firstName: this.firstName,
          lastName: this.lastName,
          userName: this.userName,
          email: this.email
        })
        // 用户创建成功 返回主页
        this.$router.push({ name: 'Home' })
        return
      } else {
        this.error = true
        this.errorMsg = '请完整填写注册信息！'
        return
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.register {
  h2 {
    max-width: 350px;
  }
}
</style>
