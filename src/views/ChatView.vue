<template>
  <el-container style="height: 100vh;">
    <!-- Aside 部分 -->
    <el-aside :style="{ width: asideWidth } " class="aside-transition" style="overflow: hidden; height: 100%;">
      <conversationAside></conversationAside>
    </el-aside>
      <chat></chat>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import conversationAside from "@/components/conversationAside.vue";
import chat from "@/components/chatOnly.vue";

// 获取 Vuex store
const store = useStore();

// 从 Vuex 中获取 asideWidth
const asideWidth = computed(() => store.getters.asideWidth);

</script>

<style scoped>
.aside-transition {
  border: 0;
  background-color: #f5f5f5ed;
  transition: width 0.4s ease;
}
</style>
