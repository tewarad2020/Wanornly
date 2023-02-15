import { createApp } from 'vue'
import router from './router'
import gAuthPlugin from 'vue3-google-oauth2'
import App from './App.vue'
import store from './store'

// const app = createApp(App)
const app = createApp(App).use(store)

const gauthOption = {
  clientId: '248618213008-007kntenfn3venvalkrsa3gajlp5npqt.apps.googleusercontent.com',
  scope: 'email',
  prompt: 'consent',
  plugin_name:'LibraryLoginApp'
}

// router.beforeEach((to, from) => {
//     console.log(from) 
//     console.log(to)

// })

app.use(gAuthPlugin, gauthOption)
app.use(router).mount('#app')


