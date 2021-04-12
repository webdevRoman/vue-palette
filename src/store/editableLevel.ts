import {State} from '@/store/State'
import {Level} from '@/models/Level'

export default {

  state: () => ({
    editableLevel: null
  }),

  mutations: {
    SET_EDITABLE_LEVEL(state: State, editableLevel: Level) {
      state.editableLevel = editableLevel
    },

    RESET_EDITABLE_LEVEL(state: State) {
      state.editableLevel = null
    }
  },

  actions: {
    SET_EDITABLE_LEVEL({commit, getters}, levelId: number) {
      commit('SET_EDITABLE_LEVEL', getters.levels.find(level => level.id === levelId))
    },

    RESET_EDITABLE_LEVEL({commit}) {
      commit('RESET_EDITABLE_LEVEL')
    }
  },

  getters: {
    editableLevel: (state: State) => state.editableLevel
  }

}