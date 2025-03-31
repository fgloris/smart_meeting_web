import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import HomeContent from '@/components/HomeContent.vue'
import DocsPage from '@/views/DocsPage.vue'
import AbilityPage from '@/views/Ability.vue'
import RecordsPage from '@/views/Records.vue'
import StreamPage from '@/views/Stream.vue'
import ChatPage from '@/views/Chat.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomeContent,
  },
  {
    path: '/docs',
    name: 'Docs',
    component: DocsPage,
  },
  {
    path: '/ability',
    name: 'Ability',
    component: AbilityPage,
  },
  {
    path: '/ability/records',
    name: 'Records',
    component: RecordsPage,
  },
  {
    path: '/ability/stream',
    name: 'Stream',
    component: StreamPage,
  },
  {
    path: '/ability/chat',
    name: 'Chat',
    component: ChatPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
