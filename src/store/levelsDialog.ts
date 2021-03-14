import {State} from '@/models/State'

export default {

  state: () => ({
    showLevelsDialog: false
  }),

  mutations: {
    SHOW_LEVELS_DIALOG(state: State) {
      state.showLevelsDialog = true
    },

    HIDE_LEVELS_DIALOG(state: State) {
      state.showLevelsDialog = false
    }
  },

  actions: {
    SHOW_LEVELS_DIALOG({commit}) {
      commit('SHOW_LEVELS_DIALOG')
    },

    HIDE_LEVELS_DIALOG({commit}) {
      commit('HIDE_LEVELS_DIALOG')
    }
  },

  getters: {
    showLevelsDialog: (state: State) => state.showLevelsDialog
  }

}