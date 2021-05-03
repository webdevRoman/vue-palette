import {State} from '@/store/State'
import {SliderDot} from '@/models/SliderDot'
import {COLORMAP_FILLING} from '@/models/Constants'
import {formatLevelsToScalable} from '@/store/scale'

export default {

  state: () => ({
    showColormapDialog: false,
    sliders: null
  }),

  mutations: {
    SHOW_COLORMAP_DIALOG(state: State, sliders: SliderDot[]) {
      state.sliders = sliders
      state.showColormapDialog = true
    },

    HIDE_COLORMAP_DIALOG(state: State) {
      state.showColormapDialog = false
      state.sliders = null
    }
  },

  actions: {
    SHOW_COLORMAP_DIALOG({commit, getters}, initiator: string) {
      const sliders: SliderDot[] = []
      const levels = formatLevelsToScalable(getters.levels)
      if (initiator === COLORMAP_FILLING) {
        levels.forEach(level => sliders.push({
          value: level.value,
          perCentValue: level.scaleValue * 100,
          color: level.fillColor
        } as SliderDot))
      } else {
        levels.forEach(level => sliders.push({
          value: level.value,
          perCentValue: level.scaleValue * 100,
          color: level.lineColor
        } as SliderDot))
      }

      commit('SHOW_COLORMAP_DIALOG', sliders)
    },

    HIDE_COLORMAP_DIALOG({commit}) {
      commit('HIDE_COLORMAP_DIALOG')
    }
  },

  getters: {
    showColormapDialog: (state: State) => state.showColormapDialog,
    sliders: (state: State) => state.sliders
  }

}