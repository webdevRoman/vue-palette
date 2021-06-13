import {State} from '@/store/State'
import {Level} from '@/models/Level'
import {Palette} from '@/models/Palette'
import {countValue, formatLevelsToScalable} from '@/store/scale'
import {Colormap} from '@/models/Colormap'
import {ColormapPresets} from '@/models/ColormapPresets'
import {SliderDot} from '@/models/SliderDot'
import {LineStyles} from '@/models/LineStyles'
import {Color} from '@/models/Color'

export default {

  state: () => ({
    showLineDialog: false,
    editableLevelLine: null,
    showLinesDialog: false
  }),

  mutations: {
    SHOW_LINE_DIALOG(state: State, level: Level) {
      state.editableLevelLine = level
      state.showLineDialog = true
    },

    HIDE_LINE_DIALOG(state: State) {
      state.showLineDialog = false
      state.editableLevelLine = null
    },

    SHOW_LINES_DIALOG(state: State) {
      state.showLinesDialog = true
    },

    HIDE_LINES_DIALOG(state: State) {
      state.showLinesDialog = false
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
    },

    SHOW_LINES_DIALOG({commit, getters}) {
      const palette = getters.palette as Palette
      const levels = formatLevelsToScalable(palette.levels)
      const colormap = {
        type: null,
        preset: null,
        sliderDots: []
      } as Colormap
      colormap.type = palette.linesColormapType
      colormap.preset = palette.linesColormapPreset
      if (colormap.preset === ColormapPresets.CUSTOM) {
        levels.forEach(level => colormap.sliderDots.push({
          value: level.value,
          perCentValue: level.scaleValue,
          color: level.lineColor
        } as SliderDot))
      } else {
        const presetSliderDots = getters.colormapPresets.find(preset => preset.preset === colormap.preset).sliderDots
        presetSliderDots.forEach((dot: SliderDot) => {
          dot.value = countValue(dot.perCentValue, levels[0].value, levels[levels.length - 1].value)
        })
        colormap.sliderDots = presetSliderDots
      }
      commit('SET_COLORMAP', colormap)
      commit('SHOW_LINES_DIALOG')
    },

    HIDE_LINES_DIALOG({commit}) {
      commit('HIDE_LINES_DIALOG')
      commit('RESET_COLORMAP_STATE')
    },

    SET_LINES_STYLE({commit}, style: LineStyles) {
      commit('SET_LINES_STYLE', style)
    },

    SET_LINES_WIDTH({commit}, width: number) {
      commit('SET_LINES_WIDTH', width)
    },

    SET_LINES_COLOR({commit}, color: Color) {
      commit('SET_LINES_COLOR', color)
    }
  },

  getters: {
    showLineDialog: (state: State) => state.showLineDialog,
    editableLevelLine: (state: State) => state.editableLevelLine,
    showLinesDialog: (state: State) => state.showLinesDialog
  }

}