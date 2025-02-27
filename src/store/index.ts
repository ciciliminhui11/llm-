import { createStore } from 'vuex';

export default createStore({
  state: {
    asideWidth: '300px', // aside 的初始宽度
  },
  mutations: {
    toggleAside(state) {
      // 切换宽度
      state.asideWidth = state.asideWidth === '300px' ? '0' : '300px';
    },
  },
  actions: {
    toggleAside({ commit }) {
      commit('toggleAside');
    },
  },
  getters: {
    asideWidth: (state) => state.asideWidth,
  },
});
