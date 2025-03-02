<!-- eslint-disable vue/no-deprecated-v-on-native-modifier -->
<template>
    <el-container class="chat-container">
        <el-header class="chat-header">
            <collapse-button v-if="isCollapsed"></collapse-button>
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
            <el-popover trigger="hover" :popper-style="{ minWidth: '0px', width: '88px' }" :disabled="isMobile">
                <template #reference>
                    <el-button type="primary" @click="newChat" class="custom-button" circle size="large">
                        <img src="../assets/newchat.png" alt="New Chat" />
                    </el-button>
                </template>
                <div>新建对话</div>
            </el-popover>
        </el-header>
        <div class="chat-wrapper">
            <div class="chat-content">
                <div v-if="messageList.length === 0" class="bot-info">
                    <img :src="selectedBotInfo.icon_url" alt="icon" class="bot-icon-large" />
                    <h2>{{ selectedBotInfo.bot_name }}</h2>
                    <p>{{ selectedBotInfo.description }}</p>
                </div>
                <div v-else>
                    <div v-for="message in messageList" :key="message.id" class="chat-message" :class="{
                        'user-message': message.sender === 'user',
                        'assistant-message': message.sender === 'assistant'
                    }">
                        <!-- 机器人头像 & 名称 -->
                        <div v-if="message.sender === 'assistant'" class="assistant-info">
                            <img :src="message.icon_url" alt="icon" class="assistant-icon" />
                            <span class="assistant-name">{{ message.bot_name }}</span>
                        </div>
                        <div v-if="message.reasoning_content" class="reasoning-content">
                            <markdown-renderer :markdownContent="message.reasoning_content" />
                        </div>
                        <div class="message-bubble">

                            <markdown-renderer :markdownContent="message.content" />
                            <span v-if="message.showLoading" class="loading-dot">•</span>

                            <div v-if="message.sender === 'user' && message.fileList.length">
                                <div v-for="file in message.fileList" :key="file.file_id" class="file-attachment">
                                    附件：{{ file.name }}
                                </div>
                            </div>
                        </div>
                        <div>



                            <el-popover trigger="hover" :popper-style="{ minWidth: '0px', width: '120px' }">
                                <template #reference>
                                    <img v-if="message.sender === 'assistant'" src="../assets/copy.png"
                                        alt="Copy Message" class="copy-icon"
                                        @click="copyToClipboard(message.content)" />
                                </template>
                                <div>复制对话内容</div>
                            </el-popover>
                        </div>

                    </div>
                </div>
            </div>
        </div>
        <div v-if="uploadedFiles.length" class="file-list-wrapper">
            <el-collapse v-model="activeNames" class="file-list-container">
                <el-collapse-item title="已上传文件" name="1">
                    <div class="file-list-flow">
                        <el-row v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
                            <el-col :span="20">
                                <span>{{ file.name }}</span>
                            </el-col>
                            <el-col :span="4">
                                <img src="../assets/delete.png" alt="删除" class="delete-icon"
                                    @click="removeFile(index)" />
                            </el-col>
                        </el-row>
                    </div>

                </el-collapse-item>
            </el-collapse>
        </div>
        <div class="chat-input">
            <el-popover trigger="hover" width="300" :disabled="isMobile">
                <template #reference>
                    <el-upload action="" :http-request="uploadFile" :before-upload="beforeUpload"
                        :show-file-list="false" :on-success="uploadSuccess">
                        <el-button type="primary" class="custom-button" circle size="large">
                            <img src="../assets/upload.png" alt="Upload File" />
                        </el-button>
                    </el-upload>
                </template>
                <h3>上传文件</h3>
                <div>支持的文件格式和大小：</div>
                <ul>
                    <li>文档：DOC、DOCX、XLS、XLSX、PPT、PPTX、PDF（最大 512 MB）</li>
                    <li>图片：JPG、JPG2、PNG、GIF、WEBP、HEIC、HEIF、BMP、PCD、TIFF（最大 512 MB）</li>
                </ul>
            </el-popover>
            <el-input v-model="inputMessage" placeholder="Type your message..." class="inputtext-class"
                :autosize="{ minRows: 2, maxRows: 10 }" type="textarea" resize="none"
                @keyup.enter.native="sendMessage"></el-input>
            <el-popover trigger="hover" :popper-style="{ minWidth: '0px', width: '88px' }" :disabled="isMobile">

                <template #reference>
                    <el-button type="primary" @click="sendMessage" :disabled="!inputMessage.trim()" circle size="large">
                        <img src="../assets/send.png" alt="send message" class="sendicon" />
                    </el-button>
                </template>
                <div>发送信息</div>
            </el-popover>

        </div>
    </el-container>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import { Bot, File, Message, Chat } from '../service/coze_SDK'
import CollapseButton from './collapseButton.vue';
import MarkdownRenderer from '../components/markdown.vue'; //markdown渲染组件

const props = defineProps({
    isMobile: {
        type: Boolean,
        required: true
    }
});

const store = useStore();
const inputMessage = ref('');
const selectedBot = ref('7469023039142395904');
const messageList = ref<any[]>([]);
const isCollapsed = computed(() => store.state.isAsideCollapsed);

// 监听 selectedConversationId 的变化
const message = new Message();
watch(() => store.state.selectedConversationId, async (newId) => {
    if (newId) {
        // 在这里进行网络请求
        console.log(`Selected Conversation ID: ${newId}`);
        messageList.value = [];
        // ...网络请求逻辑...
        const unchangedMessages = await message.message_list(newId);
        console.log(unchangedMessages);
        if (Array.isArray(unchangedMessages)) {
            // 匹配并显示选中的智能体
            const assistantMessage = unchangedMessages.find(msg => msg.role === 'assistant');
            if (assistantMessage && assistantMessage.bot_id) {
                selectedBot.value = assistantMessage.bot_id;
            }

            messageList.value = unchangedMessages.map((msg: any) => {
                const sender = msg.role === 'assistant' ? 'assistant' : 'user';
                const bot_id = msg.role === 'assistant' ? msg.bot_id : '';
                let content = msg.content;
                let reasoning_content = msg.reasoning_content || '';
                let fileList: any[] = [];
                let icon_url = '';
                let bot_name = '';

                if (msg.role === 'assistant') {
                    const bot = bots.value.find((b: any) => b.bot_id === bot_id);
                    icon_url = bot ? bot.icon_url : '';
                    bot_name = bot ? bot.bot_name : '';
                } else {
                    icon_url = '../assets/user.png';
                }

                if (msg.content_type === 'object_string') {
                    try {
                        const parsedContent = JSON.parse(msg.content);
                        if (Array.isArray(parsedContent)) {
                            content = parsedContent.map((item: any) => {
                                if (item.type === 'text') {
                                    return item.text;
                                } else {
                                    fileList.push({ file_id: item.file_id, name: item.name });
                                    return;
                                }
                            }).join(' ');
                        }
                    } catch (error) {
                        console.error('Error parsing content:', error);
                    }
                }

                return {
                    sender,
                    bot_id,
                    content,
                    reasoning_content,
                    fileList,
                    icon_url,
                    bot_name
                };
            });

            console.log(messageList.value);
            setTimeout(() => {
                scrollToBottom();
            }, 100);

        } else {
            console.error('Invalid message list format:', unchangedMessages);
            ElMessage.error('找不到该会话的内容');
        }
    }
});
//智能体选择
const bots = ref<any[]>([{
    bot_id: "7469023039142395904",
    bot_name: "ai机器人",
    description: "可以网页搜索、处理图片（文件/链接）、图片生成（依据图片/文字）、识别pdf，以回答多种问题。",
    icon_url: "https://lf26-appstore-sign.oceancloudapi.com/ocean-cloud-tos/FileBizType.BIZ_BOT_ICON/2373196263463619_1740890808010731756_8PVOxWWNut.png?lk3s=50ccb0c5&x-expires=1740977240&x-signature=t31C2h5NfaRtlI3JP7%2BxZDw7TOg%3D",
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
//智能体选择结束

const selectedBotInfo = computed(() => {
    return bots.value.find(bot => bot.bot_id === selectedBot.value) || {};
});


// 监听 isMobile 的变化
watch(
    () => props.isMobile,
    (newVal) => {
        if (newVal) {
            console.log('移动端：禁用所有 el-popover');
        } else {
            console.log('非移动端：启用所有 el-popover');
        }
    },
    { immediate: true }
);

const newChat = async () => {
    messageList.value = [];
    store.dispatch('setSelectedConversationId', '');
};

const chat = new Chat();  //实例化Chat类
const scrollToBottom = () => {
    const chatWrapper = document.querySelector('.chat-wrapper');
    if (!chatWrapper) return;

    const start = chatWrapper.scrollTop;
    const end = chatWrapper.scrollHeight;
    const duration = 1000; // 滚动持续时间（毫秒）
    const startTime = performance.now();

    const animateScroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1); // 计算进度，范围 0~1
        chatWrapper.scrollTop = start + (end - start) * easeOutQuad(progress);

        if (progress < 1) {
            requestAnimationFrame(animateScroll);
        }
    };

    requestAnimationFrame(animateScroll);
};

// 缓动函数（让滚动更自然）
const easeOutQuad = (t: number) => {
    return t * (2 - t);
};

const sendMessage = async () => {
    if (inputMessage.value.trim()) {
        scrollToBottom()
        const conversationId = store.state.selectedConversationId;
        const botId = selectedBot.value;
        const messageContent = inputMessage.value.trim();
        const messageListContent = [];

        if (uploadedFiles.value.length > 0) {
            const content = [
                { type: "text", text: messageContent },
                ...uploadedFiles.value.map(file => ({ type: "file", file_id: file.id, name: file.name }))
            ];
            messageListContent.push({
                role: "user",
                content,
                content_type: "object_string"
            });
        } else {
            messageListContent.push({
                role: "user",
                content: messageContent,
                content_type: "text"
            });
        }

        // 将用户消息添加到 messageList
        messageList.value.push({
            sender: 'user',
            content: messageContent,
            icon_url: '../assets/user.png',
            bot_name: '',
            fileList: uploadedFiles.value
        });
        inputMessage.value = '';
        uploadedFiles.value = [];

        // 预定好的 assistant 回复空内容
        const assistantMessage = {
            sender: 'assistant',
            content: '',
            reasoning_content: '',
            bot_id: selectedBotInfo.value.bot_id,
            icon_url: selectedBotInfo.value.icon_url,
            bot_name: selectedBotInfo.value.bot_name,
            showLoading: true
        };
        messageList.value.push(assistantMessage);

        await chat.create_chat(conversationId, botId, messageListContent, (chunk) => {
            // 处理流式更新的内容
            const lastAssistantMessage = messageList.value.findLast(msg => msg.sender === 'assistant');
            if (lastAssistantMessage) {
                lastAssistantMessage.content = chunk.content;
                lastAssistantMessage.reasoning_content = chunk.reasoning_content;
                if (chunk.status === "chat_completed") {
                    lastAssistantMessage.showLoading = false;

                    // 如果 messageList 之前为空，则添加新会话
                    if (messageList.value.length === 2) {
                        const newConversation = {
                            id: chunk.conversation_id,
                            name: messageList.value[0].content.substring(0, 13)
                        };
                        store.dispatch('addConversation', newConversation);
                        store.dispatch('setSelectedConversationId', chunk.conversation_id);
                    }
                }
            }
        });

        // 清空输入框和上传文件列表
        inputMessage.value = '';
        uploadedFiles.value = [];
    }
};

watch(messageList, () => {
    scrollToBottom(); // 当messageList变化时滚动到底部
});

//上传文件

const file = ref<File | null>(null);
const uploading = ref(false);
const uploadError = ref('');

const allowedFormats = [
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/pdf', 'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image.heic', 'image.heif',
    'image/bmp', 'image/x-pcd', 'image/tiff'
];
const maxFileSize = 512 * 1024 * 1024; // 512 MB

const beforeUpload = (selectedFile: any) => {
    if (!allowedFormats.includes(selectedFile.type)) {
        ElMessage.error('不支持的文件格式');
        return false;
    }
    if (selectedFile.size > maxFileSize) {
        ElMessage.error('文件大小超过限制（512 MB）');
        return false;
    }
    file.value = selectedFile;
    console.log(file.value);
    return true;
};

const uploadedFiles = ref<{ name: string, id: string }[]>([]);
const activeNames = ref<string[]>(['1']);

const uploadFile = async () => {
    if (!file.value) {
        ElMessage.error('请选择文件');
        return;
    }

    // 重置状态
    uploading.value = true;
    uploadError.value = '';

    try {
        const files = new File();
        const response = await files.upload(file.value);
        console.log('返回值', response);
        if (response && response.file_name) {
            uploadedFiles.value.push({
                name: response.file_name,
                id: response.id
            });
        }
    } catch (error) {
        uploadError.value = '上传失败，请重试';
        console.error('上传失败:', error);
    } finally {
        uploading.value = false;
    }
};

const uploadSuccess = () => {
    ElMessage.success('上传成功');
};

const removeFile = (index: number) => {
    uploadedFiles.value.splice(index, 1);
};

const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
        ElMessage.success('复制成功');
    }).catch(() => {
        ElMessage.error('复制失败');
    });
};

</script>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 100vh;
    position: relative;
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
    width: 240px;
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
    white-space: nowrap;
    /* 防止文字换行 */
}

chat-select {
    max-width: 200px;
}

.chat-wrapper {
    flex: 1;
    overflow-y: auto;
    /* 让外层滚动 */
    display: flex;
    justify-content: center;
    /* 水平居中 */
    align-items: flex-start;
    /* 从顶部开始 */
    padding: 1rem;
}

/* 内层内容，最大800px，居中 */
.chat-content {
    max-width: 800px;
    width: 100%;
    overflow-y: hidden;
    /* 禁止内部滚动 */
}

/* 消息容器 */
.chat-message {
    margin-bottom: 1rem;
}

/* 用户消息（靠右） */
.user-message {
    align-self: flex-end;
    text-align: right;
    margin-left: auto;
}

.user-message .message-bubble {
    display: inline-block;
    background-color: #dce6f1;
    color: #333;
    padding: 10px 20px;
    border-radius: 30px;
    /* 圆角 */
    max-width: 80%;
    word-wrap: break-word;
}

/* 机器人消息（调整布局） */
.assistant-message {
    max-width: 90%;
    display: flex;
    flex-direction: column;
    /* 让头像 & 名称单独占一行 */
    align-items: flex-start;
}

/* 机器人头像 & 名称 */
.assistant-info {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    /* 让气泡与头像有间距 */
}

.assistant-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 8px;
}

.assistant-name {
    font-weight: bold;
    font-size: 14px;
    color: #333;
}

/* 机器人消息气泡 */
.assistant-message .message-bubble {
    background-color: #f0f0f0;
    color: #333;
    padding: 10px 15px;
    border-radius: 30px;
    /* 左上 & 右下角圆角 */
    max-width: 100%;
    word-wrap: break-word;
    margin-top: 5px;
    /* 头像和内容之间的间距 */
}

.file-list-wrapper {
    width: 40%;
    min-width: 300px;
    /* 限制最大宽度 */
    margin-left: 1rem;
    
}

.file-list-container {
    border-top: 1px solid #dfecff;
    border-right: 1px solid #dfecff;

}

.file-list-flow {
    overflow-y: auto;
    max-height: 200px;
}

.file-item {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;
    position: relative;
}

.delete-icon {
    width: 20px;
    height: 20px;
    cursor: pointer;
}

.delete-icon:hover {
    background-color: #d3d3d3;
    border-radius: 50%;
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

.bot-info {
    text-align: center;
    margin-top: 2rem;
}

.bot-icon-large {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 1rem;
}

.loading-dot {
    display: inline-block;
    margin-left: 5px;
    animation: blink 1s infinite;
}

.copy-icon {
    width: 18px;
    height: 18px;
    cursor: pointer;
    margin-left: 20px;
    margin-top: 5px;
}

.copy-icon:hover {
    background-color: #d3d3d3;
    border-radius: 25%;
}

.file-attachment {
    margin-top: 5px;
    color: #666;
    font-size: 0.9em;
}

.reasoning-content {
    margin-top: 10px;
    padding: 10px;
    background-color: #e0f7fa;
    /* 浅蓝色背景 */
    border-left: 4px solid #0095ff;
    border-radius: 4px;
    color: rgba(0, 0, 0, 0.5);
    /* 半透明字体 */
}


@keyframes blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }
}
</style>
