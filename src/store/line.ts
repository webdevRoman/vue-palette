import {State} from '@/store/State'
import {Palette} from '@/models/Palette'
import {LineStyles} from '@/models/LineStyles'
import {Color} from '@/models/Color'
import {Level} from '@/models/Level'

export default {

  state: () => ({
    showLineDialog: false,
    editableLevelLine: null
  }),

  mutations: {
    SHOW_LINE_DIALOG(state: State, level: Level) {
      state.showLineDialog = true
      state.editableLevelLine = level
    },

    HIDE_LINE_DIALOG(state: State) {
      state.showLineDialog = false
      state.editableLevelLine = null
    }
  },

  actions: {
    SHOW_LINE_DIALOG({commit}, level: Level) {
      commit('SHOW_LINE_DIALOG', level)
    },

    HIDE_LINE_DIALOG({commit}) {
      commit('HIDE_LINE_DIALOG')
    },

    UPDATE_LINE({commit, getters}, lineProps: any) {
      commit('UPDATE_LEVEL_LINE', {...lineProps, levelId: getters.editableLevelLine?.id})
    }
  },

  getters: {
    showLineDialog: (state: State) => state.showLineDialog,
    editableLevelLine: (state: State) => state.editableLevelLine
  }

}