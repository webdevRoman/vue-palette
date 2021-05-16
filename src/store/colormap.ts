import {State} from '@/store/State'
import {binarySearch, countPerCent, countValue, formatLevelsToScalable} from '@/store/scale'
import {Colormap} from '@/models/Colormap'
import {SliderDot} from '@/models/SliderDot'
import {Palette} from '@/models/Palette'
import {ColormapTypes} from '@/models/ColormapTypes'
import {ColormapPresets} from '@/models/ColormapPresets'
import {Color} from '@/models/Color'
import {ColormapInitiators} from '@/models/ColormapInitiators'

export const getGradientStyle = (sortedSliderDots: SliderDot[], colormapType: ColormapTypes): string => {
  let dotsGradientString = ''
  if (colormapType === ColormapTypes.INTERVAL) {
    for (let i = 0; i < sortedSliderDots.length - 1; i++) {
      dotsGradientString += '#' + sortedSliderDots[i].color.hex + ' ' + sortedSliderDots[i].perCentValue +
        '%, #' + sortedSliderDots[i].color.hex + ' ' + sortedSliderDots[i + 1].perCentValue + '%, '
    }
    dotsGradientString += '#' + sortedSliderDots[sortedSliderDots.length - 1].color.hex + ' ' +
      sortedSliderDots[sortedSliderDots.length - 1].perCentValue + '%, #' +
      sortedSliderDots[sortedSliderDots.length - 1].color.hex + ' 100%, '
  } else {
    sortedSliderDots.forEach(dot => dotsGradientString += `#${dot.color.hex} ${dot.perCentValue}%, `)
  }
  return `background: linear-gradient(to right, ${dotsGradientString.substring(0, dotsGradientString.length - 2)})`
}

export default {

  state: () => ({
    showColormapDialog: false,
    colormapInitiator: null,
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
    SHOW_COLORMAP_DIALOG(state: State) {
      state.showColormapDialog = true
    },

    SET_COLORMAP_INITIATOR(state: State, initiator: ColormapInitiators) {
      state.colormapInitiator = initiator
    },

    SET_COLORMAP(state: State, colormap: Colormap) {
      state.colormap = colormap
    },

    SET_CUSTOM_PRESET(state: State, sliderDots: SliderDot[]) {
      const customPreset = state.colormapPresets.find(preset => preset.preset === ColormapPresets.CUSTOM)
      customPreset.sliderDots = sliderDots
    },

    HIDE_COLORMAP_DIALOG(state: State) {
      state.showColormapDialog = false
    },

    RESET_COLORMAP_STATE(state: State) {
      state.colormapInitiator = null
      state.colormap = null
      const customPreset = state.colormapPresets.find(preset => preset.preset === ColormapPresets.CUSTOM)
      customPreset.sliderDots = []
    }
  },

  actions: {
    SHOW_COLORMAP_DIALOG({commit, getters}, initiator: ColormapInitiators) {
      if (getters.colormap === null) {
        const colormap = {
          type: null,
          preset: null,
          sliderDots: []
        } as Colormap
        const palette = getters.palette as Palette
        const levels = formatLevelsToScalable(palette.levels)
        if (initiator === ColormapInitiators.FILLING) {
          colormap.type = palette.fillingColormapType
          colormap.preset = palette.fillingColormapPreset
          if (colormap.preset === ColormapPresets.CUSTOM) {
            levels.forEach(level => colormap.sliderDots.push({
              value: level.value,
              perCentValue: level.scaleValue,
              color: level.fillColor
            } as SliderDot))
          }
        } else if (initiator === ColormapInitiators.LINES) {
          colormap.type = palette.linesColormapType
          colormap.preset = palette.linesColormapPreset
          if (colormap.preset === ColormapPresets.CUSTOM) {
            levels.forEach(level => colormap.sliderDots.push({
              value: level.value,
              perCentValue: level.scaleValue,
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
        commit('SET_COLORMAP', colormap)
      }
      commit('SET_COLORMAP_INITIATOR', initiator)
      commit('SHOW_COLORMAP_DIALOG')
    },

    SET_CUSTOM_PRESET({commit}, sliderDots: SliderDot[]) {
      commit('SET_CUSTOM_PRESET', sliderDots)
    },

    HIDE_COLORMAP_DIALOG({commit, getters}) {
      commit('HIDE_COLORMAP_DIALOG')
      if (getters.colormapInitiator === ColormapInitiators.FILLING) {
        commit('RESET_COLORMAP_STATE')
      }
    },

    APPLY_COLORMAP({commit, dispatch, getters}, colormap: Colormap) {
      const initiator: ColormapInitiators = getters.colormapInitiator
      const palette: Palette = getters.palette

      if (colormap.sliderDots[colormap.sliderDots.length - 1].perCentValue < 100) {
        colormap.sliderDots.push({
          value: palette.levels[palette.levels.length - 1].value,
          perCentValue: 100,
          color: colormap.sliderDots[colormap.sliderDots.length - 1].color
        })
      }

      commit('SET_COLORMAP', colormap)

      if (initiator === ColormapInitiators.FILLING) {
        dispatch('APPLY_COLORMAP_TO_PALETTE', colormap)
      }
    },

    APPLY_COLORMAP_TO_PALETTE({commit, getters}, colormap: Colormap) {
      const initiator: ColormapInitiators = getters.colormapInitiator
      const palette: Palette = getters.palette

      let paletteColormapTypePropName, paletteColormapPresetPropName, levelColorPropName
      if (initiator === ColormapInitiators.FILLING) {
        paletteColormapTypePropName = 'fillingColormapType'
        paletteColormapPresetPropName = 'fillingColormapPreset'
        levelColorPropName = 'fillColor'
      } else if (initiator === ColormapInitiators.LINES) {
        paletteColormapTypePropName = 'linesColormapType'
        paletteColormapPresetPropName = 'linesColormapPreset'
        levelColorPropName = 'lineColor'
      }

      palette[paletteColormapTypePropName] = colormap.type
      palette[paletteColormapPresetPropName] = colormap.preset

      palette.levels.forEach(level => {
        const nearestSliderDot =
          binarySearch(colormap.sliderDots, level.value, 0, colormap.sliderDots.length - 1)
        const nearestSliderDotIndex = colormap.sliderDots.indexOf(nearestSliderDot)

        let leftSliderDot: SliderDot
        let rightSliderDot: SliderDot
        if (nearestSliderDot.value <= level.value) {
          leftSliderDot = nearestSliderDot
          rightSliderDot = nearestSliderDotIndex < (colormap.sliderDots.length - 1) ?
            colormap.sliderDots[nearestSliderDotIndex + 1] :
            colormap.sliderDots[colormap.sliderDots.length - 1]
        } else {
          leftSliderDot = nearestSliderDotIndex > 0 ?
            colormap.sliderDots[nearestSliderDotIndex - 1] :
            colormap.sliderDots[0]
          rightSliderDot = nearestSliderDot
        }

        if (colormap.type === ColormapTypes.GRADIENT) {
          if (level.value === nearestSliderDot.value) {
            level[levelColorPropName] = nearestSliderDot.color
          } else {
            const dotPerCent = countPerCent(level.value, leftSliderDot.value, rightSliderDot.value)
            let r, g, b
            if (leftSliderDot.color.rgbObj.r <= rightSliderDot.color.rgbObj.r) {
              r = leftSliderDot.color.rgbObj.r +
                (rightSliderDot.color.rgbObj.r - leftSliderDot.color.rgbObj.r) * dotPerCent / 100
            } else {
              r = rightSliderDot.color.rgbObj.r +
                (leftSliderDot.color.rgbObj.r - rightSliderDot.color.rgbObj.r) * (1 - dotPerCent / 100)
            }
            if (leftSliderDot.color.rgbObj.g <= rightSliderDot.color.rgbObj.g) {
              g = leftSliderDot.color.rgbObj.g +
                (rightSliderDot.color.rgbObj.g - leftSliderDot.color.rgbObj.g) * dotPerCent / 100
            } else {
              g = rightSliderDot.color.rgbObj.g +
                (leftSliderDot.color.rgbObj.g - rightSliderDot.color.rgbObj.g) * (1 - dotPerCent / 100)
            }
            if (leftSliderDot.color.rgbObj.b <= rightSliderDot.color.rgbObj.b) {
              b = leftSliderDot.color.rgbObj.b +
                (rightSliderDot.color.rgbObj.b - leftSliderDot.color.rgbObj.b) * dotPerCent / 100
            } else {
              b = rightSliderDot.color.rgbObj.b +
                (leftSliderDot.color.rgbObj.b - rightSliderDot.color.rgbObj.b) * (1 - dotPerCent / 100)
            }
            level[levelColorPropName] = new Color(
              'RGB(' + r + ',' + g + ',' + b + ')'
            )
          }
        } else if (colormap.type === ColormapTypes.INTERVAL) {
          level[levelColorPropName] = leftSliderDot.color
        }
      })

      commit('SET_PALETTE', palette)
    }
  },

  getters: {
    showColormapDialog: (state: State) => state.showColormapDialog,
    colormapInitiator: (state: State) => state.colormapInitiator,
    colormap: (state: State) => state.colormap,
    colormapPresets: (state: State) => state.colormapPresets
  }

}