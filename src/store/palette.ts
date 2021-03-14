import {State} from '@/models/State'
import {Palette} from '@/models/Palette'
import {LineStyles} from '@/models/LineStyles'
import {Color} from '@/models/Color'
import {Level} from '@/models/Level'

export default {

  state: () => ({
    palette: null as Palette
  }),

  mutations: {
    SET_PALETTE(state: State, palette: Palette) {
      state.palette = palette
    }
  },

  actions: {
    async READ_PALETTE_FROM_FILE({commit}, file: File) {
      const fileText: string = await file.text()
      const fileTextLines: string[] = fileText.split('\n')
      const levelsLines: string[] = [...fileTextLines]
      levelsLines.shift()
      levelsLines.shift()

      const palette = {
        type: fileTextLines[0],
        levels: [],
        fileText: fileText
      } as Palette

      levelsLines.forEach(line => {
        const levelFields: string[] = line.split(' ')
        palette.levels.push({
          value: parseInt(levelFields[0]),
          lineStyle: Object.keys(LineStyles).find(it => it === levelFields[1].toUpperCase()),
          lineWidth: parseInt(levelFields[2]),
          lineColor: new Color(levelFields[3]),
          fillColor: new Color(levelFields[4])
        } as Level)
      })

      commit('SET_PALETTE', palette)
    }
  },

  getters: {
    palette: (state: State) => state.palette,
    levels: (state: State) => state.palette.levels
  }

}