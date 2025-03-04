
import { mount } from "@vue/test-utils";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import collapseButton from "../../../components/collapseButton.vue";
import { nextTick } from "vue";
import { createStore } from "vuex";

// 模拟Vuex store
const store = createStore({
  state: {
    isAsideCollapsed: false
  },
  getters: {
    isAsideCollapsed: state => state.isAsideCollapsed
  },
  mutations: {},
  actions: {
    toggleAside: vi.fn()
  }
});

describe('collapseButton.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(collapseButton, {
      global: {
        plugins: [store]
      }
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it('toggleAside 函数应正确触发 store.dispatch', async () => {
    const button = wrapper.find('el-button');
    await button.trigger('click');
    // 验证是否调用了store.dispatch方法
    expect(store.dispatch).toHaveBeenCalledWith('toggleAside');
  });
});
