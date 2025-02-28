<template>
    <div style="text-align: center; padding: 10px; padding-top: 20px; padding-bottom: 30px;">
    <div style="display: flex; justify-content: left; align-items: center;">
      <img src="../assets/coze.png" alt="coze" style=" margin-right: 10px; max-width: 40px; max-height: 40px;"/>
      <img src="../assets/coze-text.png" alt="coze-text" style="max-width: 100px; max-height: 100px;"/>
    </div>
  </div>
    <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @select="handleSelect" style="height: calc(100% - 100px); overflow-y: auto; overflow-x: hidden;  padding: 10px;">
        <el-menu-item v-for="conversation in conversations" :key="conversation.id" :index="conversation.id">
            {{ conversation.name }}
        </el-menu-item>
    </el-menu>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'ConversationAside',
    setup() {
        const conversations = ref([
            { id: '1', name: 'Conversation 1' },
            { id: '2', name: 'Conversation 2' },
            { id: '3', name: 'Conversation 3' },
            { id: '4', name: 'Conversation 4' },
            { id: '5', name: 'Conversation 5' },
            { id: '6', name: 'Conversation 6' },
            { id: '7', name: 'Conversation 7' },
            { id: '8', name: 'Conversation 8' },
            { id: '9', name: 'Conversation 9' },
            { id: '10', name: 'Conversation 10' },
            { id: '11', name: 'Conversation 11' },
            { id: '12', name: 'Conversation 12' },
            { id: '13', name: 'Conversation 13' },
            { id: '14', name: 'Conversation 14' },
            // { id: '15', name: 'Conversation 15' },
        ]);

        const activeIndex = ref('1');

        const handleSelect = (key: string, keyPath: string[]) => {
            console.log(`Selected: ${key}, Path: ${keyPath}`);
        };

        return {
            activeIndex,
            handleSelect,
            conversations,
        };
    },
});
</script>

<style scoped>
.el-menu-vertical-demo {
    border-right: none;
    background-color: #f5f5f5ed;
    border: 0;
    /* 设置滚动条样式 */
    overflow-y: auto;
    transition: none; 
    height: calc(100% - 60px); /* 调整高度 */
}

.el-menu-vertical-demo::-webkit-scrollbar {
    width: 8px;
}

.el-menu-vertical-demo::-webkit-scrollbar-track {
    background: #f5f5f5ed;
}

.el-menu-vertical-demo::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

.el-menu-vertical-demo::-webkit-scrollbar-thumb:hover {
    background: #757575;
}
.el-menu-item {
  height: 50px; /* 设置每个菜单项的高度 */
  line-height: 50px; /* 垂直居中 */
}
/* 设置 el-menu-item 悬浮时的样式 */
.el-menu-item:hover {
  background-color: #f0f0f0; /* 悬浮时的背景色 */
  border-radius: 24px; /* 圆角效果 */
}

/* 设置选中项的样式 */
.el-menu-item.is-active {
  background-color: rgb(219, 234, 254); /* 选中时的背景色 */
  color: black;
  border-radius: 24px; /* 圆角效果 */
}
.el-menu-item:not(.is-active) {
  border-radius: 24px; /* 确保取消选中项时依然有圆角 */
  transition: none;
}
</style>