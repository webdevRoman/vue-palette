import {State} from '@/store/State'
import {ColormapTypes} from '@/models/ColormapTypes'
import {ColormapPresets} from '@/models/ColormapPresets'
import {LineStyles} from '@/models/LineStyles'
import {Color} from '@/models/Color'
import {Palette} from '@/models/Palette'

const DEFAULT_PALETTE = {
  linesColormapType: ColormapTypes.GRADIENT,
  linesColormapPreset: ColormapPresets.CUSTOM,
  fillingColormapType: ColormapTypes.GRADIENT,
  fillingColormapPreset: ColormapPresets.RAINBOW,
  levels: [{
    id: 0, value: 0, lineStyle: LineStyles.SOLID, lineWidth: 1,
    lineColor: new Color('RGB(0,0,0)'), fillColor: new Color('RGB(153,102,255)')
  }, {
    id: 1, value: 20, lineStyle: LineStyles.SOLID, lineWidth: 1,
    lineColor: new Color('RGB(0,0,0)'), fillColor: new Color('RGB(0,0,255)')
  }, {
    id: 2, value: 40, lineStyle: LineStyles.SOLID, lineWidth: 1,
    lineColor: new Color('RGB(0,0,0)'), fillColor: new Color('RGB(0,255,0)')
  }, {
    id: 3, value: 60, lineStyle: LineStyles.SOLID, lineWidth: 1,
    lineColor: new Color('RGB(0,0,0)'), fillColor: new Color('RGB(255,255,0)')
  }, {
    id: 4, value: 80, lineStyle: LineStyles.SOLID, lineWidth: 1,
    lineColor: new Color('RGB(0,0,0)'), fillColor: new Color('RGB(255,102,0)')
  }, {
    id: 5, value: 100, lineStyle: LineStyles.SOLID, lineWidth: 1,
    lineColor: new Color('RGB(0,0,0)'), fillColor: new Color('RGB(255,0,0)')
  }],
  fileText: `
lines:type=GRADIENT;preset=CUSTOM
filling:type=GRADIENT;preset=RAINBOW
value lineStyle lineWidth lineColor fillColor
0 solid 1 RGB(0,0,0) RGB(153,102,255)
20 solid 1 RGB(0,0,0) RGB(0,0,255)
40 solid 1 RGB(0,0,0) RGB(0,255,0)
60 solid 1 RGB(0,0,0) RGB(255,255,0)
80 solid 1 RGB(0,0,0) RGB(255,102,0)
100 solid 1 RGB(0,0,0) RGB(255,0,0)
`
} as Palette

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
    SHOW_LEVELS_DIALOG({commit, getters}) {
      if (getters.palette === null) {
        commit('SET_PALETTE', DEFAULT_PALETTE)
      }
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