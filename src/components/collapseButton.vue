<template>
  <el-button @click="toggleAside" class="collapse-button" circle size="large">
    <img :src="iconSrc" alt="折叠/展开 Aside" class="icon" />
  </el-button>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import toggleRight from '../assets/toggle-right.png';
import toggleLeft from '../assets/toggle-left.png';

// 获取 Vuex store
const store = useStore();

// 计算属性，根据 isAsideCollapsed 状态返回不同的图标路径
const iconSrc = computed(() => 
  store.getters.isAsideCollapsed ? toggleRight : toggleLeft
);

// 触发 Vuex 中的 mutation 来切换 aside 状态
const toggleAside = () => {
  store.dispatch('toggleAside');
};
</script>

<style scoped>
.collapse-button {
  background-color: #f0f6ff;
  border: none;
  transition: background-color 0.3s, border-color 0.3s;
}

.collapse-button:hover {
  background-color: #dce6f1;
  border-color: #66b1ff;
}

.collapse-button:active {
  background-color: #3388cc;
  border-color: #3388cc;
}

.icon {
  width: 30px;
  height: 30px;
}
</style>
