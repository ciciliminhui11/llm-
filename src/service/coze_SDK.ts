// sdk.ts
import { CozeAPI, RoleType, ChatEventType } from '@coze/api'; // 假设 'coze-api' 是你所使用的 SDK 包
import axios from 'axios'
export class Chat {
  private client: any;

  constructor() {
    // 创建 API 客户端实例
    this.client = new CozeAPI({
      token: 'pat_kYRPc16sLCJafNqPh0x5AUS38NugfXeGDW3kElnrqMYzkYTQTIzxY3PYjKGdqyLc',
      allowPersonalAccessTokenInBrowser: true,
      baseURL: 'https://api.coze.cn'
    });
  }

  async cancel_chat(conversationId: string, chatId: string) {
    try {
      // 发起请求获取列表数据
      const response = await this.client.chat.cancel(conversationId, chatId);

      console.log("Received response:", response); // 确保你收到了响应
      if (response.status === "canceled") {
        return 'canceled'
      } else {
        return 'false'
      }
    } catch (error) {
      // 捕获并打印异常
      console.error('Error in cancel_chat:', error instanceof Error ? error.message : error);
      return 'false'
    }
  };
  async create_chat(conversationId: string | undefined, botId: string, messageList: any[], onDataUpdate: (data: any) => void) {
    try {
      // 发起对话
      if (!conversationId) {
        console.log('No conversationId provided, will be set to undefined');
        conversationId = undefined;  // 如果没有传递有效的 conversationId，设置为 undefined
      }
      const post = {
        bot_id: botId,
        conversation_id: conversationId,
        user_id: '123',
        additional_messages: messageList,
        auto_save_history: true,
      };
      const response = await this.client.chat.stream(
        post
      );

      console.log("res", response)
      // 初始化 msg 为 Message 类型
      const msg = {
        bot_id: "",
        chat_id: "",
        conversation_id: "",
        created_at: "",
        status: "",
        content_type: "",
        content: "",
        reasoning_content:"",
      };

      // 假设 response 是流式返回的数据
      for await (const part of response) {
        console.log(JSON.stringify(part));
        if (part.event === ChatEventType.CONVERSATION_CHAT_CREATED) {
          console.log('[START]已经开始加载');
          msg.bot_id = part.data.bot_id;
          msg.chat_id = part.data.id;
          msg.conversation_id = part.data.conversation_id;
          msg.created_at = part.data.created_at;
          msg.status = "created";
          console.log(msg)
          onDataUpdate(msg);
        }
        else if (part.event === ChatEventType.CONVERSATION_MESSAGE_DELTA) {
          msg.content_type = part.data.content_type;
          msg.content += part.data.content || "";//加入内容
          msg.reasoning_content += part.data.reasoning_content || "";//加入内容
          msg.status = "loading";
          console.log(part.data.content)
          console.log(msg.content)
          onDataUpdate(msg);

        }
        else if (part.event === ChatEventType.CONVERSATION_MESSAGE_COMPLETED && part.data.type === "answer") {
          msg.content = part.data.content;
          console.log('最终回答：' + part.data.content)
          msg.status = "message_completed";
          onDataUpdate(msg);

        }
        else if (part.event === ChatEventType.CONVERSATION_CHAT_COMPLETED) {
          msg.status = "chat_completed";
          console.log(part.data.usage);
          onDataUpdate(msg);

        } else if (part.event === ChatEventType.DONE) {
          console.log('结束；' + part.data);

        } else if (part.event === ChatEventType.ERROR) {
          console.error(part.data);
        }
      }
    } catch (error) {
      // 捕获并打印异常
      console.error('Error in create_chat:', error instanceof Error ? error.message : error);
    }
  }
  // sendMessage 方法
  async initiateChat(newMessage: string, messages: any[]) {
    if (newMessage.trim()) {
      // 将新消息添加到聊天记录中，假设发送者是 user
      messages.push({
        sender: 'user',
        content: newMessage
      });

      try {
        const res = await this.client.chat.stream({
          bot_id: '7469023039142395904',
          user_id: '123',
          additional_messages: [
            {
              type: "question",
              role: RoleType.User,
              content_type: "text",
              content: newMessage
            }
          ],
          auto_save_history: true,
        });

        // 遍历流式响应
        for await (const chunk of res) {
          if (chunk.event === "conversation.chat.created") {
            console.log("对话创建成功");
            messages.push({
              sender: 'bot',
              content: '正在加载...'
            });
          } else if (chunk.event === "conversation.chat.in_progress") {
            console.log("回答正在加载");
          } else if (chunk.event === "conversation.message.delta") {
            console.log("正在流式输出");
            if (chunk.data && chunk.data.content) {
              const lastMessage = messages[messages.length - 1]; // 获取最后一个消息
              if (lastMessage) {
                lastMessage.content += chunk.data.content; // 追加内容
              }
            }
          } else if (chunk.event === "conversation.message.completed") {
            console.log("输出完毕");
            if (chunk.data && chunk.data.content && chunk.data.type === "answer") {
              const lastMessage = messages[messages.length - 1];
              if (lastMessage) {
                lastMessage.content = chunk.data.content;
              }
            }
          } else if (chunk.event === "conversation.chat.completed") {
            console.log("运行结束，共消耗" + chunk.data.usage?.token_count + " token");
          }
          console.log(chunk);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
  }
}

export class Bot {
  private client: any;

  //工作空间id
  private spaceId = '7461621692516319283';

  constructor() {
    // 创建 API 客户端实例
    this.client = new CozeAPI({
      token: 'pat_kYRPc16sLCJafNqPh0x5AUS38NugfXeGDW3kElnrqMYzkYTQTIzxY3PYjKGdqyLc',
      allowPersonalAccessTokenInBrowser: true,
      baseURL: 'https://api.coze.cn'
    });
  }

  async bots_list() {
    try {
      // 发起请求获取列表数据
      const response = await this.client.bots.list({
        space_id: this.spaceId,
        page_index: 1,
        page_size: 30,
      });

      console.log("Received response:", response); // 确保你收到了响应

      // 提取 space_bots 数据
      const list = response.space_bots;
      const bots: any[] = [];
      bots.push(...list); // 将新数据加入
      return bots

      console.log("Updated bots:", bots);  // 输出更新后的 bots 数组
    } catch (error) {
      // 捕获并打印异常
      console.error('Error in bots_list:', error instanceof Error ? error.message : error);
    }
  }
}
export class Conversation {
  private client: any;

  constructor() {
    // 创建 API 客户端实例
    this.client = new CozeAPI({
      token: 'pat_kYRPc16sLCJafNqPh0x5AUS38NugfXeGDW3kElnrqMYzkYTQTIzxY3PYjKGdqyLc',
      allowPersonalAccessTokenInBrowser: true,
      baseURL: 'https://api.coze.cn'
    });
  }

  async create_conversation(messageList: any[]) {
    try {
      let conversationObj = {}
      // 获取第一个消息对象的 content 数组，并查找其中 type 为 'text' 的对象
      const firstMessageContent = messageList[0]?.content;

      // 查找第一个 type 为 'text' 的对象，提取 text 内容的前 10 个字符
      let introduction = '';
      if (firstMessageContent) {
        const textMessage = firstMessageContent.find((item: any) => item.type === 'text');
        if (textMessage && textMessage.text) {
          introduction = textMessage.text.slice(0, 10); // 获取前 10 个字符
        }
      }
      // 构建 meta_data
      const metaData = {
        introduction: introduction,
      };
      console.log(metaData)

      // 将 messageList 中的每个对象的 content 进行 JSON.stringify
      const messages = messageList.map((message: any) => ({
        ...message,
        content: JSON.stringify(message.content)
      }));
      console.log(messages)

      // 发起请求创建会话
      const response = await this.client.conversations.create({
        messages: messages,  // 填充消息内容
        meta_data: metaData
      });

      console.log("Received response:", response); // 确保你收到了响应

      // 解构赋值获取 created_at, id 和 meta_data
      const { created_at, id, meta_data } = response;

      // 将获取的字段赋值到 conversationobj
      conversationObj = {
        created_at,
        id,
        meta_data
      };
      console.log("Conversation object:", conversationObj);
      return conversationObj
    } catch (error) {
      // 捕获并打印异常
      console.error('Error in create_conversation:', error instanceof Error ? error.message : error);
    }
  }

}
export class Message {
  private client: any;

  constructor() {
    // 创建 API 客户端实例
    this.client = new CozeAPI({
      token: 'pat_kYRPc16sLCJafNqPh0x5AUS38NugfXeGDW3kElnrqMYzkYTQTIzxY3PYjKGdqyLc',
      allowPersonalAccessTokenInBrowser: true,
      baseURL: 'https://api.coze.cn'
    });
  }

  async message_list(conversationId: string) {
    try {
      let messageList = [];
      // 发起请求查看会话消息列表
      const response = await this.client.conversations.messages.list(
        conversationId,//会话id
        {
          order: "asc"//正序
        }
      );
      console.log("Received response:", response); // 确保你收到了响应
      messageList = response.data
      console.log(messageList)
      return messageList
    } catch (error) {
      // 捕获并打印异常
      console.error('Error in message_list:', error instanceof Error ? error.message : error);
    }
  }

  async message_delete(conversationId: string, messageId: string) {
    try {
      // 发起删除指定会话消息
      const response = await this.client.conversations.messages.delete(
        conversationId,//会话id
        messageId,//要删除的消息id
      );
      console.log("被删除的信息详情:", response); // 确保你收到了响应
      return response
    } catch (error) {
      // 捕获并打印异常
      console.error('Error in message_delete:', error instanceof Error ? error.message : error);
    }
  }
}

export class File {

  async upload(file: any) {
    try {
      console.log(file)
      const formData = new FormData();
      formData.append('file', file); // 添加文件到 FormData
      const response = await axios.post(' https://api.coze.cn/v1/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer pat_kYRPc16sLCJafNqPh0x5AUS38NugfXeGDW3kElnrqMYzkYTQTIzxY3PYjKGdqyLc',  // 添加 Authorization 头
        }
      });
      // 上传成功
      if (response.data.code === 0) {
        console.log('文件上传成功:', response);
        return response.data.data
      } else {
        throw new Error(`文件上传失败，错误代码: ${response.data.code}, 错误信息: ${response.data.msg || '无详细信息'}`);
      }
    } catch (error) {
      // 捕获并打印异常
      console.error('Error in message_list:', error instanceof Error ? error.message : error);
    }
  }

}