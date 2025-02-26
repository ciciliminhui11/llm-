
<template>
  <AppLayout>
    <!-- 主聊天区域 -->
    <div class="chat-container">
      <MessageList />
      <InputArea />
    </div>
  </AppLayout>
</template>
  <script setup>
import AppLayout from "@/components/AppLayout.vue";
</script>
  <style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
</style>