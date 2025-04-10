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
    path: '/download',
    name: 'Download',
    component: DocsPage,
    alias: '/docs', // 保持旧路径兼容
    meta: {
      title: '下载智能会议助手'
    }
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

// 设置页面标题
router.beforeEach((to, from, next) => {
  document.title = to.meta.title ? `${to.meta.title} - 智能会议助手` : '智能会议助手'
  next()
})

export default router
