<template>
    <div class="header">
        <div class="collapse-button">
            <collapse-button v-if="!isCollapsed"></collapse-button>
        </div>
        <div class="logo">
            <img src="../assets/coze.png" alt="coze" class="logo-img"/>
            <img src="../assets/coze-text.png" alt="coze-text" class="logo-text"/>
        </div>
        <button v-if="isMobile" class="close-btn" @click="closeAside">×</button>
    </div>
    <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @select="handleSelect">
        <el-menu-item v-for="conversation in conversations" :key="conversation.id" :index="conversation.id">
            {{ conversation.name }}
        </el-menu-item>
    </el-menu>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useStore } from 'vuex';
import CollapseButton from './collapseButton.vue';

export default defineComponent({
    name: 'ConversationAside',
    components: {
        CollapseButton
    },
    emits: ['close'],
    setup(_, { emit }) {
        const store = useStore();
        const activeIndex = ref(store.state.selectedConversationId);
        const conversations = computed(() => store.getters.conversations);
        const isCollapsed = computed(() => store.state.isAsideCollapsed);
        const isMobile = computed(() => window.innerWidth < 768);

        watch(() => store.state.selectedConversationId, (newId) => {
            activeIndex.value = newId;
        });

        const handleSelect = (key: string) => {
            store.dispatch('setSelectedConversationId', key);
            if (isMobile.value) {
                emit('close');
            }
        };

        const closeAside = () => {
            emit('close');
        };

        return {
            activeIndex,
            handleSelect,
            conversations,
            isCollapsed,
            isMobile,
            closeAside
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
  background-color: #e1eeff; /* 悬浮时的背景色 */
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
.header {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    padding-top: 10px;
    padding-bottom: 30px;
}

.collapse-button {
    flex-shrink: 0;
    width: 50px; /* 固定宽度，确保按钮消失时占位不变 */
}

.logo {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1;
}

.logo-img {
    margin-right: 10px;
    max-width: 40px;
    max-height: 40px;
}

.logo-text {
    max-width: 100px;
    max-height: 100px;
}
</style>