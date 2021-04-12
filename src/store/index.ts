// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import {createStore} from 'vuex'
import {State} from '@/store/State'
import levelsDialog from '@/store/levelsDialog'
import palette from '@/store/palette'
// import editableLevel from '@/store/editableLevel'

export default createStore<State>({
  modules: {
    levelsDialog,
    palette,
    // editableLevel
  }
})