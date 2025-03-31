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

const pinia = createPinia()
Unicon.add([uniUpload, uniUsersAlt, uniTrashAlt, uniBars, uniPlus, uniBell])
createApp(App).use(router).use(Unicon).use(pinia).mount('#app')
