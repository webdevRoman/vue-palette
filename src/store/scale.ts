import {State} from '@/store/State'

interface ScaleLimits {
  scaleMin: number;
  scaleMax: number;
  scaleInterval: number;
}

export default {

  state: () => ({
    showScaleDialog: false,
    scaleMin: null,
    scaleMax: null,
    scaleInterval: 25
  }),

  mutations: {
    SHOW_SCALE_DIALOG(state: State) {
      state.showScaleDialog = true
    },

    HIDE_SCALE_DIALOG(state: State) {
      state.showScaleDialog = false
    },

    SET_SCALE_LIMITS(state: State, scaleLimits: ScaleLimits) {
      state.scaleMin = scaleLimits.scaleMin
      state.scaleMax = scaleLimits.scaleMax
      state.scaleInterval = scaleLimits.scaleInterval
    }
  },

  actions: {
    SHOW_SCALE_DIALOG({commit}) {
      commit('SHOW_SCALE_DIALOG')
    },

    HIDE_SCALE_DIALOG({commit}) {
      commit('HIDE_SCALE_DIALOG')
    },

    SET_SCALE_LIMITS({commit, getters}, dataLimits?: ScaleLimits) {
      let dataLimitsMin, dataLimitsMax, dataLimitsInterval
      if (dataLimits) {
        dataLimitsMin = dataLimits.scaleMin
        dataLimitsMax = dataLimits.scaleMax
        dataLimitsInterval = dataLimits.scaleInterval
      } else {
        dataLimitsMin = getters.levels[0].value
        dataLimitsMax = getters.levels[getters.levels.length - 1].value
        dataLimitsInterval = getters.scaleInterval
      }
      const scaleLimits = {
        scaleMin: dataLimitsMin - dataLimitsMin % dataLimitsInterval,
        scaleMax: dataLimitsMax + dataLimitsInterval - dataLimitsMax % dataLimitsInterval,
        scaleInterval: dataLimitsInterval
      } as ScaleLimits
      commit('SET_SCALE_LIMITS', scaleLimits)
    }
  },

  getters: {
    showScaleDialog: (state: State) => state.showScaleDialog,
    scaleMin: (state: State) => state.scaleMin,
    scaleMax: (state: State) => state.scaleMax,
    scaleInterval: (state: State) => state.scaleInterval
  }

}