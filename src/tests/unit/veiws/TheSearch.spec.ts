import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import TheSearch from "../../../views/TheSearch.vue";
import { nextTick } from "vue";

// Mock Chat类
vi.mock("../../../service/coze_SDK", () => ({
  Chat: vi.fn().mockImplementation(() => ({
    initiateChat: vi.fn().mockResolvedValue(undefined),
  })),
}));

describe("TheSearch 组件", () => {
  // 测试初始化
  it("初始化", () => {
    const wrapper = mount(TheSearch);
    expect(wrapper.vm.newMessage).toBe("");
    expect(wrapper.vm.messages).toEqual([
      { sender: "bot", content: "你好！欢迎来到聊天界面。" },
    ]);
  });

  // 测试消息发送后一系列操作
  it("发送正常消息", async () => {
    const wrapper = mount(TheSearch);

    // 模拟 chatBox 元素
    const chatBox = document.createElement("div");
    chatBox.style.overflowY = "auto";
    chatBox.style.height = "200px";
    chatBox.innerHTML = '<div style="height: 400px;"></div>'; // 内容高度大于容器高度
    wrapper.vm.chatBox = chatBox;

    // 模拟发送消息
    wrapper.vm.newMessage = "Hello";
    await wrapper.find("button").trigger("click");

    //禁用按钮
    expect(wrapper.find(".send-button").attributes("disabled"));

    // 等待 nextTick 触发滚动
    await nextTick();

    // 验证 ScrollToBottom 方法是否被调用
    expect(chatBox.scrollTop).toBe(chatBox.scrollHeight - chatBox.clientHeight);
  });

  //发送空消息
  it("发送空消息", async () => {
    const wrapper = mount(TheSearch);

    // 模拟 chatBox 元素
    const chatBox = document.createElement("div");
    chatBox.style.overflowY = "auto";
    chatBox.style.height = "200px";
    chatBox.innerHTML = '<div style="height: 400px;"></div>'; // 内容高度大于容器高度
    wrapper.vm.chatBox = chatBox;

    // 模拟发送消息
    wrapper.vm.newMessage = "";
    await wrapper.find("button").trigger("click");

    // 验证 ScrollToBottom 方法是否被调用
    expect(chatBox.scrollTop).toBe(chatBox.scrollHeight - chatBox.clientHeight);
  });
});
