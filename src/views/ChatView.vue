<template>
  <el-container style="height: 100vh;">
    <!-- Aside 部分 -->
    <el-aside 
      :style="{ 
        width: asideWidth, 
        position: isMobile ? 'fixed' : 'static', 
        zIndex: isMobile && shouldZIndexTop ? 1000 : 'auto' 
      }" 
      class="aside-transition" 
      style="overflow: hidden; height: 100%;"
    >
      <conversationAside></conversationAside>
    </el-aside>
    <!-- 主内容区域 -->
    <chat :class="{ 'chat-blur': isMobile && shouldBlur }" :is-mobile="isMobile"></chat>
  </el-container>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useStore } from 'vuex';
import conversationAside from "@/components/conversationAside.vue";
import chat from "@/components/chatOnly.vue";

const store = useStore();

// 实时检测屏幕宽度
const screenWidth = ref(window.innerWidth);

const updateScreenWidth = () => {
  screenWidth.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener('resize', updateScreenWidth);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateScreenWidth);
});

// 判断是否为移动端
const isMobile = computed(() => screenWidth.value < 768);

// 判断 aside 是否展开
const isAsideOpen = computed(() => {
  return store.getters.asideWidth !== '0' && !store.getters.isAsideCollapsed;
});

// 控制 zIndex 是否置顶
const shouldZIndexTop = ref(false);

// 控制 chat 是否模糊
const shouldBlur = ref(false);

// 监听 isAsideOpen 的变化
watch(isAsideOpen, (newVal) => {
  console.log('isAsideOpen', newVal);
  if (isMobile.value) {
    if (newVal) {
      // 如果是移动端且 aside 展开，直接置顶并添加模糊效果
      shouldZIndexTop.value = true;
      shouldBlur.value = true;
      console.log('展开：置顶和模糊生效');
    } else {
      // 如果是移动端且 aside 折叠，等待 0.4s 后取消置顶和模糊效果
      setTimeout(() => {
        shouldZIndexTop.value = false;
        shouldBlur.value = false;
        console.log('折叠：置顶和模糊取消');
      }, 400); // 400ms 对应动画时长
    }
  }
});

// 根据屏幕宽度动态调整 asideWidth
const asideWidth = computed(() => {
  return store.getters.asideWidth;
});
</script>

<style scoped>
.aside-transition {
  border: 0;
  background-color: #f5f5f5ed;
  transition: width 0.4s ease;
}

/* chat 区域的模糊效果 */
.chat-blur {
  filter: blur(4px); /* 模糊程度 */
  transition: filter 0.4s ease; /* 过渡效果 */
}

/* 确保 filter 的初始值 */
chat {
  filter: blur(0);
  transition: filter 0.4s ease;
}
</style>