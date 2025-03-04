import { mount } from  "@vue/test-utils";
import { describe, it, expect } from "vitest";
import Chat2 from"../../../views/chat_2.vue";

// 开始描述测试套件，测试 Chat2 组件
describe('Chat2 Component', () => {
  // 测试组件是否能正常渲染
  it('renders correctly', () => {
    // 挂载 Chat2 组件
    const wrapper = mount(Chat2);

    // 断言组件是否成功挂载
    expect(wrapper.exists()).toBe(true);

    // 检查聊天容器是否存在
    const chatContainer = wrapper.find('.chat-container');
    expect(chatContainer.exists()).toBe(true);

    // 检查输入框是否存在
    const inputBox = wrapper.find('.input-box');
    expect(inputBox.exists()).toBe(true);

    // 检查发送按钮是否存在
    const sendButton = wrapper.find('el-button');
    expect(sendButton.exists()).toBe(true);
  });

  // 测试发送消息功能
  it('sends a message when the send button is clicked', async () => {
    // 挂载 Chat2 组件
    const wrapper = mount(Chat2);

    // 模拟用户输入
    const inputBox = wrapper.find('.input-box');
    await inputBox.setValue('Test message');

    // 找到发送按钮并触发点击事件
    const sendButton = wrapper.find('el-button');
    await sendButton.trigger('click');

    // 检查消息列表是否更新
    const messages = wrapper.findAll('.message');
    expect(messages.length).toBeGreaterThan(0);
  });
});
