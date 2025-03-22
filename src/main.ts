import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Unicon from 'vue-unicons'
import router from './router'
import { uniFolderDownload } from 'vue-unicons/dist/icons'

Unicon.add([uniFolderDownload])
createApp(App).use(router).use(Unicon).mount('#app')
