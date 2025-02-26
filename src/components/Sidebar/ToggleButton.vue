<template>
  <button @click="toggle">
    <span v-if="isCollapsed">→</span>
    <span v-else>←</span>
  </button>
</template>
    
    <script setup>
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();
const isCollapsed = computed(() => store.state.layout.isSidebarCollapsed);

// 点击按钮时触发的方法，调用 Vuex 的 mutation 来切换侧边栏的状态
const toggle = () => {
  console.log("Before toggle:", store.state.layout.isSidebarCollapsed);
  store.commit("layout/TOGGLE_SIDEBAR");
  console.log("After toggle:", store.state.layout.isSidebarCollapsed);
};
</script>
    
    <style scoped>
button {
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  /* 将按钮移到顶部 */
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1000; /* 确保按钮在其他元素之上 */
}
</style>