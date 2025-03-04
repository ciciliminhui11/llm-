
import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import chat_3 from "../../../views/chat_3.vue";
import { nextTick } from "vue";
import { ElMessage } from "element-plus";

// Mock Chat类
vi.mock("../../../service/coze_SDK", () => ({
  Chat: vi.fn().mockImplementation(() => ({
    initiateChat: vi.fn().mockResolvedValue(undefined),
  })),
}));

describe('chat_3.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(chat_3);
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('beforeUpload 函数应正确处理文件选择', async () => {
    // 模拟一个文件
    const selectedFile = { type: 'image/jpeg', size: 1024 };
    wrapper.vm.beforeUpload(selectedFile);
    // 验证文件是否正确赋值
    expect(wrapper.vm.file).toBe(selectedFile);
  });

  it('uploadFile 函数在没有选择文件时应显示错误信息', async () => {
    // 模拟文件为空
    wrapper.vm.file = null;
    await wrapper.vm.uploadFile();
    // 验证是否调用了ElMessage.error方法
    expect(ElMessage.error).toHaveBeenCalledWith('请选择文件');
  });
});
