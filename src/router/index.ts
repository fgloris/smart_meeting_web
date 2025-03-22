import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeContent from '../components/HomeContent.vue'
import DocsPage from '../views/DocsPage.vue'
import UpdatesPage from '../views/UpdatesPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeContent
  },
  {
    path: '/docs',
    name: 'Docs',
    component: DocsPage
  },
  {
    path: '/updates',
    name: 'Updates',
    component: UpdatesPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
