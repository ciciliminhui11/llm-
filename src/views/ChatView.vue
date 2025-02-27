<template>
  <el-container style="height: 100%;">
    <!-- Aside 部分 -->
    <el-aside :style="{ width: asideWidth }" class="aside-transition" style="overflow: hidden;">
      <conversationAside></conversationAside>
    </el-aside>

    <el-main>
      <!-- 这里放置你的主要内容 -->
      <div style="padding: 20px;">
        <h1>主内容区</h1>
        <p>这里是主要内容</p>
        <!-- 使用 AsideToggleButton 组件 -->
        <AsideToggleButton />
      </div>
    </el-main>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStore } from 'vuex';
import conversationAside from "@/components/conversationAside.vue";
import AsideToggleButton from "@/components/collapseButton.vue";

// 获取 Vuex store
const store = useStore();

// 从 Vuex 中获取 asideWidth
const asideWidth = computed(() => store.getters.asideWidth);
</script>

<style scoped>
.aside-transition {
  transition: width 0.4s ease;
}
</style>
