
import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import ChatView from "@/views/ChatView.vue";
import { nextTick } from "vue";
import { createStore } from "vuex";

// 模拟Vuex store
const store = createStore({
  state: {
    asideWidth: '200px',
    isAsideCollapsed: false
  },
  getters: {
    asideWidth: state => state.asideWidth,
    isAsideCollapsed: state => state.isAsideCollapsed
  },
  mutations: {},
  actions: {}
});

describe('ChatView.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(ChatView, {
      global: {
        plugins: [store]
      }
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('should update screenWidth on window resize', async () => {
    const originalWidth = window.innerWidth;
    window.innerWidth = 320;
    window.dispatchEvent(new Event('resize'));
    await nextTick();
    expect(wrapper.vm.screenWidth).toBe(320);
    window.innerWidth = originalWidth;
  });
});
