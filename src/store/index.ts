import { createStore } from 'vuex';

export default createStore({
  state: {
    asideWidth: '260px', // aside 的初始宽度
    isAsideCollapsed: false, // aside 的折叠状态
    selectedConversationId: '', // 选中的会话 ID
    conversations: [
      { id: '7477135731110985737', name: '你好' },
      { id: '7477135640900010034', name: '早上好' },
      { id: "7477156985641910324", name: "我是大帅哥吗啊啊啊啊啊啊啊啊" },
      { id: "7477163329539260435", name: "请你生成一段代码js" },
    ], // 会话列表
  },
  mutations: {
    toggleAside(state) {
      // 切换宽度
      state.asideWidth = state.asideWidth === '260px' ? '0' : '260px';
      state.isAsideCollapsed = !state.isAsideCollapsed;
    },
    setSelectedConversationId(state, conversationId: string) {
      state.selectedConversationId = conversationId;
    },
    addConversation(state, conversation) {
      state.conversations.unshift(conversation);
    },
  },
  actions: {
    toggleAside({ commit }) {
      commit('toggleAside');
    },
    setSelectedConversationId({ commit }, conversationId: string) {
      commit('setSelectedConversationId', conversationId);
    },
    addConversation({ commit }, conversation) {
      commit('addConversation', conversation);
    },
  },
  getters: {
    asideWidth: (state) => state.asideWidth,
    isAsideCollapsed: (state) => state.isAsideCollapsed,
    selectedConversationId: (state) => state.selectedConversationId,
    conversations: (state) => state.conversations,
  },
});
