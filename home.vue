<template>
    <div>
        <el-button @click="goToPage('chat_1')" type="primary" size="medium">Chat 1</el-button>
        <el-button @click="goToPage('chat_2')" type="success" size="medium">Chat 2</el-button>
        <el-button @click="goToPage('chat_3')" type="warning" size="medium">Chat 3</el-button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
    // eslint-disable-next-line vue/multi-word-component-names
    name: 'home',
    setup() {
        const router = useRouter();

        const goToPage = (page: string) => {
            router.push(`/${page}`);
        };

        return { goToPage };
    }
});
</script>