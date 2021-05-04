import {State} from '@/store/State'
import {countValue, formatLevelsToScalable} from '@/store/scale'
import {COLORMAP_FILLING} from '@/models/Constants'
import {Colormap} from '@/models/Colormap'
import {SliderDot} from '@/models/SliderDot'
import {Palette} from '@/models/Palette'
import {ColormapTypes} from '@/models/ColormapTypes'
import {ColormapPresets} from '@/models/ColormapPresets'
import {Color} from '@/models/Color'

export default {

  state: () => ({
    showColormapDialog: false,
    colormap: null,
    colormapPresets: [{
      type: ColormapTypes.GRADIENT,
      preset: ColormapPresets.GRAYSCALE,
      sliderDots: [
        {value: 0, perCentValue: 0, color: new Color('RGB(0,0,0)')},
        {value: 100, perCentValue: 100, color: new Color('RGB(255,255,255)')}
      ],
      gradientStyle: 'background: linear-gradient(to right, #000000 0%, #ffffff 100%)'
    }, {
      type: ColormapTypes.GRADIENT,
      preset: ColormapPresets.RAINBOW,
      sliderDots: [
        {value: 0, perCentValue: 0, color: new Color('RGB(153,102,255)')},
        {value: 20, perCentValue: 20, color: new Color('RGB(0,0,255)')},
        {value: 40, perCentValue: 40, color: new Color('RGB(0,255,0)')},
        {value: 60, perCentValue: 60, color: new Color('RGB(255,255,0)')},
        {value: 80, perCentValue: 80, color: new Color('RGB(255,102,0)')},
        {value: 100, perCentValue: 100, color: new Color('RGB(255,0,0)')}
      ],
      gradientStyle: 'background: linear-gradient(to right, #9966ff 0%, #0000ff 20%,' +
        ' #00ff00 40%, #ffff00 60%, #ff6600 80%, #ff0000 100%)'
    }, {
      type: ColormapTypes.GRADIENT,
      preset: ColormapPresets.CUSTOM,
      sliderDots: [],
      gradientStyle: 'background: linear-gradient(to right, #ffffff 0%, #ffffff 100%)'
    }]
  }),

  mutations: {
    SHOW_COLORMAP_DIALOG(state: State, colormap: Colormap) {
      state.colormap = colormap
      state.showColormapDialog = true
    },

    SET_CUSTOM_PRESET(state: State, sliderDots: SliderDot[]) {
      const customPreset = state.colormapPresets.find(preset => preset.preset === ColormapPresets.CUSTOM)
      customPreset.sliderDots = sliderDots
    },

    HIDE_COLORMAP_DIALOG(state: State) {
      state.showColormapDialog = false
      state.colormap = null
    }
  },

  actions: {
    SHOW_COLORMAP_DIALOG({commit, getters}, initiator: string) {
      const colormap = {
        type: null,
        preset: null,
        sliderDots: []
      } as Colormap
      const palette = getters.palette as Palette
      const levels = formatLevelsToScalable(palette.levels)
      if (initiator === COLORMAP_FILLING) {
        colormap.type = palette.fillingColormapType
        colormap.preset = palette.fillingColormapPreset
        if (colormap.preset === ColormapPresets.CUSTOM) {
          levels.forEach(level => colormap.sliderDots.push({
            value: level.value,
            perCentValue: level.scaleValue * 100,
            color: level.fillColor
          } as SliderDot))
        }
      } else {
        colormap.type = palette.linesColormapType
        colormap.preset = palette.linesColormapPreset
        if (colormap.preset === ColormapPresets.CUSTOM) {
          levels.forEach(level => colormap.sliderDots.push({
            value: level.value,
            perCentValue: level.scaleValue * 100,
            color: level.lineColor
          } as SliderDot))
        }
      }

      if (colormap.preset !== ColormapPresets.CUSTOM) {
        const presetSliderDots = getters.colormapPresets.find(preset => preset.preset === colormap.preset).sliderDots
        presetSliderDots.forEach((dot: SliderDot) => {
          dot.value = countValue(dot.perCentValue, levels[0].value, levels[levels.length - 1].value)
        })
        colormap.sliderDots = presetSliderDots
      }
      commit('SET_CUSTOM_PRESET', colormap.sliderDots)

      commit('SHOW_COLORMAP_DIALOG', colormap)
    },

    SET_CUSTOM_PRESET({commit}, sliderDots: SliderDot[]) {
      commit('SET_CUSTOM_PRESET', sliderDots)
    },

    HIDE_COLORMAP_DIALOG({commit}) {
      commit('HIDE_COLORMAP_DIALOG')
    }
  },

  getters: {
    showColormapDialog: (state: State) => state.showColormapDialog,
    colormap: (state: State) => state.colormap,
    colormapPresets: (state: State) => state.colormapPresets
  }

}