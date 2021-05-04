import {State} from '@/store/State'
import {Palette} from '@/models/Palette'
import {LineStyles} from '@/models/LineStyles'
import {Color} from '@/models/Color'
import {Level} from '@/models/Level'
import {ColormapTypes} from '@/models/ColormapTypes'
import {ColormapPresets} from '@/models/ColormapPresets'

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
    async READ_PALETTE_FROM_FILE({commit, dispatch}, file: File) {
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
      dispatch('SET_SCALE_LIMITS')
    },

    SET_LEVEL_VALUE({commit}, level: Level) {
      commit('SET_LEVEL_VALUE', level)
    },

    SORT_LEVELS({commit}) {
      commit('SORT_LEVELS')
    }
  },

  getters: {
    palette: (state: State) => state.palette,
    levels: (state: State) => state.palette.levels
  }

}