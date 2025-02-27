<template>
    <el-container class="chat-container" style="collapse: hidden;">
        <el-header class="chat-header">
            <h1>AI Chat</h1>
            <el-button type="primary" @click="newChat">New Chat</el-button>
        </el-header>
        <el-main class="chat-content">
            <el-scrollbar>
                <div v-for="message in messages" :key="message.id" class="chat-message">
                    <el-card>
                        <p>{{ message.text }}</p>
                    </el-card>
                </div>
            </el-scrollbar>
        </el-main>
        <el-footer class="chat-footer">
            <el-upload
                class="upload-demo"
                drag
                action="#"
                :on-change="uploadFile"
                :show-file-list="false"
            >
                <el-button type="primary">Upload File</el-button>
            </el-upload>
            <el-input v-model="inputMessage" placeholder="Type your message..." class="input-message"></el-input>
            <el-button type="success" @click="sendMessage">Send</el-button>
        </el-footer>
    </el-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ElMessage } from 'element-plus';

export default defineComponent({
    name: 'ChatOnly',
    setup() {
        const messages = ref<{ id: number; text: string }[]>([]);
        const inputMessage = ref('');

        const newChat = () => {
            // Implement new chat logic here
            ElMessage.success('New chat started');
        };

        const uploadFile = (event: Event) => {
            // Implement file upload logic here
            ElMessage.success('File uploaded');
        };

        const sendMessage = () => {
            if (inputMessage.value.trim()) {
                messages.value.push({ id: Date.now(), text: inputMessage.value });
                inputMessage.value = '';
                ElMessage.success('Message sent');
            }
        };

        return {
            messages,
            inputMessage,
            newChat,
            uploadFile,
            sendMessage,
        };
    },
});
</script>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
}

.chat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f5f5f5;
    border-bottom: 1px solid #ddd;
}

.chat-content {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
}

.chat-message {
    margin-bottom: 1rem;
}

.chat-footer {
    display: flex;
    align-items: center;
    padding: 1rem;
    background-color: #f5f5f5;
    border-top: 1px solid #ddd;
}

.input-message {
    flex: 1;
    margin-right: 1rem;
}
</style>