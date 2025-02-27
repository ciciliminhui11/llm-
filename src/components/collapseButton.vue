<template>
    <el-button @click="toggleAside">折叠/展开 Aside</el-button>
  </template>
  
  <script setup lang="ts">
  import { useStore } from 'vuex';
  
  // 获取 Vuex store
  const store = useStore();
  
  // 触发 Vuex 中的 mutation 来切换 aside 状态
  const toggleAside = () => {
    store.dispatch('toggleAside');
  };
  </script>
  