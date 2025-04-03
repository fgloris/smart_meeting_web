import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Unicon from 'vue-unicons'
import router from './router'
import { createPinia } from 'pinia'
import {
  uniUpload,
  uniUsersAlt,
  uniTrashAlt,
  uniBars,
  uniPlus,
  uniBell,
} from 'vue-unicons/dist/icons'

const app = createApp(App)
const pinia = createPinia()

// 注册图标
Unicon.add([uniUpload, uniUsersAlt, uniTrashAlt, uniBars, uniPlus, uniBell])

app.use(router)
app.use(Unicon)
app.use(pinia)
app.mount('#app')
