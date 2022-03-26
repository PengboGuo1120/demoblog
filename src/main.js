import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vue2Editor from 'vue2-editor'

Vue.use(Vue2Editor)

Vue.config.productionTip = false

// 引入firebase
import firebase from 'firebase/app'
import 'firebase/auth'

let app
firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
