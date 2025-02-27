<template>
        <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @select="handleSelect">
            <el-menu-item v-for="conversation in conversations" :key="conversation.id" :index="conversation.id">
                <template #title>{{ conversation.name }}</template>
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
}
</style>