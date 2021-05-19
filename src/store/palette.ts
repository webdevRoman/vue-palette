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
    },

    SET_LINES_STYLE(state: State, style: LineStyles) {
      state.palette.levels.forEach(level => level.lineStyle = style)
    },

    SET_LINES_WIDTH(state: State, width: number) {
      state.palette.levels.forEach(level => level.lineWidth = width)
    },

    SET_LINES_COLOR(state: State, color: Color) {
      state.palette.levels.forEach(level => level.lineColor = color)
    },

    ADD_LEVEL(state: State) {
      state.palette.levels.push({
        id: state.palette.levels.length > 0 ? state.palette.levels.length : 0,
        value: state.palette.levels.length > 0 ? state.palette.levels[0].value - 1 : 0,
        lineStyle: LineStyles.SOLID,
        lineWidth: 1,
        lineColor: new Color('RGB(0,0,0)'),
        fillColor: new Color('RGB(255,255,255)')
      } as Level)
    },

    DELETE_LEVELS(state: State, levels: Level[]) {
      if (levels.length === state.palette.levels.length) {
        state.palette.levels = []
      } else {
        levels.forEach(level => state.palette.levels.splice(state.palette.levels.indexOf(level), 1))
      }
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

    ADD_LEVEL({commit}) {
      commit('ADD_LEVEL')
      commit('SORT_LEVELS')
    },

    DELETE_LEVELS({commit}, levels: Level[]) {
      commit('DELETE_LEVELS', levels)
    }
  },

  getters: {
    palette: (state: State) => state.palette,
    levels: (state: State) => state.palette.levels,
    fileText: (state: State) => {
      let fileText = 'lines:type=' +
        Object.keys(ColormapTypes).find(key => ColormapTypes[key] === state.palette.linesColormapType) +
        ';preset=' +
        Object.keys(ColormapPresets).find(key => ColormapPresets[key] === state.palette.linesColormapPreset) +
        '\nfilling:type=' +
        Object.keys(ColormapTypes).find(key => ColormapTypes[key] === state.palette.fillingColormapType) +
        ';preset=' +
        Object.keys(ColormapPresets).find(key => ColormapPresets[key] === state.palette.fillingColormapPreset) +
        '\nvalue lineStyle lineWidth lineColor fillColor\n'
      state.palette.levels.forEach(level => fileText +=
        `${level.value} ${level.lineStyle} ${level.lineWidth} ${level.lineColor.rgb} ${level.fillColor.rgb}\n`)
      return fileText
    }
  }

}