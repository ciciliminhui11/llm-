
export const layoutModule = {
    namespaced: true,
    state: () => ({
      isSidebarCollapsed: false,
      sidebarWidth: 240,
      collapsedWidth: 64
    }),
    mutations: {
      TOGGLE_SIDEBAR(state: { isSidebarCollapsed: boolean }) {
        state.isSidebarCollapsed = !state.isSidebarCollapsed
      }
    },
    actions: {
      toggleSidebar({ commit }: { commit: Function }) {
        commit('TOGGLE_SIDEBAR')
      }
    },
    getters: {
      getCollapsedState: (state:any) => state.isSidebarCollapsed,
      getSidebarWidth: (state:any)=> state.sidebarWidth,
      getCollapsedWidth: (state:any) => state.collapsedWidth
    }
  }