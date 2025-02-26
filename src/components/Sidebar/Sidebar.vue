<template>
  <aside
    class="sidebar"
    :class="{ collapsed: isSidebarCollapsed }"
    :style="{ width: sidebarWidth }"
  >
    <div class="sidebar-content">
      <nav class="sidebar-nav">
        <div class="nav-item">菜单项1</div>
        <div class="nav-item">菜单项2</div>
        <div class="nav-item">菜单项3</div>
      </nav>
    </div>
    <ToggleButton />
  </aside>
</template>
    
    <script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import ToggleButton from "./ToggleButton.vue"; // 引入 ToggleButton 组件
const store = useStore();

const isSidebarCollapsed = computed(
  () => store.state.layout.isSidebarCollapsed
);
const sidebarWidth = computed(() =>
  store.state.layout.isSidebarCollapsed
    ? `${store.state.layout.collapsedWidth}px`
    : `${store.state.layout.sidebarWidth}px`
);

const toggleCollapse = () => {
  store.commit("layout/TOGGLE_SIDEBAR"); // 注意这里需要加上命名空间 'layout/'，因为 layoutModule 是有命名空间的
};
</script>
    
    <style scoped>
.sidebar {
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #f5f5f5;
  border-right: 1px solid #ddd;
  z-index: 100;
  display: flex;
  flex-direction: column;
}

.sidebar-content {
  flex: 1;
  overflow: hidden;
}

.sidebar-nav {
  padding: 16px;
}

.nav-item {
  padding: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: opacity 0.3s;
}

.collapsed .nav-item {
  opacity: 0;
  pointer-events: none;
}
</style>