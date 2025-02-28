import { createStore } from 'vuex';

export default createStore({
  state: {
    asideWidth: '260px', // aside 的初始宽度
    isAsideCollapsed: false, // aside 的折叠状态
  },
  mutations: {
    toggleAside(state) {
      // 切换宽度
      state.asideWidth = state.asideWidth === '260px' ? '0' : '260px';
      state.isAsideCollapsed = !state.isAsideCollapsed;
    },
  },
  actions: {
    toggleAside({ commit }) {
      commit('toggleAside');
    },
  },
  getters: {
    asideWidth: (state) => state.asideWidth,
    isAsideCollapsed: (state) => state.isAsideCollapsed,
  },
});
