import {State} from '@/store/State'
import {SliderDot} from '@/models/SliderDot'
import {COLORMAP_FILLING} from '@/models/Constants'
import {formatLevelsToScalable} from '@/store/scale'

export default {

  state: () => ({
    showColormapDialog: false,
    sliderDots: null
  }),

  mutations: {
    SHOW_COLORMAP_DIALOG(state: State, sliderDots: SliderDot[]) {
      state.sliderDots = sliderDots
      state.showColormapDialog = true
    },

    HIDE_COLORMAP_DIALOG(state: State) {
      state.showColormapDialog = false
      state.sliderDots = null
    }
  },

  actions: {
    SHOW_COLORMAP_DIALOG({commit, getters}, initiator: string) {
      const sliderDots: SliderDot[] = []
      const levels = formatLevelsToScalable(getters.levels)
      if (initiator === COLORMAP_FILLING) {
        levels.forEach(level => sliderDots.push({
          value: level.value,
          perCentValue: level.scaleValue * 100,
          color: level.fillColor
        } as SliderDot))
      } else {
        levels.forEach(level => sliderDots.push({
          value: level.value,
          perCentValue: level.scaleValue * 100,
          color: level.lineColor
        } as SliderDot))
      }

      commit('SHOW_COLORMAP_DIALOG', sliderDots)
    },

    HIDE_COLORMAP_DIALOG({commit}) {
      commit('HIDE_COLORMAP_DIALOG')
    }
  },

  getters: {
    showColormapDialog: (state: State) => state.showColormapDialog,
    sliderDots: (state: State) => state.sliderDots
  }

}