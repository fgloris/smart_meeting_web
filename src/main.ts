import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Unicon from 'vue-unicons'
import { uniFolderDownload } from 'vue-unicons/dist/icons'

Unicon.add([uniFolderDownload])
createApp(App).use(Unicon).mount('#app')
