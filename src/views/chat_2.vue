<template>
  <div>
    <el-row>
      <el-col :span="18" offset="3">
        <!-- 聊天窗口 -->
        <div class="chat-container">
          <div class="messages">
            <!-- 展示用户和智能体的消息 -->
            <div v-for="(message, index) in messageList" :key="index" class="message">
              <div v-if="message.role === 'user'" class="user-message">
                <span>用户:</span> <markdown-renderer :markdownContent="message.content" />
              </div>
              <div v-else class="ai-message">
                <span>智能体:</span> <markdown-renderer :markdownContent="message.content" />
              </div>
            </div>
          </div>

          <!-- 输入框和发送按钮 -->
          <el-input v-model="userInput" placeholder="请输入消息" @keyup.enter="sendMessage" class="input-box" clearable />
          <el-button type="primary" @click="sendMessage">发送</el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Chat } from '../service/coze_SDK'; // 这里假设你已经有了 Chat 类
import MarkdownRenderer from '../components/markdown.vue'; //markdown渲染组件

// 响应式变量
const userInput = ref(''); // 用户输入的消息
const messageList = ref<{ role: string; content: string }[]>([]); // 消息列表
const conversationId = ref<string>(''); // 对话ID
const botId = '7469023039142395904'; // 机器人的 ID

// 发送消息
async function sendMessage() {
  if (userInput.value.trim() === '') return; // 防止发送空消息

  // 添加用户消息到消息列表
  messageList.value.push({
    role: 'user',
    content: userInput.value,
  });

  // 添加一个空的 AI 消息占位符
  messageList.value.push({
    role: 'assistant',
    content: '',
  });

  // 获取 chat 实例
  const chat = new Chat();

  // 构造消息数据
  const messageListToSend = messageList.value.map(msg => ({
    role: msg.role,
    content_type: 'text',
    content: msg.content,
  }));

  // 发送消息并接收响应
  await chat.create_chat(conversationId.value, botId, messageListToSend, (chunk) => {
    // 找到消息列表中最后一个 AI 消息并覆盖
    if (chunk && chunk.content) {
      const lastIndex = messageList.value.length - 1;
      if (messageList.value[lastIndex].role === 'assistant') {
        messageList.value[lastIndex].content = chunk.content;
      }
    }
  });

  // 清空用户输入
  userInput.value = '';
}

</script>

<style scoped>
.chat-container {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.messages {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 20px;
}

.message {
  margin-bottom: 10px;
}

.user-message {
  background-color: #e3f2fd;
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
}

.ai-message {
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
}

.input-box {
  width: 75%;
  margin-right: 10px;
}
</style>