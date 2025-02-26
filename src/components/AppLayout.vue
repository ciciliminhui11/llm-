<template>
  <div class="app-container">
    <AppSidebar />
    <main
      class="main-content"
      :style="{
        'margin-left': sidebarMargin,
        width: `calc(100% - ${sidebarMargin})`,
      }"
    >
      <slot />
    </main>
  </div>
</template>
    
    <script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import AppSidebar from "../components/Sidebar/Sidebar.vue";

const store = useStore();
const sidebarMargin = computed(() =>
  store.state.layout.isSidebarCollapsed
    ? `${store.state.layout.collapsedWidth}px`
    : `${store.state.layout.sidebarWidth}px`
);
</script>
    
    <style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
  background-color: aqua;
  position: relative;
}

.main-content {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
  background-color: bisque;
  height: 100vh;
}
</style>
    