<script setup lang="ts">
const username = "fgloris";

import { useRoute } from 'vue-router';
import TopNavBar from '@/components/TopNavBar.vue';
import SideNavBar from '@/components/SideNavBar.vue';
import AboutSection from '@/components/AboutSection.vue';

const route = useRoute();
</script>

<template>
  <div class="download-page">
    <TopNavBar v-bind:username="username" />
    <div class="content">
      <RouterView v-slot="{ Component }">
        <SideNavBar v-show="route.path.startsWith('/ability')" />
        <component :is="Component" />
      </RouterView>
      <AboutSection />
    </div>
  </div>
</template>

<style scoped>
.download-page {
  z-index: 0;
  margin: auto;
  background: black;
  position: relative;
  display: flex;
  flex-direction: column; /* 改为纵向排列 */
  color: white;
  background: linear-gradient(to bottom, 
    rgb(80,80,80) 0%,
    rgb(80,80,80) 10%,
    rgb(50,50,50) 60%,
    rgb(0,0,0) 100%
  );
  min-height: 120vh;
}
.content{
  display: flex;
  flex-direction: column;
  margin-top: 3%;
}
</style>