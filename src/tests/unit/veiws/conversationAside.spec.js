
import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import conversationAside from "../../../components/conversationAside.vue";
import { nextTick } from "vue";
import { createStore } from "vuex";

// 模拟Vuex store
const store = createStore({
  state: {
    selectedConversationId: '1',
    conversations: [
      { id: '1', name: 'Conversation 1' },
      { id: '2', name: 'Conversation 2' }
    ],
    isAsideCollapsed: false
  },
  getters: {
    selectedConversationId: state => state.selectedConversationId,
    conversations: state => state.conversations,
    isAsideCollapsed: state => state.isAsideCollapsed
  },
  mutations: {},
  actions: {
    setSelectedConversationId: vi.fn(),
    toggleAside: vi.fn()
  }
});

describe('conversationAside.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(conversationAside, {
      global: {
        plugins: [store]
      }
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('handleSelect 函数应正确处理菜单选择', async () => {
    const menuItem = wrapper.find('el-menu-item');
    await menuItem.trigger('click');
    // 验证是否调用了store.dispatch方法
    expect(store.dispatch).toHaveBeenCalledWith('setSelectedConversationId', '1');
    expect(store.dispatch).toHaveBeenCalledWith('toggleAside');
  });
});
