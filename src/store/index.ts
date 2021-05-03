// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import {createStore} from 'vuex'
import {State} from '@/store/State'
import levelsDialog from '@/store/levelsDialog'
import palette from '@/store/palette'
import scale from '@/store/scale'
import errors from '@/store/errors'
import line from '@/store/line'
import colormap from '@/store/colormap'

export default createStore<State>({
  modules: {
    errors,
    levelsDialog,
    palette,
    scale,
    line,
    colormap
  }
})