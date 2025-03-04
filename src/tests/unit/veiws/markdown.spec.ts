// markdown.vue.spec.js
import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import markdown from "../../../components/markdown.vue";
import { nextTick } from "vue";

// 模拟navigator.clipboard.writeText方法
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn()
  }
});

describe('markdown.vue', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = mount(markdown, {
      props: {
        markdownContent: '# Test Markdown'
      }
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('handleCopy 函数应正确复制代码', async () => {
    const preElement = wrapper.find('pre');
    const button = wrapper.find('.copy-button');
    await button.trigger('click');
    // 验证是否调用了navigator.clipboard.writeText方法
    expect(navigator.clipboard.writeText).toHaveBeenCalled();
  });
});
