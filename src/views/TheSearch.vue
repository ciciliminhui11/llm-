

<script lang="ts">
import { Chat } from '../service/coze_SDK';
import { defineComponent, ref,watch,nextTick } from 'vue';
import MarkdownRenderer from '../components/markdown.vue'; //markdown渲染组件
console.log('@/assets')
import userAvatarImg from '../assets/user.png'; //用户头像
import botAvatarImg from '../assets/robot.png'; //机器人头像

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
        const userAvatar = ref(userAvatarImg); // 这里使用一个假头像链接，实际可替换成用户头像
        const botAvatar = ref(botAvatarImg); // 这里使用一个假头像链接，实际可替换成机器人头像
        const chat = new Chat()

        // 发送消息的函数
        const sendMessage = async () => {
            if (newMessage.value.trim()) {
                // 禁用按钮，开始发送
                isButtonDisabled.value = true;

                //使用temp传输消息，清空输入框，避免重复发送
                const temp = newMessage.value;
                newMessage.value = '';

                // 调用 SDK 的 sendMessage 方法
                await chat.initiateChat(temp, messages.value);

                // 清空输入框，恢复按钮
                isButtonDisabled.value = false;
            }
        };

        const setAsked = () => {
            isAsked.value = true;
        }

        const setSearch = () => {
            isAsked.value = false;
        }

        watch(
          messages,
          async () => {
            try {
              await nextTick()
              ScrollToBottom()
            } catch (error) {
              console.error('消息滚动失败:', error)
            }
          },
          {
            deep: true, // 深度监听数组变化
            immediate: false // 组件初始化时不执行
          }
        )


        //实现消息自动滚动
        const chatBox = ref<HTMLElement | null>(null)

        const ScrollToBottom = () => {
            const container = chatBox.value;
            if (!container) return;

             // 是否已经接近底部（阈值可调）
            const isNearBottom = 
            container.scrollHeight - container.scrollTop <= container.clientHeight + 100;

            // 只有当前在底部附近时才自动滚动
            if (isNearBottom) {
            container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth' // 可选平滑滚动
    });
  }
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
            dialogVisible,
            chatBox
        };
    }
});
</script>

<template>
    <button @click="dialogVisible = true" class="search-button">
    <div class="button-content">
      <span class="left-content">
        <el-icon><Search /></el-icon>
        <span class="text">点击搜索</span>
      </span>
      <span class="right-content">
        <el-icon><WindPower /></el-icon>
      </span>
    </div>
  </button>


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
            <el-button v-if="isAsked && !isButtonDisabled" type="primary" class="send-button" :disabled="isButtonDisabled"
                @click="sendMessage">发送</el-button>
            <el-button v-if="isAsked && isButtonDisabled" type="primary" class="send-button" :disabled="isButtonDisabled"
                >发送中</el-button>
                <!-- todo：停止发送消息，改变样式以及绑定取消事件-->
            <el-button v-if="!isAsked" type="primary" class="send-button"
                @click="sendMessage">搜索</el-button><!--todo,搜索事件-->
            </div>
        <div >
        <div v-if="isAsked" class="chat-container">
        <!-- 聊天记录区域 -->
        <div ref="chatBox" class="chat-box">
            <!-- 循环遍历 messages 数组，显示每一条消息 -->
            <div v-for="(message, index) in messages" :key="index" class="message-item">
                <el-row :justify="'start'">
                    <el-col :span="23">
                        <div class="message-container">
                            <!-- 显示发送者头像，可以根据需要修改 -->
                            <el-avatar :src="message.sender === 'user' ? userAvatar : botAvatar"
                            class="message-avatar" ></el-avatar>
                            <!-- 显示消息内容 -->
                            <div class="message-content" :body-style="{ padding: '0px'  }">
                                <markdown-renderer :markdownContent="message.content" />
                        </div>
                        </div>
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

<style scoped>
/* 搜索按钮 */
.search-button {
  width: 256px;
  min-width: 210px;
  max-width: 60vw;
  height: 32px;
  border-radius: 6px;
  background: #f5f5f5;
  
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  padding: 0 12px;
  font-size: 14px;
  border: none;
}

.button-content {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left-content, .right-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 聊天容器 */

.the-search {
    display: fixed;
    margin: 0px  8px  0px 8px;
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



/*状态切换栏 */
.status-area {
    display: flex;
    margin-bottom: 10px;
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
    flex-shrink: 0;
}

/* 消息内容的样式 */
.message-content {
    display: inline-block;
    word-break: break-all;
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

.message-container{
    display: flex;
    align-items: flex-start;
    gap: 10px;
}
</style>