import {State} from '@/store/State'
import {Palette} from '@/models/Palette'
import {LineStyles} from '@/models/LineStyles'
import {Color} from '@/models/Color'
import {Level} from '@/models/Level'
import {ColormapTypes} from '@/models/ColormapTypes'
import {ColormapPresets} from '@/models/ColormapPresets'
import {Colormap} from '@/models/Colormap'
import {ColormapInitiators} from '@/models/ColormapInitiators'
import {binarySearch, countPerCent, formatLevelsToScalable} from '@/store/scale'
import {SliderDot} from '@/models/SliderDot'

export default {

  state: () => ({
    palette: null
  }),

  mutations: {
    SET_PALETTE(state: State, palette: Palette) {
      state.palette = palette
    },

    SORT_LEVELS(state: State) {
      state.palette.levels.sort((a, b) => a.value - b.value)
    },

    SET_LEVEL_VALUE(state: State, level: Level) {
      const editableLevel = state.palette.levels.find(it => it.id === level.id)
      editableLevel.value = level.value
    },

    UPDATE_LEVEL_LINE(state: State, lineProps: any) {
      const level = state.palette.levels.find(level => level.id === lineProps.levelId)
      level.lineStyle = LineStyles[lineProps.style]
      level.lineColor = new Color(lineProps.color)
      level.lineWidth = lineProps.width
    }
  },

  actions: {
    async READ_PALETTE_FROM_FILE({commit}, file: File) {
      const fileText: string = await file.text()
      const fileTextLines: string[] = fileText.split('\n')
      const levelsLines: string[] = [...fileTextLines]
      levelsLines.shift()
      levelsLines.shift()
      levelsLines.shift()

      const palette = {
        linesColormapType: ColormapTypes[fileTextLines[0].split(';')[0].substring(11).trim().toUpperCase()],
        linesColormapPreset: ColormapPresets[fileTextLines[0].split(';')[1].substring(7).trim().toUpperCase()],
        fillingColormapType: ColormapTypes[fileTextLines[1].split(';')[0].substring(13).trim().toUpperCase()],
        fillingColormapPreset: ColormapPresets[fileTextLines[1].split(';')[1].substring(7).trim().toUpperCase()],
        levels: [],
        fileText: fileText
      } as Palette

      let id = 0
      levelsLines.forEach(line => {
        const levelFields: string[] = line.split(' ')
        palette.levels.push({
          id: id++,
          value: parseInt(levelFields[0]),
          lineStyle: Object.keys(LineStyles).find(it => it === levelFields[1].toUpperCase()),
          lineWidth: parseInt(levelFields[2]),
          lineColor: new Color(levelFields[3]),
          fillColor: new Color(levelFields[4])
        } as Level)
      })

      commit('SET_PALETTE', palette)
      commit('SORT_LEVELS')
    },

    SET_LEVEL_VALUE({commit}, level: Level) {
      commit('SET_LEVEL_VALUE', level)
    },

    SORT_LEVELS({commit}) {
      commit('SORT_LEVELS')
    },

    APPLY_COLORMAP({commit, getters}, colormap: Colormap) {
      const initiator: ColormapInitiators = getters.colormapInitiator
      const palette: Palette = getters.palette

      if (initiator === ColormapInitiators.FILLING) {
        palette.fillingColormapType = colormap.type
        palette.fillingColormapPreset = colormap.preset
      } else if (initiator === ColormapInitiators.LINES) {
        palette.linesColormapType = colormap.type
        palette.linesColormapPreset = colormap.preset
      }

      if (colormap.sliderDots[colormap.sliderDots.length - 1].perCentValue < 100) {
        colormap.sliderDots.push({
          value: palette.levels[palette.levels.length - 1].value,
          perCentValue: 100,
          color: colormap.sliderDots[colormap.sliderDots.length - 1].color
        })
      }

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
            level.fillColor = nearestSliderDot.color
          } else {
            const dotPerCent = countPerCent(level.value, leftSliderDot.value, rightSliderDot.value)
            let r, g, b
            // let minR, maxR, minG, maxG, minB, maxB
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
            level.fillColor = new Color(
              'RGB(' + r + ',' + g + ',' + b + ')'
            )
          }
        } else if (colormap.type === ColormapTypes.INTERVAL) {
          level.fillColor = leftSliderDot.color
        }
      })

      commit('SET_PALETTE', palette)
    }
  },

  getters: {
    palette: (state: State) => state.palette,
    levels: (state: State) => state.palette.levels
  }

}