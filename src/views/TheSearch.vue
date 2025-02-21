<template>
    <el-button @click="dialogVisible = true"></el-button>
    <el-dialog
    v-model="dialogVisible"
    width="50%"
    >
    <div class="the-search">
    <!-- 输入框和发送按钮区域 -->
        <div class="status-area">
            <el-button @click="setSearch">搜索</el-button><el-button @click="setAsked">对话</el-button>
        </div>
        <div class="input-area">
            <el-input v-model="newMessage" placeholder="请输入消息..." clearable class="message-input"
                @keyup.enter="sendMessage"></el-input>

            <!-- 发送按钮 -->
            <el-button v-if="isAsked" type="primary" class="send-button" :disabled="isButtonDisabled"
                @click="sendMessage">发送</el-button>
            <el-button v-if="!isAsked" type="primary" class="send-button" :disabled="isButtonDisabled"
                @click="sendMessage">搜索</el-button><!--todo,搜索事件-->
            </div>
        <div >
        <div v-if="isAsked" class="chat-container">
        <!-- 聊天记录区域 -->
        <div class="chat-box">
            <!-- 循环遍历 messages 数组，显示每一条消息 -->
            <div v-for="(message, index) in messages" :key="index" class="message-item">
                <el-row :justify="message.sender === 'user' ? 'end' : 'start'">
                    <el-col :span="12">
                        <!-- 显示发送者头像，可以根据需要修改 -->
                        <el-avatar :src="message.sender === 'user' ? userAvatar : botAvatar"
                            class="message-avatar"></el-avatar>
                        <!-- 显示消息内容 -->
                        <el-card class="message-content" :body-style="{ padding: '10px' }">
                            <markdown-renderer :markdownContent="message.content" />
                        </el-card>
                    </el-col>
                </el-row>
            </div>
        </div>
            </div>
        <div v-else>这是搜索状态</div>
            </div>
        </div>
    </el-dialog>
</template>

<script lang="ts">
import { Chat } from '../service/coze_SDK';
import { defineComponent, ref } from 'vue';
import MarkdownRenderer from '../components/markdown.vue'; //markdown渲染组件

export default defineComponent({
    name: 'chat_1',
    components: {
        MarkdownRenderer
    },
    setup() {
        const isButtonDisabled = ref(false);
        const dialogVisible = ref(false);
        const isAsked = ref(false);
        // 定义存储聊天记录的数组，每条消息包括发送者（user 或 bot）和消息内容
        const messages = ref([
            { sender: 'bot', content: '你好！欢迎来到聊天界面。' },
        ]);
        // 定义输入框中的消息内容
        const newMessage = ref('');

        // 定义用户和机器人头像的变量
        const userAvatar = 'https://example.com/user-avatar.png'; // 这里使用一个假头像链接，实际可替换成用户头像
        const botAvatar = 'https://example.com/bot-avatar.png'; // 这里使用一个假头像链接，实际可替换成机器人头像
        const chat = new Chat()

        // 发送消息的函数
        const sendMessage = async () => {
            if (newMessage.value.trim()) {
                // 禁用按钮，开始发送
                isButtonDisabled.value = true;

                // 调用 SDK 的 sendMessage 方法
                await chat.initiateChat(newMessage.value, messages.value);

                // 清空输入框，恢复按钮
                newMessage.value = '';
                isButtonDisabled.value = false;
            }
        };

        const setAsked = () => {
            isAsked.value = true;
        }

        const setSearch = () => {
            isAsked.value = false;
        }

        return {
            messages,
            newMessage,
            userAvatar,
            botAvatar,
            sendMessage,
            isButtonDisabled,
            isAsked,
            setAsked,
            setSearch,
            dialogVisible
        };
    }
});
</script>

<style scoped>
/* 聊天容器 */

.the-search {
    display: fixed;
    margin: 100px  100px  0px 100px;
}

.chat-container {
    width: 100%;
    max-width: 600px;
    margin: 20px auto;
    background-color: #f9f9f9;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

/* 聊天记录区域 */
.chat-box {
    max-height: 400px;
    overflow-y: auto;
    margin-bottom: 10px;
}

/* 消息项样式 */
.message-item {
    margin-bottom: 10px;
}

/* 头像样式 */
.message-avatar {
    margin-right: 10px;
}

/* 消息内容的样式 */
.message-content {
    display: inline-block;
    max-width: 80%;
    background-color: #e0e0e0;
    border-radius: 10px;
    padding: 10px;
}

/* 发送消息的输入框 */
.message-input {
    width: 80%;
    margin-right: 10px;
}

/* 发送按钮 */
.send-button {
    width: 18%;
}
</style>