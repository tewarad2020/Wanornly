import { createApp } from 'vue'
import router from './router'
import gAuthPlugin from 'vue3-google-oauth2'
import App from './App.vue'

const app = createApp(App)


const gauthOption = {
  clientId: '248618213008-007kntenfn3venvalkrsa3gajlp5npqt.apps.googleusercontent.com',
  scope: 'email',
  prompt: 'consent',
  plugin_name:'LibraryLoginApp'
}

app.use(gAuthPlugin, gauthOption)

app.use(router).mount('#app')


