<template>
    <el-container class="chat-container">
        <el-header class="chat-header">
            <collapse-button></collapse-button>
            <div class="chat-select-container">
                <span class="chat-label">智能体：</span>
                <el-select v-model="selectedBot" placeholder="Select Chat" class="chat-select">
                    <el-option v-for="bot in bots" :key="bot.bot_id" :label="bot.bot_name" :value="bot.bot_id">
                        <div class="bot-option">
                            <img :src="bot.icon_url" alt="icon" class="bot-icon" /> {{ bot.bot_name }}
                        </div>
                    </el-option>
                </el-select>
            </div>
            <el-popover trigger="hover">
                <template #reference>
                    <el-button type="primary" @click="newChat" class="custom-button" circle size="large">
                        <img src="../assets/newchat.png" alt="New Chat" />
                    </el-button>
                </template>
                <div>新建对话</div>
            </el-popover>


        </el-header>
        <div class="chat-content">
            <el-scrollbar>
                <div v-for="message in messages" :key="message.id" class="chat-message">
                    <el-card>
                        <p>{{ message.text }}</p>
                    </el-card>
                </div>
            </el-scrollbar>
        </div>
        <div class="chat-input">
            <el-popover trigger="hover">
                <template #reference>
                    <el-button type="primary" @click="uploadFile" class="custom-button" circle size="large">
                        <img src="../assets/upload.png" alt="Upload File" />
                    </el-button>
                </template>
                <div>上传文件</div>
            </el-popover>
            <el-input v-model="inputMessage" placeholder="Type your message..." class="inputtext-class"
                :autosize="{ minRows: 2, maxRows: 10 }" type="textarea" resize="none"></el-input>
            <el-popover trigger="hover">

                <template #reference>
                    <el-button type="primary" @click="sendMessage" circle size="large">
                        <img src="../assets/send.png" alt="send message" class="sendicon" />
                    </el-button>
                </template>
                <div>发送信息</div>
            </el-popover>

        </div>
    </el-container>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Bot } from '../service/coze_SDK'
import CollapseButton from './collapseButton.vue';

export default defineComponent({
    name: 'ChatOnly',
    components: {
        CollapseButton
    },
    setup() {
        const messages = ref<{ id: number; text: string }[]>([]);
        const inputMessage = ref('');
        const selectedBot = ref('7469023039142395904');
        const bots = ref<any[]>([{
            bot_id: "7469023039142395904",
            bot_name: "ai机器人",
            description: "无所不能的ai机器人",
            icon_url: "https://lf9-appstore-sign.oceancloudapi.com/ocean-cloud-tos/FileBizType.BIZ_BOT_ICON/2373196263463619_1739017833177152246.jpeg?lk3s=50ccb0c5&x-expires=1740845336&x-signature=uc%2BJWYrthXIdOY2uYVMSavbWpBI%3D",
            publish_time: "1739095367"
        }]);

        const bot = new Bot();
        bot.bots_list().then((result) => {
            if (result) {
                bots.value = result;
                console.log(bots.value);
            }
        }).catch((error) => {
            console.error('Error fetching bots:', error);
            ElMessage.error('Error fetching bots');
        });

        const newChat = () => {
            // Implement new chat logic here
            ElMessage.success('New chat started');
        };
        const sendMessage = () => {
            if (inputMessage.value.trim()) {
                messages.value.push({ id: Date.now(), text: inputMessage.value });
                inputMessage.value = '';
                ElMessage.success('Message sent');
            }
        };
        const uploadFile = () => {
            // Implement file upload logic here
            ElMessage.success('File uploaded');
        };

        return {
            messages,
            inputMessage,
            newChat,
            sendMessage,
            uploadFile,
            selectedBot,
            bots,
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
    background-color: #f0f6ff;
    border-bottom: 1px solid #ffffff;
}

.custom-button {
    background-color: #f0f6ff;
    /* 原始背景色 */
    color: black;
    /* 原始文字颜色 */
    border: none;
    transition: background-color 0.3s, border-color 0.3s;
    /* 添加过渡效果 */
}

.custom-button:hover {
    background-color: #dce6f1;
    /* 悬浮时背景色 */
    border-color: #66b1ff;
    /* 悬浮时边框颜色 */
    color: black;
}



.custom-button:active {
    background-color: #3388cc;
    /* 点击后背景色 */
    border-color: #3388cc;
    /* 点击后边框颜色 */
}

.custom-button img {
    width: 30px;
    /* 根据需要调整 */
    height: 30px;
    /* 根据需要调整 */
}

.sendicon {
    width: 24px;
    /* 根据需要调整 */
    height: 24px;
    /* 根据需要调整 */
}

.chat-select-container {
    width: 300px;
    display: flex;
    align-items: center;
    margin: 0 auto;
    /* Center the select container */
}

.bot-option {
    display: flex;
    align-items: center;
}

.bot-icon {
    width: 20px;
    height: 20px;
    margin-right: 5px;
}

.chat-label {
    margin-right: 10px;
}

.chat-select {
    max-width: 200px;
}

.chat-content {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
}

.chat-message {
    margin-bottom: 1rem;
}

.chat-input {
    display: flex;
    align-items: center;
    padding: 1rem;
    background-color: #f0f6ff;
    border-top: 1px solid #dfecff;
    position: sticky;
    bottom: 0;
    justify-content: center;
    /* Center the input container */
}

.inputtext-class {
    width: 100%;
    margin-right: 20px;
    margin-left: 20px;
    /* Add margin-left to align with upload button */
}
</style>
